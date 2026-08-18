// Real studio details, taken verbatim from aishwaryavideos.com
// (/about/ and /contact-us/, fetched 2026-08-14). Single source of truth —
// the About page, the About section, Contact and the Footer all read from here,
// so these facts can never drift apart between sections.

export const STUDIO = {
  name: 'Aishwarya Videos',
  tagline: 'Stories of Love, Laughter and happily ever after',
  phone: '+91 98422 23291',
  phoneHref: 'tel:+919842223291',
  email: 'info@aishwaryavideos.com',
  address: ['4/A1, N.G.N Street, New Siddhapudur', 'Coimbatore — 641 044', 'Tamil Nadu, India'],
  replyWindow: 'We try to reply within 48 hours.',
  site: 'https://aishwaryavideos.com/',
};

export const ABOUT = {
  lead:
    'Planning your wedding is the most exciting and important day in your life, and we are here to capture those epic moments beautifully. Start your happily ever after with a wedding photographer who treasures candid memories and captures every timeless moment that makes your wedding day special.',
  experience:
    'With over 25+ years of experience and as a winner of the International Wedding Photography Award (Wed Award), we and our team together will capture every detail — as impressive and professional as the moments you create.',
  award: 'International Wedding Photography Award (Wed Award)',
};

export const STATS = [
  { n: '25+', l: 'Years of experience' },
  { n: '1000+', l: 'Events completed' },
  { n: '01', l: 'International award' },
];

// "Our Works" on aishwaryavideos.com/about/. `ta` is the local name for the
// ceremony where there is one — rendered as a second line under the title.
export const SERVICES = [
  {
    t: 'Wedding',
    ta: 'Muhurtham',
    d: 'Full-day coverage across cultures and traditions — from the kaappu kattu at first light to the last of the reception.',
  },
  {
    t: 'Engagement',
    ta: 'Nichayathartham',
    d: 'The first celebration of the story — shot with the same care as the wedding itself.',
  },
  {
    t: 'Mehendi & Haldi',
    ta: 'Manjal Neeratu Vizha',
    d: 'The henna and turmeric mornings, where most of the laughter of a wedding actually happens.',
  },
  {
    t: 'Outdoor Shoots',
    d: 'Location sessions around Coimbatore, Ooty and Kodaikanal, built around the couple and the light.',
  },
  {
    t: 'Portraits',
    d: 'Studio and location portraiture for families, couples and individual sittings.',
  },
];
