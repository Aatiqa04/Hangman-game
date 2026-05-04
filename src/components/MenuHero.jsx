// Hero animation for the main menu: a swinging hangman with dangling
// letters falling around it, plus floating ghost words in the background.
const DANGLING = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const GHOST_WORDS = ['CIPHER', 'RIDDLE', 'PUZZLE', 'ENIGMA', 'MYSTERY', 'CRYPTIC', 'SECRET'];

export default function MenuHero() {
  return (
    <div className="hero" aria-hidden>
      {/* Floating ghost words drift across the background */}
      <div className="hero__ghosts">
        {GHOST_WORDS.map((w, i) => (
          <span key={w} className="hero__ghost" style={{ '--i': i }}>{w}</span>
        ))}
      </div>

      {/* The dangling letters fall like raindrops */}
      <div className="hero__rain">
        {DANGLING.map((l, i) => (
          <span key={i} className="hero__rain-letter" style={{ '--i': i, '--delay': `${i * 0.5}s` }}>
            {l}
          </span>
        ))}
      </div>

      {/* The animated hangman scene */}
      <svg viewBox="0 0 320 320" className="hero__svg" role="img" aria-label="Hanging stick figure">
        <defs>
          <radialGradient id="moon" cx="50%" cy="50%" r="50%">
            <stop offset="0%"  stopColor="#fef3c7" stopOpacity="0.95" />
            <stop offset="60%" stopColor="#c4b5fd" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#7c5cff" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="gallowsGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%"  stopColor="#c4b5fd" />
            <stop offset="100%" stopColor="#7c5cff" />
          </linearGradient>
        </defs>

        {/* Moon glow */}
        <circle cx="60" cy="60" r="38" fill="url(#moon)" className="hero__moon" />

        {/* Stars */}
        <g className="hero__stars">
          <circle cx="40"  cy="120" r="1.6" fill="#fff" />
          <circle cx="280" cy="60"  r="1.2" fill="#fff" />
          <circle cx="240" cy="140" r="1.6" fill="#fff" />
          <circle cx="100" cy="40"  r="1.0" fill="#fff" />
          <circle cx="200" cy="40"  r="1.4" fill="#fff" />
          <circle cx="20"  cy="200" r="1.2" fill="#fff" />
        </g>

        {/* Gallows */}
        <line x1="30"  y1="295" x2="290" y2="295" stroke="url(#gallowsGrad)" strokeWidth="7" strokeLinecap="round" />
        <line x1="80"  y1="295" x2="80"  y2="30"  stroke="url(#gallowsGrad)" strokeWidth="7" strokeLinecap="round" />
        <line x1="80"  y1="30"  x2="220" y2="30"  stroke="url(#gallowsGrad)" strokeWidth="7" strokeLinecap="round" />
        <line x1="220" y1="30"  x2="220" y2="70"  stroke="#d6c8ff" strokeWidth="4" strokeLinecap="round" />

        {/* Hanging body — swings as a group */}
        <g className="hero__body" style={{ transformOrigin: '220px 30px' }}>
          {/* rope to noose */}
          <line x1="220" y1="70" x2="220" y2="90" stroke="#d6c8ff" strokeWidth="3" />
          <ellipse cx="220" cy="92" rx="6" ry="3" fill="none" stroke="#d6c8ff" strokeWidth="2" />

          {/* head */}
          <circle cx="220" cy="115" r="22" fill="rgba(255,255,255,0.06)" stroke="#fff" strokeWidth="5" />
          {/* face — winks every few seconds */}
          <g className="hero__face">
            <circle cx="212" cy="111" r="2.5" fill="#fff" />
            <circle cx="228" cy="111" r="2.5" fill="#fff" className="hero__eye-wink" />
            <path d="M 211 124 Q 220 130 229 124" stroke="#fff" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          </g>

          {/* torso */}
          <line x1="220" y1="137" x2="220" y2="210" stroke="#fff" strokeWidth="5" strokeLinecap="round" />
          {/* arms — slight wiggle */}
          <g className="hero__arms">
            <line x1="220" y1="158" x2="190" y2="190" stroke="#fff" strokeWidth="5" strokeLinecap="round" />
            <line x1="220" y1="158" x2="250" y2="190" stroke="#fff" strokeWidth="5" strokeLinecap="round" />
          </g>
          {/* legs */}
          <line x1="220" y1="210" x2="195" y2="255" stroke="#fff" strokeWidth="5" strokeLinecap="round" />
          <line x1="220" y1="210" x2="245" y2="255" stroke="#fff" strokeWidth="5" strokeLinecap="round" />
        </g>

        {/* ground glow */}
        <ellipse cx="160" cy="295" rx="120" ry="6" fill="rgba(124, 92, 255, 0.4)" className="hero__ground" />
      </svg>
    </div>
  );
}
