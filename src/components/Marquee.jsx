const WORDS = [
  'Muhurtham',
  'Mehendi',
  'Nichayathartham',
  'Reception',
  'Wedding Films',
  'Candid Portraiture',
];

/** Seamless ticker: the list is rendered twice and translated by exactly -50%,
 *  so the loop point is invisible. Pure CSS keyframes, pauses on hover. */
export default function Marquee() {
  const run = [...WORDS, ...WORDS];
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__track">
        {run.map((w, i) => (
          <span key={i} className="marquee__item">
            {w}
            <i className="marquee__sep">✽</i>
          </span>
        ))}
      </div>
    </div>
  );
}
