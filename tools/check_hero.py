"""Guard for the hero-title wrap trap (see CLAUDE.md).

Each hero line lives in a `.mask` whose child slides up, so a line that wraps
ruins the reveal. Font size is tied to the length of the slogan, and the font
changed to Playfair Display — which is wider per character than what it
replaced. This measures the real glyph advances and fails if either line
overflows the available width at the two widths that matter.

    python tools/check_hero.py
"""

import io
import re
import sys
import urllib.request
from pathlib import Path

from PIL import ImageFont

ROOT = Path(__file__).resolve().parent
CSS = ROOT.parent / "src" / "styles.css"
CACHE = ROOT / "fonts"

# github.com/google/fonts — the same outlines Google Fonts serves.
FONTS = {
    "regular": "https://raw.githubusercontent.com/google/fonts/main/ofl/playfairdisplay/PlayfairDisplay%5Bwght%5D.ttf",
    "italic": "https://raw.githubusercontent.com/google/fonts/main/ofl/playfairdisplay/PlayfairDisplay-Italic%5Bwght%5D.ttf",
}

# The two lines of the slogan, as Hero.jsx renders them.
LINES = [("Where tradition meets", "regular"), ("a modern lens", "italic")]

# (viewport px, label). 375 = smallest phone we care about, 1440 = desktop.
VIEWPORTS = [(375, "phone"), (1440, "desktop")]

MAX_CONTENT = 1560  # --max


def load(style):
    CACHE.mkdir(exist_ok=True)
    path = CACHE / f"playfair-{style}.ttf"
    if not path.exists():
        path.write_bytes(urllib.request.urlopen(FONTS[style]).read())
    return path


def css_clamp(name, pattern, vw):
    """Resolve a `clamp(<rem>, <vw>, <rem>)` from styles.css at a viewport."""
    m = re.search(pattern, CSS.read_text(encoding="utf8"))
    if not m:
        sys.exit(f"could not find {name} in styles.css — update the pattern")
    lo, mid, hi = (float(g) for g in m.groups())
    return max(lo * 16, min(mid / 100 * vw, hi * 16))


def main():
    ok = True
    for vw, label in VIEWPORTS:
        size = css_clamp(
            "hero title size",
            r"\.hero__title \{[^}]*?font-size: clamp\(([\d.]+)rem, ([\d.]+)vw, ([\d.]+)rem\)",
            vw,
        )
        pad = css_clamp("--pad", r"--pad: clamp\(([\d.]+)rem, ([\d.]+)vw, ([\d.]+)rem\)", vw)
        avail = min(vw, MAX_CONTENT) - 2 * pad

        for text, style in LINES:
            font = ImageFont.truetype(str(load(style)), int(round(size)))
            width = font.getlength(text)
            fits = width <= avail
            ok &= fits
            print(
                f"{'PASS' if fits else 'FAIL'}  {label} {vw}px  "
                f"{size:.0f}px {style:8s} {width:7.1f} / {avail:.1f}px  {text!r}"
            )

    if not ok:
        sys.exit("\nhero title wraps — lower the vw or rem cap in .hero__title")
    print("\nboth lines fit at every tested width")


if __name__ == "__main__":
    main()
