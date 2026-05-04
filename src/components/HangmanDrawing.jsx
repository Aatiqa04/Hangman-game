// Progressive SVG drawing with animated stroke-in, swinging, and dancing.
export default function HangmanDrawing({ wrong, maxWrong, celebrating = false }) {
  const totalParts = 6;
  const visible = celebrating
    ? totalParts
    : Math.min(totalParts, Math.ceil((wrong / maxWrong) * totalParts));
  const dead = !celebrating && wrong >= maxWrong;
  const swinging = visible >= 2 && !dead && !celebrating;
  const part = (i) => (visible >= i ? 'visible' : 'hidden');

  return (
    <div className={`hangman ${dead ? 'hangman--dead' : ''} ${celebrating ? 'hangman--celebrate' : ''}`}>
      <svg viewBox="0 0 240 280" className="hangman__svg" aria-label="Hangman drawing">
        <defs>
          <radialGradient id="sun" cx="50%" cy="50%" r="50%">
            <stop offset="0%"  stopColor="#fef3c7" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#fbbf24" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="ground" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"  stopColor="rgba(124, 92, 255, 0.25)" />
            <stop offset="100%" stopColor="rgba(124, 92, 255, 0)" />
          </linearGradient>
        </defs>

        {/* backdrop */}
        <circle cx="50" cy="55" r="26" fill="url(#sun)" className="hangman__sun" />
        <g className="hangman__clouds" aria-hidden>
          <ellipse cx="180" cy="40" rx="22" ry="6" fill="rgba(255,255,255,0.18)" />
          <ellipse cx="195" cy="48" rx="14" ry="4" fill="rgba(255,255,255,0.12)" />
        </g>
        <rect x="0" y="245" width="240" height="35" fill="url(#ground)" />

        {/* Gallows — drawn in with stroke-dash */}
        <line x1="20"  y1="245" x2="200" y2="245" className="gallows gallows--1" />
        <line x1="60"  y1="245" x2="60"  y2="20"  className="gallows gallows--2" />
        <line x1="60"  y1="20"  x2="170" y2="20"  className="gallows gallows--3" />
        <line x1="170" y1="20"  x2="170" y2="50"  className={`gallows gallows--rope gallows--4 ${celebrating ? 'gallows--broken' : ''}`} />

        {/* Confetti burst on celebration */}
        {celebrating && (
          <g className="hangman__confetti">
            {Array.from({ length: 16 }).map((_, i) => (
              <rect
                key={i}
                className="hangman__confetti-bit"
                x={170 + Math.cos((i / 16) * Math.PI * 2) * 6}
                y={140 + Math.sin((i / 16) * Math.PI * 2) * 6}
                width="4"
                height="6"
                fill={['#7c5cff', '#22d3ee', '#4ade80', '#fbbf24', '#ff7a59', '#f472b6'][i % 6]}
                style={{ '--angle': `${(i / 16) * 360}deg`, '--delay': `${i * 30}ms` }}
              />
            ))}
          </g>
        )}

        {/* The body — swings while alive, slumps when dead, dances when celebrating */}
        <g className={`hangman__body ${swinging ? 'hangman__body--swing' : ''} ${dead ? 'hangman__body--slump' : ''} ${celebrating ? 'hangman__body--dance' : ''}`}
           style={{ transformOrigin: '170px 50px' }}>
          {/* 1. Head */}
          <circle cx="170" cy="75" r="20" className={`body part-${part(1)} part-1`} />
          {/* face: happy when celebrating, neutral when alive, X eyes when dead */}
          {visible >= 1 && !dead && !celebrating && (
            <g className="face face--alive">
              <circle cx="163" cy="72" r="2" />
              <circle cx="177" cy="72" r="2" />
              <path d="M 162 84 Q 170 87 178 84" />
            </g>
          )}
          {celebrating && (
            <g className="face face--happy">
              <path d="M 159 70 Q 163 66 167 70" />
              <path d="M 173 70 Q 177 66 181 70" />
              <path d="M 158 80 Q 170 92 182 80" />
            </g>
          )}
          {dead && (
            <g className="face face--dead">
              <line x1="158" y1="69" x2="167" y2="78" />
              <line x1="167" y1="69" x2="158" y2="78" />
              <line x1="173" y1="69" x2="182" y2="78" />
              <line x1="182" y1="69" x2="173" y2="78" />
              <path d="M 162 87 Q 170 81 178 87" />
            </g>
          )}
          {/* 2. Torso */}
          <line x1="170" y1="95"  x2="170" y2="165" className={`body part-${part(2)} part-2`} />
          {/* 3. Left arm — raised when celebrating */}
          <line
            x1="170" y1="115"
            x2={celebrating ? 138 : 143}
            y2={celebrating ? 95  : 140}
            className={`body part-${part(3)} part-3 ${celebrating ? 'arm--raised' : ''}`}
          />
          {/* 4. Right arm — raised when celebrating */}
          <line
            x1="170" y1="115"
            x2={celebrating ? 202 : 197}
            y2={celebrating ? 95  : 140}
            className={`body part-${part(4)} part-4 ${celebrating ? 'arm--raised' : ''}`}
          />
          {/* 5. Left leg — kicks when celebrating */}
          <line x1="170" y1="165" x2="146" y2="208" className={`body part-${part(5)} part-5 ${celebrating ? 'leg leg--left' : ''}`} />
          {/* 6. Right leg — kicks when celebrating */}
          <line x1="170" y1="165" x2="194" y2="208" className={`body part-${part(6)} part-6 ${celebrating ? 'leg leg--right' : ''}`} />
        </g>
      </svg>

      <div className="hangman__meter">
        <div className="hangman__meter-bar" style={{ width: `${(wrong / maxWrong) * 100}%` }} />
        <span className="hangman__meter-label">
          {wrong} / {maxWrong} wrong
        </span>
      </div>
    </div>
  );
}
