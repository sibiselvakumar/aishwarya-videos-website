// Real films from the Aishwarya Videos YouTube channel.
// Channel: https://www.youtube.com/channel/UCXmJWgjJC0nC4mGx8S5HwVw
// Every id below was verified live via the YouTube oEmbed endpoint, and each
// has a real maxresdefault thumbnail (not YouTube's grey placeholder).
// To add a film: drop in the id from its watch?v= URL and check
// https://i.ytimg.com/vi/<id>/maxresdefault.jpg actually returns an image.

export const CHANNEL_URL = 'https://www.youtube.com/channel/UCXmJWgjJC0nC4mGx8S5HwVw';

export const FILMS = [
  {
    id: 'tNcHq60SUAc',
    title: 'Shobiya & Piruthuviraja',
    kind: 'Cinematic Teaser',
    place: 'Kongu',
    year: 2024,
    featured: true,
  },
  { id: 'aa_vmh_gRRQ', title: 'Randeep & Priya',        kind: 'Wedding Highlights', place: 'Salem',      year: 2024 },
  { id: '4qgYTC0m3fk', title: 'Hari & Harsha',          kind: 'Grand Wedding',      place: 'Tirupur',    year: 2024 },
  { id: 'iHPB4DA7KDs', title: 'Dharan & Sneha',         kind: 'Grand Sangeet',      place: 'Salem',      year: 2024 },
  { id: 'pysWJCy7X1M', title: 'Agasya & Vikram',        kind: 'Grand Wedding',      place: 'Coimbatore', year: 2023 },
  { id: 'G3T_c6HFL10', title: 'Mitesh & Neethu',        kind: 'Kongu Wedding',      place: 'Erode',      year: 2022 },
  { id: 'v8iZyNfMgnU', title: 'Story of Love',          kind: 'Engagement',         place: 'Coimbatore', year: 2024 },
  { id: 'cQUTz5xzgBQ', title: 'Vimaresh & Sounderiya',  kind: 'Wedding Film',       place: 'Tamil Nadu', year: 2022 },
];

export const thumb = (id) => `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`;

/** youtube-nocookie keeps tracking off until the viewer actually presses play. */
export const embed = (id) =>
  `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`;

export const watch = (id) => `https://www.youtube.com/watch?v=${id}`;
