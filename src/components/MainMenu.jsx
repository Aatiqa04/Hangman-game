import { useState, useEffect } from 'react';
import { CATEGORIES, DIFFICULTIES, DIFFICULTY_CONFIG } from '../data/words.js';

const MODES = [
  {
    id: 'campaign',
    title: 'Campaign',
    icon: '🏆',
    desc: 'Climb 10+ levels of escalating difficulty. 3 lives carry over.',
    badge: 'Most Popular',
    badgeColor: '#7c3aed',
    featured: true,
    needs: [],
  },
  {
    id: 'classic',
    title: 'Classic',
    icon: '🧩',
    desc: 'Pick a category and difficulty. One word, no clock — pure puzzle.',
    needs: ['category', 'difficulty'],
  },
  {
    id: 'timeAttack',
    title: 'Time Attack',
    icon: '⏱️',
    desc: 'Race the clock. Time bonus for fast solves.',
    badge: 'Heart-Racing',
    badgeColor: '#be185d',
    needs: ['difficulty'],
  },
  {
    id: 'categories',
    title: 'Categories',
    icon: '🗂️',
    desc: 'Stay in one theme. Difficulty ramps every two levels.',
    needs: ['category'],
  },
];

const GHOST_WORDS = [
  { word: 'CIPHER',  top: '10%', left: '6%',  rotate: -6 },
  { word: 'RIDDLE',  top: '10%', left: '84%', rotate: 4 },
  { word: 'MYSTERY', top: '42%', left: '12%', rotate: -3 },
  { word: 'CRYPTIC', top: '55%', left: '52%', rotate: 5 },
  { word: 'ENIGMA',  top: '70%', left: '4%',  rotate: -5 },
  { word: 'PUZZLE',  top: '18%', left: '42%', rotate: 3 },
  { word: 'SECRET',  top: '82%', left: '84%', rotate: -4 },
  { word: 'DECODE',  top: '38%', left: '72%', rotate: 6 },
];

const TITLE_COLORS = ['#a78bfa', '#818cf8', '#c4b5fd', '#818cf8', '#a78bfa', '#c4b5fd', '#818cf8'];

const TAGLINES = [
  'Can you save the dangling figure?',
  'One letter at a time. Don\u2019t lose your nerve.',
  'Crack the word before time runs out.',
  'Six wrong guesses. Make them count.',
];

function StickFigure() {
  return (
    <svg width="220" height="300" viewBox="0 0 140 190" style={{ zIndex: 1 }}>
      <line x1="20" y1="180" x2="120" y2="180" stroke="#7c3aed" strokeWidth="4" strokeLinecap="round" />
      <line x1="50" y1="30" x2="50" y2="180" stroke="#7c3aed" strokeWidth="4" strokeLinecap="round" />
      <line x1="50" y1="32" x2="100" y2="32" stroke="#7c3aed" strokeWidth="4" strokeLinecap="round" />
      <line x1="50" y1="65" x2="73" y2="32" stroke="#5b21b6" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="100" y1="32" x2="100" y2="55" stroke="#a78bfa" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="100" cy="68" r="13" fill="none" stroke="#c4b5fd" strokeWidth="2.5" />
      <path d="M94 73 Q100 79 106 73" fill="none" stroke="#c4b5fd" strokeWidth="2" strokeLinecap="round" />
      <circle cx="96" cy="65" r="1.8" fill="#c4b5fd" />
      <circle cx="104" cy="65" r="1.8" fill="#c4b5fd" />
      <line x1="100" y1="81" x2="100" y2="125" stroke="#c4b5fd" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="100" y1="95" x2="78" y2="110" stroke="#c4b5fd" strokeWidth="2.5" strokeLinecap="round">
        <animate attributeName="x2" values="78;72;78" dur="1s" repeatCount="indefinite" />
        <animate attributeName="y2" values="110;104;110" dur="1s" repeatCount="indefinite" />
      </line>
      <line x1="100" y1="95" x2="122" y2="110" stroke="#c4b5fd" strokeWidth="2.5" strokeLinecap="round">
        <animate attributeName="x2" values="122;128;122" dur="1s" begin="0.5s" repeatCount="indefinite" />
        <animate attributeName="y2" values="110;104;110" dur="1s" begin="0.5s" repeatCount="indefinite" />
      </line>
      <line x1="100" y1="125" x2="82" y2="155" stroke="#c4b5fd" strokeWidth="2.5" strokeLinecap="round">
        <animate attributeName="x2" values="82;76;82" dur="1s" repeatCount="indefinite" />
      </line>
      <line x1="100" y1="125" x2="118" y2="155" stroke="#c4b5fd" strokeWidth="2.5" strokeLinecap="round">
        <animate attributeName="x2" values="118;124;118" dur="1s" begin="0.5s" repeatCount="indefinite" />
      </line>
    </svg>
  );
}

const STARS = [
  { top: '15%', left: '20%', delay: '0s' },
  { top: '30%', left: '72%', delay: '0.5s' },
  { top: '60%', left: '14%', delay: '1s' },
  { top: '76%', left: '80%', delay: '0.3s' },
  { top: '10%', left: '56%', delay: '0.8s' },
  { top: '50%', left: '46%', delay: '1.3s', color: '#60a5fa' },
];

export default function MainMenu({ onStart, stats }) {
  const [mode, setMode] = useState('campaign');
  const [category, setCategory] = useState('animals');
  const [difficulty, setDifficulty] = useState('easy');
  const [tagline] = useState(() => TAGLINES[Math.floor(Math.random() * TAGLINES.length)]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const current = MODES.find((m) => m.id === mode);
  const needsCategory = current.needs.includes('category');
  const needsDifficulty = current.needs.includes('difficulty');

  const start = () => {
    onStart(mode, {
      category: needsCategory ? category : null,
      difficulty: needsDifficulty ? difficulty : 'easy',
    });
  };

  const winRate = stats.totalGames > 0 ? Math.round((stats.totalWins / stats.totalGames) * 100) : 0;
  const isReturning = stats.totalGames > 0;

  const statItems = [
    { label: 'Best Score', value: stats.bestScore, icon: '⭐' },
    { label: 'Highest Level', value: stats.highestLevel, icon: '🏔️' },
    { label: 'Best Streak', value: stats.bestStreak, icon: '🔥' },
    { label: 'Win Rate', value: `${winRate}%`, icon: '🎯' },
  ];

  return (
    <div className="menu">
      {/* Top Section: Hero + Info */}
      <section className="menu__top">
        <div className="menu__hero-panel">
          {STARS.map((s, i) => (
            <span
              key={i}
              className="menu__star"
              style={{
                top: s.top,
                left: s.left,
                animationDelay: s.delay,
                background: s.color || '#a78bfa',
              }}
            />
          ))}
          {GHOST_WORDS.map((g, i) => (
            <span
              key={g.word}
              className="menu__ghost-word"
              style={{
                top: g.top,
                left: g.left,
                '--rotate': `${g.rotate}deg`,
                '--i': i,
              }}
            >
              {g.word}
            </span>
          ))}
          <div className="menu__figure-bob">
            <StickFigure />
          </div>
        </div>

        <div className="menu__info-side">
          <div>
            <div className="menu__title-row">
              {'HANGMAN'.split('').map((letter, i) => (
                <span
                  key={i}
                  className="menu__title-letter"
                  style={{ color: TITLE_COLORS[i] }}
                >
                  {letter}
                </span>
              ))}
            </div>
            <div className="menu__title-dashes">
              {'HANGMAN'.split('').map((_, i) => (
                <span key={i} className="menu__title-dash" />
              ))}
            </div>
            <p className="menu__tagline">{tagline}</p>
          </div>

          {isReturning && (
            <div className="menu__stats-grid">
              {statItems.map((s) => (
                <div key={s.label} className="menu__stat-card">
                  <div className="menu__stat-label">
                    <span className="menu__stat-icon">{s.icon}</span>
                    {s.label}
                  </div>
                  <div className="menu__stat-val">{s.value}</div>
                </div>
              ))}
            </div>
          )}

          {!isReturning && (
            <div className="menu__cta-banner">
              <span>👋 New player?</span>
              <strong>Start with Campaign — easy first level.</strong>
            </div>
          )}

          <button className="menu__play-btn" onClick={start}>
            ▶ {isReturning ? 'Play Again' : 'Start Game'}
          </button>

          <div className="menu__hint-row">
            <span className="menu__kbd">A – Z</span>
            <span className="menu__hint-text">to guess</span>
            <span style={{ color: '#3d2f60' }}>·</span>
            <span className="menu__kbd">💡</span>
            <span className="menu__hint-text">for hints</span>
          </div>
        </div>
      </section>

      {/* Mode selector */}
      <section className="menu__section">
        <h2 className="menu__section-title">Choose a mode</h2>
        <div className="menu__modes-grid">
          {MODES.map((m) => (
            <button
              key={m.id}
              className={`menu__mode-card${m.featured ? ' menu__mode-card--featured' : ''}${mode === m.id ? ' menu__mode-card--active' : ''}`}
              onClick={() => setMode(m.id)}
              aria-pressed={mode === m.id}
            >
              {m.badge && (
                <span className="menu__mode-badge" style={{ background: m.badgeColor }}>
                  {m.badge}
                </span>
              )}
              <span className="menu__mode-icon">{m.icon}</span>
              <span className="menu__mode-name">{m.title}</span>
              <span className="menu__mode-desc">{m.desc}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Category picker */}
      {needsCategory && (
        <section className="menu__section">
          <h2 className="menu__section-title">Category</h2>
          <div className="chips">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                className={`chip ${category === c ? 'chip--active' : ''}`}
                onClick={() => setCategory(c)}
                aria-pressed={category === c}
              >
                {c}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Difficulty picker */}
      {needsDifficulty && (
        <section className="menu__section">
          <h2 className="menu__section-title">Difficulty</h2>
          <div className="chips">
            {DIFFICULTIES.map((d) => {
              const cfg = DIFFICULTY_CONFIG[d];
              return (
                <button
                  key={d}
                  className={`chip chip--${d} ${difficulty === d ? 'chip--active' : ''}`}
                  onClick={() => setDifficulty(d)}
                  aria-pressed={difficulty === d}
                >
                  <span>{cfg.label}</span>
                  <small>{cfg.maxWrong} chances</small>
                </button>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
