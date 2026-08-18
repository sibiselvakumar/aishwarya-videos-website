// Content + assets for the Aishwarya Videos site.
// Every x/y/w/h below is a measured pixel value from the reference layout at a
// 1440px-wide viewport. styles.css turns 1 design px into `var(--u)` so the
// whole layout scales proportionally and stays pixel-faithful at any width.
const CDN = 'https://aishwaryavideos.com/wp-content/uploads'
// a leading slash means the asset is served from public/ instead of the CDN
const img = (path) => (path.startsWith('/') ? path : `${CDN}/${path}`)
const yt = (id) => `https://img.youtube.com/vi/${id}/maxresdefault.jpg`

export const REF_W = 1440

export const brand = {
  logo: img('2024/04/AishwaryaVideos_Logo.webp'),
  stackedLogo: img('2024/04/AishwaryaVideos_Logo.webp'),
  name: 'Aishwarya Videos',
}

export const nav = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Photography', href: '/photography' },
  { label: 'Films', href: '/films' },
  { label: 'Contact Us', href: '/contact' },
]

export const navMore = []

export const social = [
  { label: 'Instagram', href: 'https://www.instagram.com/aishwarya_videos/' },
  { label: 'Facebook', href: 'https://www.facebook.com/aishwaryavideos/' },
  { label: 'Youtube', href: 'https://www.youtube.com/channel/UCXmJWgjJC0nC4mGx8S5HwVw' },
  { label: 'Linkedin', href: 'https://in.linkedin.com/in/aishwaryavideos' },
]

export const cta = { label: 'Get in Touch', href: '/contact' }

// ---------------------------------------------------------------- hero
export const hero = { h: 900, src: img('2024/08/41.jpg') }

// ---------------------------------------------------------------- about
export const about = {
  h: 946,
  items: [
    { type: 'img', x: 948, y: 87, w: 434, h: 543, src: img('2024/08/21.jpg') },
    { type: 'img', x: 280, y: 215, w: 640, h: 112, src: img('2024/04/VKR63706aasdd.png'), plain: true },
    { type: 'img', x: 58, y: 338, w: 379, h: 474, src: img('2024/08/31.jpg') },
  ],
  copy: [
    { x: 447, y: 355, w: 490, text: 'Stories of Love, Laughter and happily ever after” Planning your wedding is the most exciting and important day in your life and we are here to capture those epic moments beautifully. Start your happily ever after stories with a wedding photographer who treasures candid memories and captures every timeless moment that makes your wedding day special.' },
    { x: 447, y: 545, w: 490, text: 'With over 25+ years of experience and also a winner of the “International Wedding Photography Award” (Wed Award), we with our team together will capture every detail that will be impressive and professional as the moments you create.' },
  ],
}

// ------------------------------------------------------------- portfolio
// 5 x 3 mosaic, full-bleed. Cell 285x286, column pitch 287.5, row pitch 288.5.
export const portfolio = {
  h: 864, cols: 5, cell: { w: 285, h: 286 }, gap: 2.5,
  tiles: [
    ['2024/04/7-9.jpg', 'Wedding portrait'],
    ['2024/04/7-10.jpg', 'Bridal ceremony'],
    ['2024/04/7-11.jpg', 'Couple portrait'],
    ['2024/04/7-18.jpg', 'Wedding candid'],
    ['2024/04/7-19.jpg', 'Bridal portrait'],
    ['2024/04/7-20.jpg', 'Wedding ceremony'],
    ['2024/04/7-21.jpg', 'Outdoor shoot'],
    // centre cell of the 5x3 grid — the "iconic wedding images" card
    ['/center-feature.webp', 'Some of the most iconic wedding images'],
    ['2024/04/7-24.jpg', 'Bride entrance'],
    ['2024/04/6-25.jpg', 'Wedding detail'],
    ['2024/04/6-33.jpg', 'Couple portrait'],
    ['2024/04/6-35.jpg', 'Ceremony candid'],
    ['2024/04/6-43.jpg', 'Engagement portrait'],
    ['2024/04/YSAK1057.jpg', 'Wedding portrait'],
    ['2024/04/YSAK1123a.jpg', 'Bridal portrait'],
  ].map(([p, alt]) => ({ src: img(p), alt })),
}

// -------------------------------------------------------------- featured
// Both thumbnails are a uniform 327x436 box with overflow:hidden. The
// oversized <img> inside is a cover-crop. Two cards, centred as a pair.
export const featured = {
  h: 928, imgY: 127, imgW: 327, imgH: 436, titleY: 578, dateY: 602, textW: 327,
  cards: [
    { x: 390, title: 'Prabhavathi', date: 'April 20, 2024', href: '/photography#prabhavathi', src: img('2024/04/025A9675.jpg') },
    { x: 723, title: 'Hari and Harsha', date: 'April 20, 2024', href: '/photography#hari-and-harsha', src: img('2024/04/YSAK1032.jpg') },
  ],
  button: { x: 659, y: 652, w: 122, h: 44, label: 'Photography Blog', href: '/photography' },
}

// ---------------------------------------------------------------- cinema
// Full-bleed dark band, masked top and bottom by cream chevrons.
export const cinema = {
  h: 753, overlap: 755,
  poster: img('2024/04/025A9832.jpg'),
  video: 'https://ik.imagekit.io/clickworthy/reels-.mp4?updatedAt=1713677258381',
  title: { x: 447, y: 360, w: 546, text: 'Soul + Cinema' },
  copy: { x: 447, y: 489, w: 546, text: 'Every wedding is unique and so are our films. For past 22 years Aishwarya Videos has set new benchmarks of storytelling within wedding realm and beyond. We are fortunate to have experienced so unique cultures and traditions across Tamilnadu and to document stories that continuously overwhelm us.' },
}

// ----------------------------------------------------------------- films
// Two columns, three rows. Poster is 493x277 — a 16:9 YouTube frame — with the
// title on the line below it, so each row is one poster plus its caption.
const FILM_ROW = 360
const filmReel = [
  ['PSGa51TUzqE', 'Hari & Harsha'],
  ['6UsVnim4Gms', 'Subuthara'],
  ['Rlkeu3Xil7Q', 'Jagadees & Preetha, Tiruppur'],
  ['tNcHq60SUAc', 'Shobiya & Piruthuviraja, Kongu Wedding'],
  ['iHPB4DA7KDs', 'Dharan & Sneha, Salem'],
  ['aa_vmh_gRRQ', 'Randeep & Priya, Salem'],
]

export const films = {
  h: 1400,
  heading: { x: 336, y: 40, w: 824, text: 'INSPIRED BY CINEMA' },
  note: { x: 336, y: 120, w: 824, text: 'Winner of the “International Wedding Photography Award” (Wed Award)' },
  posterH: 277,
  items: filmReel.map(([id, title], i) => {
    const y = 200 + Math.floor(i / 2) * FILM_ROW
    return {
      x: 223 + (i % 2) * 501, w: 493, y,
      tx: 225 + (i % 2) * 501, tw: 490, ty: y + 297,
      id, title, poster: yt(id), href: `https://www.youtube.com/watch?v=${id}`,
    }
  }),
  button: { x: 611, y: 1290, w: 218, h: 44, label: 'Watch All Our Films', href: '/films' },
}

// --------------------------------------------------------------- gallery
export const gallery = {
  h: 1520,
  copy: [
    { x: 280, y: 39, w: 880, text: 'Here is a curated collection of weddings, for more visit our blogs.' },
    { x: 280, y: 100, w: 880, text: 'Our works span cultures and traditions — Wedding, Engagement, Outdoor Shoots and Portraits.' },
  ],
  cards: [
    { x: 56, y: 197, w: 661, h: 370, src: img('2024/04/YSAK9789.jpg') },
    { x: 724, y: 197, w: 661, h: 370, src: img('2024/04/YSAK9575.jpg') },
    { x: 56, y: 631, w: 661, h: 370, src: img('2024/04/YSAK1305.jpg') },
    { x: 724, y: 631, w: 661, h: 370, src: img('2024/04/YSAK1263.jpg') },
    { x: 56, y: 1065, w: 661, h: 370, src: img('2024/04/025A9628.jpg') },
    { x: 724, y: 1065, w: 661, h: 370, src: img('2024/04/025A9646.jpg') },
  ],
}

// ----------------------------------------------------------------- promo
export const promo = {
  h: 631,
  background: img('2024/08/51.jpg'),
  title: { x: 58, y: 70, w: 434, text: 'Our Clients' },
  copy: { x: 58, y: 176, w: 520, text: '22 years of solid experience. Successfully completed over 1000 Events. Cultures and traditions Wedding, Engagement, Outdoor Shoots and Portraits — with over 25+ years of experience and also a winner of the “International Wedding Photography Award” (Wed Award), we with our team together will capture every detail that will be impressive and professional as the moments you create.' },
  button: { x: 58, y: 410, w: 156, h: 68, label: 'About Us', href: '/about' },
}

// ------------------------------------------------------------ about page
export const aboutPage = {
  hero: img('2024/08/61.jpg'),
  title: 'About Us',
  intro: [
    'Stories of Love, Laughter and happily ever after” Planning your wedding is the most exciting and important day in your life and we are here to capture those epic moments beautifully. Start your happily ever after stories with a wedding photographer who treasures candid memories and captures every timeless moment that makes your wedding day special.',
    'With over 25+ years of experience and also a winner of the “International Wedding Photography Award” (Wed Award), we with our team together will capture every detail that will be impressive and professional as the moments you create.',
  ],
  facts: [
    { title: 'Our Awards', lines: ['“International Wedding Photography Award” (Wed Award)'] },
    { title: 'Our Works', lines: ['Cultures and traditions Wedding, Engagement, Outdoor Shoots and Portraits'] },
    { title: 'Our Clients', lines: ['22 years of solid experience.', 'Successfully completed over 1000 Events.'] },
  ],
  gallery: [
    img('2024/04/025A9675.jpg'),
    img('2024/04/YSAK1032.jpg'),
    img('2024/04/7-19.jpg'),
  ],
  cta: { label: 'Get in Touch', href: '/contact' },
}

// ------------------------------------------------------ photography page
const shoot = (files) => files.map((f) => img(`2024/04/${f}.jpg`))

export const photographyPage = {
  hero: img('2024/04/025A9675.jpg'),
  title: 'Photography',
  intro: 'Here is a curated collection of weddings. Every frame is shot the way the day actually felt — candid, unhurried, and true to the people in it.',
  collections: [
    {
      title: 'Prabhavathi',
      date: 'April 20, 2024',
      tag: 'Portraits',
      photos: shoot([
        '025A8007', '025A8069', '025A8079', '025A8150', '025A8198', '025A8203',
        '025A8352', '025A8363', '025A8383', '025A8413', '025A8534', '025A8973',
        '025A9004', '025A9164', '025A9179', '025A9233', '025A9306', '025A9385',
        '025A9396', '025A9529', '025A9542', '025A9588', '025A9625', '025A9628',
        '025A9646', '025A9675', '025A9688', '025A9747', '025A9765', '025A9775',
        '025A9832', '025A9848', '025A9859', '025A9883', '025A9925', '025A9995',
        'VBBM0023', 'VBBM0067', 'VBBM0084', 'VBBM0104', 'VBBM0124', 'VBBM0225',
        'VBBM0244', 'VBBM0321', 'VBBM0392',
      ]),
    },
    {
      title: 'Hari and Harsha',
      date: 'April 20, 2024',
      tag: 'Wedding',
      photos: shoot([
        '6-21', '6-22', '6-25', '6-33', '6-35', '6-43',
        '7-9', '7-10', '7-11', '7-14', '7-16', '7-18',
        '7-19', '7-20', '7-21', '7-22', '7-23', '7-24',
        'YSAK0944-2', 'YSAK0968', 'YSAK1032', 'YSAK1057', 'YSAK1123a',
        'YSAK1198', 'YSAK1263', 'YSAK1305', 'YSAK9575', 'YSAK9789',
      ]),
    },
  ],
}

// ------------------------------------------------------------- films page
export const filmsPage = {
  hero: img('2024/08/61.jpg'),
  title: 'Inspired by Cinema',
  intro: 'Every wedding is unique and so are our films. For past 22 years Aishwarya Videos has set new benchmarks of storytelling within wedding realm and beyond.',
  films: [
    ...filmReel,
    ['4qgYTC0m3fk', 'Hari & Harsha, Tiruppur'],
    ['cQUTz5xzgBQ', 'Vimaresh & Sounderiya'],
    ['G3T_c6HFL10', 'Mitesh & Neethu, Erode'],
    ['jSaCX6sIMKw', 'Randeep & Priya, Salem'],
    ['HCVMr6ygjuY', 'A Kongu Flavour'],
    ['v8iZyNfMgnU', 'Story of Love, Coimbatore'],
    ['LY198vj-aoo', 'A Day in Pondicherry'],
  ].map(([id, title]) => ({
    id, title, poster: yt(id), href: `https://www.youtube.com/watch?v=${id}`,
  })),
  channel: { label: 'Visit Our YouTube Channel', href: 'https://www.youtube.com/@aishwaryavideos' },
}

// ----------------------------------------------------------- contact page
export const contactPage = {
  hero: img('2024/08/51.jpg'),
  title: 'Contact Us',
  intro: [
    'Please fill in the form below and provide as much details as possible to help us create an accurate quote.',
    'We will try to get back within 48hrs, give us a call on the number below if you don’t hear from us or if its a last minute enquiry.',
  ],
  details: [
    { title: 'Address', lines: ['4/A1, N.G.N Street, New Siddhapudur,', 'Coimbatore - 641 044.'] },
    { title: 'Phone', lines: [{ text: '+91 98422 23291', href: 'tel:+919842223291' }] },
    { title: 'Email', lines: [{ text: 'info@aishwaryavideos.com', href: 'mailto:info@aishwaryavideos.com' }] },
  ],
  mailto: 'info@aishwaryavideos.com',
  fields: [
    { name: 'Name', type: 'text' },
    { name: 'Email', type: 'email' },
    { name: 'Estimated Guest Count', type: 'text', required: true },
    { name: 'Location of the wedding', type: 'text', required: true },
    { name: 'Event Dates', type: 'text', required: true },
    { name: 'Tell us more about your wedding - event flow, venues.', type: 'textarea', required: true },
  ],
  services: ['Engagement', 'Wedding', 'Outdoor Shoots', 'Portraits'],
  submit: 'Submit form',
}

// ---------------------------------------------------------------- footer
export const footer = {
  h: 297,
  logo: { x: 58, y: 75, w: 190, h: 100 },
  cols: [
    { x: 726, y: 75, w: 323, lines: ['4/A1, N.G.N Street, New Siddhapudur,', 'Coimbatore - 641 044.'] },
    { x: 726, y: 155, w: 323, lines: ['© 2024 All rights Reserved.'] },
    { x: 1059, y: 75, w: 323, lines: [{ text: '+91 98422 23291', href: 'tel:+919842223291' }, { text: 'info@aishwaryavideos.com', href: 'mailto:info@aishwaryavideos.com' }] },
  ],
  socialY: 225, socialX: 58,
}
