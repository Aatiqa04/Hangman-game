import { useEffect, useState } from 'react';

const LETTER_COLORS = ['#a78bfa', '#818cf8', '#c4b5fd', '#818cf8', '#a78bfa', '#c4b5fd', '#818cf8'];

const STARS = [
  { top: '5%',  left: '4%',  delay: '0s',   dur: '2.1s' },
  { top: '12%', left: '22%', delay: '0.9s', dur: '3s',   color: '#a78bfa', size: '3px' },
  { top: '8%',  left: '48%', delay: '1.2s', dur: '2.8s', color: '#60a5fa' },
  { top: '15%', left: '75%', delay: '0.5s', dur: '1.7s' },
  { top: '10%', left: '92%', delay: '0.8s', dur: '2.5s' },
  { top: '35%', left: '3%',  delay: '0.2s', dur: '2.4s', size: '1.5px' },
  { top: '40%', left: '95%', delay: '0.6s', dur: '2.2s', color: '#818cf8' },
  { top: '55%', left: '8%',  delay: '1s',   dur: '1.9s' },
  { top: '50%', left: '88%', delay: '0.3s', dur: '2.3s' },
  { top: '70%', left: '5%',  delay: '1.5s', dur: '1.8s' },
  { top: '75%', left: '93%', delay: '0.4s', dur: '2.6s', color: '#818cf8', size: '3px' },
  { top: '85%', left: '15%', delay: '0.7s', dur: '2.1s' },
  { top: '90%', left: '50%', delay: '1.3s', dur: '2.4s', color: '#60a5fa' },
  { top: '88%', left: '82%', delay: '0.1s', dur: '1.9s' },
  { top: '30%', left: '18%', delay: '1.6s', dur: '2.7s', size: '2.5px' },
  { top: '65%', left: '78%', delay: '0.9s', dur: '2s' },
];

const CONFETTI = [
  { left: '5%',  color: '#f472b6', size: '7px', round: false, delay: '0s',   dur: '2s',   rot: 30 },
  { left: '12%', color: '#34d399', size: '6px', round: false, delay: '0.4s', dur: '2.3s', rot: 60 },
  { left: '22%', color: '#fbbf24', size: '7px', round: false, delay: '0.8s', dur: '1.9s', rot: 15 },
  { left: '32%', color: '#4ade80', size: '5px', round: true,  delay: '1.2s', dur: '1.8s', rot: 0 },
  { left: '42%', color: '#a78bfa', size: '5px', round: false, delay: '1s',   dur: '2.1s', rot: 0 },
  { left: '52%', color: '#60a5fa', size: '6px', round: false, delay: '0.2s', dur: '2.5s', rot: 45 },
  { left: '62%', color: '#f87171', size: '6px', round: true,  delay: '0.6s', dur: '2.4s', rot: 0 },
  { left: '72%', color: '#c084fc', size: '7px', round: false, delay: '0.3s', dur: '2.6s', rot: 20 },
  { left: '82%', color: '#fb923c', size: '5px', round: true,  delay: '0.7s', dur: '2.2s', rot: 0 },
  { left: '90%', color: '#38bdf8', size: '6px', round: false, delay: '1.4s', dur: '2s',   rot: 55 },
  { left: '8%',  color: '#818cf8', size: '6px', round: false, delay: '0.5s', dur: '2.3s', rot: 40 },
  { left: '95%', color: '#f472b6', size: '5px', round: true,  delay: '0.9s', dur: '2.1s', rot: 0 },
  { left: '18%', color: '#fbbf24', size: '6px', round: false, delay: '1.6s', dur: '2.4s', rot: 25 },
  { left: '85%', color: '#4ade80', size: '7px', round: false, delay: '0.1s', dur: '1.9s', rot: 50 },
];

export default function SplashScreen({ onComplete }) {
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFading(true), 8000);
    const doneTimer = setTimeout(() => onComplete(), 8600);
    return () => { clearTimeout(fadeTimer); clearTimeout(doneTimer); };
  }, [onComplete]);

  return (
    <div className={`splash${fading ? ' splash--fade' : ''}`}>
      {/* Stars — full page */}
      {STARS.map((s, i) => (
        <span
          key={i}
          className="splash__star"
          style={{
            top: s.top,
            left: s.left,
            animationDelay: s.delay,
            animationDuration: s.dur,
            background: s.color || '#a78bfa',
            width: s.size || '2px',
            height: s.size || '2px',
          }}
        />
      ))}

      {/* Confetti — full page */}
      <div className="splash__confetti" aria-hidden="true">
        {CONFETTI.map((c, i) => (
          <span
            key={i}
            className="splash__confetti-piece"
            style={{
              left: c.left,
              background: c.color,
              width: c.size,
              height: c.size,
              borderRadius: c.round ? '50%' : '2px',
              animationDelay: c.delay,
              animationDuration: c.dur,
              transform: `rotate(${c.rot}deg)`,
            }}
          />
        ))}
      </div>

      <div className="splash__canvas">
        {/* Stars inside canvas */}
        {STARS.map((s, i) => (
          <span
            key={`c${i}`}
            className="splash__star"
            style={{
              top: s.top,
              left: s.left,
              animationDelay: s.delay,
              animationDuration: s.dur,
              background: s.color || '#a78bfa',
              width: s.size || '2px',
              height: s.size || '2px',
            }}
          />
        ))}

        {/* Gallows + Figure */}
        <svg
          className="splash__figure"
          width="160"
          height="210"
          viewBox="0 0 160 210"
        >
          <defs>
            <filter id="splashGlow" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <g filter="url(#splashGlow)">
            <line x1="20" y1="195" x2="130" y2="195" stroke="#7c3aed" strokeWidth="5" strokeLinecap="round" />
            <line x1="55" y1="30" x2="55" y2="195" stroke="#7c3aed" strokeWidth="5" strokeLinecap="round" />
            <line x1="55" y1="32" x2="110" y2="32" stroke="#7c3aed" strokeWidth="5" strokeLinecap="round" />
            <line x1="55" y1="72" x2="82" y2="32" stroke="#5b21b6" strokeWidth="3" strokeLinecap="round" />
            <line x1="110" y1="32" x2="110" y2="58" stroke="#c4b5fd" strokeWidth="3" strokeLinecap="round">
              <animate attributeName="y2" values="58;62;58" dur="1.8s" repeatCount="indefinite" />
            </line>
          </g>

          <circle cx="110" cy="72" r="14" fill="none" stroke="#c4b5fd" strokeWidth="2.5">
            <animate attributeName="cy" values="72;68;72" dur="0.9s" repeatCount="indefinite" />
          </circle>
          <path d="M104 77 Q110 84 116 77" fill="none" stroke="#c4b5fd" strokeWidth="2" strokeLinecap="round" />
          <circle cx="106" cy="69" r="2" fill="#c4b5fd" />
          <circle cx="114" cy="69" r="2" fill="#c4b5fd" />

          <line x1="110" y1="86" x2="110" y2="132" stroke="#c4b5fd" strokeWidth="2.5" strokeLinecap="round">
            <animate attributeName="y1" values="86;82;86" dur="0.9s" repeatCount="indefinite" />
          </line>

          <line x1="110" y1="100" x2="86" y2="116" stroke="#c4b5fd" strokeWidth="2.5" strokeLinecap="round">
            <animate attributeName="x2" values="86;80;86" dur="0.7s" repeatCount="indefinite" />
            <animate attributeName="y2" values="116;108;116" dur="0.7s" repeatCount="indefinite" />
          </line>
          <line x1="110" y1="100" x2="134" y2="116" stroke="#c4b5fd" strokeWidth="2.5" strokeLinecap="round">
            <animate attributeName="x2" values="134;140;134" dur="0.7s" begin="0.35s" repeatCount="indefinite" />
            <animate attributeName="y2" values="116;108;116" dur="0.7s" begin="0.35s" repeatCount="indefinite" />
          </line>

          <line x1="110" y1="132" x2="90" y2="165" stroke="#c4b5fd" strokeWidth="2.5" strokeLinecap="round">
            <animate attributeName="x2" values="90;84;90" dur="0.9s" repeatCount="indefinite" />
            <animate attributeName="y2" values="165;160;165" dur="0.9s" repeatCount="indefinite" />
          </line>
          <line x1="110" y1="132" x2="130" y2="165" stroke="#c4b5fd" strokeWidth="2.5" strokeLinecap="round">
            <animate attributeName="x2" values="130;136;130" dur="0.9s" begin="0.45s" repeatCount="indefinite" />
            <animate attributeName="y2" values="165;160;165" dur="0.9s" begin="0.45s" repeatCount="indefinite" />
          </line>
        </svg>

        {/* HANGMAN letters */}
        <div className="splash__letter-row" aria-label="Hangman">
          {'HANGMAN'.split('').map((letter, i) => (
            <span
              key={i}
              className="splash__logo-letter"
              style={{
                animationDelay: `${i * 0.1}s`,
                color: LETTER_COLORS[i],
              }}
            >
              {letter}
            </span>
          ))}
        </div>

        {/* Underline dashes */}
        <div className="splash__dash-row" aria-hidden="true">
          {'HANGMAN'.split('').map((_, i) => (
            <span key={i} className="splash__dash" />
          ))}
        </div>

        {/* Tagline */}
        <p className="splash__tagline">
          GUESS &nbsp;&middot;&nbsp; OR &nbsp;&middot;&nbsp; PERISH
        </p>

        {/* Loader */}
        <div className="splash__loader">
          <div className="splash__loader-bar" />
        </div>
      </div>
    </div>
  );
}
