"""Generate src/data/photos.js: curated frames + inline base64 blur-up LQIP.

Thumbnails are fetched from the Unsplash CDN at w=150 into tools/thumbs/ on first
run and cached there, so this is a single command:

    python tools/gen_photos.py src/data/photos.js
"""
import base64, io, json, os, sys, urllib.request
from PIL import Image, ImageFilter

SP = os.path.dirname(os.path.abspath(__file__))
OUT = sys.argv[1]
THUMBS = os.path.join(SP, "thumbs")

# idx -> (unsplash id, category, title, place, year, alt)
# Tamil Nadu / South Indian wedding set: silk sarees, thaali, malli poo, manjal,
# temple and virundhu frames. No sherwani/turban/lehenga stock — that reads North
# Indian and this studio shoots Kongu-belt weddings.
# Places/titles are editorial dressing on stock frames — see CLAUDE.md, they are
# not real shoots.
META = {
    1:  ("1679937698873-6065742c8d32", "weddings",    "Before the Muhurtham","Madurai, TN",  2025, "Bride and groom being got ready in the moments before the muhurtham"),
    2:  ("1764286954620-28029fbae9b6", "weddings",    "Muhurtham",         "Coimbatore, TN", 2025, "Couple in traditional South Indian wedding dress at the thaali ceremony"),
    3:  ("1678705902081-5d55ab847046", "weddings",    "Side by Side",      "Chettinad, TN",  2024, "Bride and groom standing together in silk after the ceremony"),
    4:  ("1754782500863-2491466d575a", "weddings",    "After the Vows",    "Pollachi, TN",   2025, "Newlyweds in traditional attire resting on the grass after the ceremony"),
    5:  ("1674579097132-7ff78e832346", "weddings",    "The Two of Them",   "Kongu, TN",      2024, "Couple photographed together in wedding silks"),
    6:  ("1671852781674-c7dca34a1964", "weddings",    "First Look",        "Erode, TN",      2025, "Couple seeing each other for the first time on the wedding day"),
    7:  ("1715285977649-4a83c0820399", "weddings",    "A Quiet Moment",    "Ooty, TN",       2025, "Groom kissing the bride on the cheek away from the crowd"),
    8:  ("1715285977818-7bf580da7eeb", "weddings",    "Flower Field",      "Nilgiris, TN",   2025, "Groom carrying the bride through a field of flowers"),
    9:  ("1682933766299-81bf6fc4f2cb", "weddings",    "Down the Street",   "Chennai, TN",    2024, "Couple walking hand in hand down a street after the wedding"),
    10: ("1691075215352-f972825af829", "weddings",    "Just Married",      "Tirupur, TN",    2025, "Newly married couple standing together in traditional dress"),
    11: ("1727430201245-fb796167e302", "weddings",    "Held",              "Salem, TN",      2024, "Couple holding each other close during the couple shoot"),

    12: ("1678705730064-a7ecbab4b3fb", "portraits",   "The Bride",         "Thanjavur, TN",  2025, "Bride in a white and red silk saree photographed before the ceremony"),
    13: ("1717835735088-4c821959bdaa", "portraits",   "Kanchipuram Red",   "Kanchipuram, TN",2025, "Bride in a red and gold Kanchipuram silk wedding saree"),
    14: ("1769500801406-d5abac0429c3", "portraits",   "Maroon and Gold",   "Coimbatore, TN", 2025, "Bridal portrait in a maroon and gold silk saree"),
    15: ("1768341395956-fed92f537228", "portraits",   "Temple Jewellery",  "Kumbakonam, TN", 2024, "Close portrait of a bride in traditional gold temple jewellery and a red saree"),
    16: ("1617627143750-d86bc21e42bb", "portraits",   "Blue Border",       "Madurai, TN",    2024, "Woman in a red silk saree with a blue border"),
    17: ("1681220430066-75a6620c3a11", "portraits",   "The Saree",         "Chennai, TN",    2025, "Full-length portrait of a woman posing in a silk saree"),
    18: ("1770838446917-cf324f1be078", "portraits",   "Green Silk",        "Erode, TN",      2025, "Young woman in a green silk saree wearing an ornate gold necklace"),
    19: ("1771992226261-c1efb190ed34", "portraits",   "The Morning Of",    "Pollachi, TN",   2025, "Bride in full jewellery on the morning of the wedding"),
    20: ("1774437895887-d1e801bae1a9", "portraits",   "Paatti",            "Chettinad, TN",  2024, "Portrait of an elderly woman in traditional jewellery at the wedding"),
    21: ("1768341396111-62d47640b0f3", "portraits",   "Walking Away",      "Ooty, TN",       2024, "Woman in traditional dress walking away from the camera"),

    22: ("1686865604150-43f95d61416c", "rituals",     "Mehendi Night",     "Chettinad, TN",  2025, "South Indian bride's bangled hands stained with fresh henna"),
    23: ("1783495679509-0b004e40a450", "rituals",     "Red Bangles",       "Coimbatore, TN", 2025, "Detail of red bangles, kundan jewellery and silk against the bridal saree"),
    24: ("1783255166225-6890aee7381e", "rituals",     "Malli Poo",         "Madurai, TN",    2025, "Strand of white jasmine pinned into the bride's dark hair"),
    25: ("1754282183851-25dd5f7e9a78", "rituals",     "Flowers in Her Hair","Kongu, TN",     2024, "Bride's braid dressed with flowers over a red saree"),
    26: ("1759816660165-fc43d6578474", "rituals",     "Braided",           "Erode, TN",      2024, "Close crop of white flowers worked into a long braid"),
    27: ("1781154109462-d376de80c244", "rituals",     "Manjal",            "Salem, TN",      2025, "Bride in yellow with floral garlands at the turmeric ceremony"),
    28: ("1730003727902-3643640a3d43", "rituals",     "The Design",        "Coimbatore, TN", 2024, "Palms and fingers patterned with detailed mehndi work"),
    29: ("1731441326210-bfcb6595e93a", "rituals",     "Gold on Gold",      "Tirupur, TN",    2025, "Close crop of bangled hands stacked with gold jewellery"),
    30: ("1747691363125-b8642d21f6d4", "rituals",     "The Offering",      "Thanjavur, TN",  2024, "Fruit and flowers arranged on a leaf as a wedding offering"),

    31: ("1559264960-de587c8fcb41",    "celebration", "Flower Sellers",    "Chennai, TN",    2024, "Women selling flower garlands outside a Chennai temple"),
    32: ("1756370256926-e48ca54c5efe", "celebration", "Bharatanatyam",     "Thanjavur, TN",  2025, "Bharatanatyam dancers performing at the reception"),
    33: ("1756625105713-a23921601ff3", "celebration", "Therukoothu",       "Madurai, TN",    2025, "Therukoothu street theatre artist in full costume and make-up"),
    34: ("1649349103457-6d36bc03c0f8", "celebration", "Virundhu",          "Chettinad, TN",  2024, "Guests seated along a row of banana leaves at the wedding meal"),
    35: ("1743313826555-ea4102dd8bd1", "celebration", "The Gathering",     "Kongu, TN",      2025, "Wide frame of the families gathered for the ceremony"),
    36: ("1647374833994-511944202e38", "celebration", "The Pillar",        "Kumbakonam, TN", 2024, "Temple pillar dressed in flowers for the wedding"),
    37: ("1695549278493-d3059c8f8d4a", "celebration", "Morning Flowers",   "Pollachi, TN",   2025, "Flowers laid out on a table before the morning's rituals"),
    38: ("1642240231842-65462fedb8de", "celebration", "Seer Varisai",      "Coimbatore, TN", 2024, "Tray of coconuts, bananas and fruit prepared as wedding gifts"),
}

CDN = "https://images.unsplash.com/photo-"


def thumb(idx, uid):
    """Cached w=150 thumbnail — only these are read; full images stay on the CDN."""
    path = os.path.join(THUMBS, f"{idx:02d}_{uid}.jpg")
    if not os.path.exists(path):
        os.makedirs(THUMBS, exist_ok=True)
        req = urllib.request.Request(f"{CDN}{uid}?w=150&q=80", headers={"User-Agent": "gen_photos"})
        with urllib.request.urlopen(req, timeout=30) as r, open(path, "wb") as fh:
            fh.write(r.read())
        print(f"fetched {os.path.basename(path)}")
    return path


def lqip(path):
    im = Image.open(path).convert("RGB")
    im.thumbnail((16, 16), Image.LANCZOS)
    im = im.filter(ImageFilter.GaussianBlur(1.1))
    buf = io.BytesIO()
    im.save(buf, "JPEG", quality=35, optimize=True)
    return "data:image/jpeg;base64," + base64.b64encode(buf.getvalue()).decode()


def ratio(path):
    with Image.open(path) as im:
        return round(im.width / im.height, 4)


photos, total = [], 0
for idx in sorted(META):
    uid, cat, title, place, year, alt = META[idx]
    f = thumb(idx, uid)
    uri = lqip(f)
    total += len(uri)
    photos.append({
        "id": uid, "cat": cat, "title": title, "place": place,
        "year": year, "alt": alt, "ratio": ratio(f), "lqip": uri,
    })

body = ",\n".join("  " + json.dumps(p, ensure_ascii=False) for p in photos)

js = f"""// AUTO-GENERATED by tools/gen_photos.py — do not hand-edit the PHOTOS array.
// `lqip` is a 16px blurred JPEG data URI, so the placeholder costs zero requests.
// `ratio` is the true aspect ratio, used to size masonry rows without layout shift.

export const CATEGORIES = [
  {{ id: 'all', label: 'All Work' }},
  {{ id: 'weddings', label: 'Muhurtham' }},
  {{ id: 'portraits', label: 'Portraits' }},
  {{ id: 'rituals', label: 'Mehendi & Haldi' }},
  {{ id: 'celebration', label: 'Celebration' }},
];

export const PHOTOS = [
{body}
];

/** Lookup by title. Throws rather than handing a component `undefined` when the
 *  set is regenerated and a title it referenced no longer exists. */
export const byTitle = (t) => {{
  const p = PHOTOS.find((x) => x.title === t);
  if (!p) throw new Error(`photos.js: no frame titled "${{t}}"`);
  return p;
}};

const CDN = 'https://images.unsplash.com/photo-';

/** Responsive source off the Unsplash CDN (imgix): webp, quality-capped. */
export const src = (id, w) => `${{CDN}}${{id}}?w=${{w}}&q=72&fm=webp&fit=max`;

/** Cropped variant for fixed-ratio slots (hero, featured). */
export const srcCrop = (id, w, ar) =>
  `${{CDN}}${{id}}?w=${{w}}&q=72&fm=webp&fit=crop&crop=entropy&ar=${{ar}}`;

/** srcset ladder — the browser picks from `sizes`, so phones never pull 2400px. */
export const srcSet = (id, widths = [400, 800, 1200, 1800]) =>
  widths.map((w) => `${{src(id, w)}} ${{w}}w`).join(', ');
"""

os.makedirs(os.path.dirname(OUT) or ".", exist_ok=True)
with open(OUT, "w", encoding="utf-8") as fh:
    fh.write(js)

print(f"wrote {OUT}")
print(f"{len(photos)} photos | lqip payload {total/1024:.1f} KB | file {os.path.getsize(OUT)/1024:.1f} KB")
from collections import Counter
print(Counter(p["cat"] for p in photos))
