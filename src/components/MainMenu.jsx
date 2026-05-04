import { useState } from 'react';
import { CATEGORIES, DIFFICULTIES, DIFFICULTY_CONFIG } from '../data/words.js';
import MenuHero from './MenuHero.jsx';

const MODES = [
  {
    id: 'campaign',
    title: 'Campaign',
    icon: '🏆',
    desc: 'Climb 10+ levels of escalating difficulty. 3 lives carry over.',
    badge: 'Most Popular',
    needs: [],
  },
  {
    id: 'classic',
    title: 'Classic',
    icon: '🎯',
    desc: 'Pick a category and difficulty. One word, no clock — pure puzzle.',
    needs: ['category', 'difficulty'],
  },
  {
    id: 'timeAttack',
    title: 'Time Attack',
    icon: '⏱',
    desc: 'Race the clock. Time bonus for fast solves.',
    badge: 'Heart-Racing',
    needs: ['difficulty'],
  },
  {
    id: 'categories',
    title: 'Categories',
    icon: '🗂',
    desc: 'Stay in one theme. Difficulty ramps every two levels.',
    needs: ['category'],
  },
];

const TAGLINES = [
  'Can you save the dangling figure?',
  'One letter at a time. Don’t lose your nerve.',
  'Crack the word before time runs out.',
  'Six wrong guesses. Make them count.',
];

export default function MainMenu({ onStart, stats }) {
  const [mode, setMode] = useState('campaign');
  const [category, setCategory] = useState('animals');
  const [difficulty, setDifficulty] = useState('easy');
  const [tagline] = useState(() => TAGLINES[Math.floor(Math.random() * TAGLINES.length)]);

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

  return (
    <div className="menu">
      <section className="menu__top">
        <MenuHero />

        <div className="menu__intro">
          <h1 className="menu__title">
            <span className="menu__title-letter">H</span>
            <span className="menu__title-letter">A</span>
            <span className="menu__title-letter">N</span>
            <span className="menu__title-letter">G</span>
            <span className="menu__title-letter">M</span>
            <span className="menu__title-letter">A</span>
            <span className="menu__title-letter">N</span>
          </h1>
          <p className="menu__subtitle">{tagline}</p>

          {isReturning && (
            <div className="stats-panel">
              <div className="stats-panel__pill stats-panel__pill--star">
                <span className="stats-panel__icon">⭐</span>
                <div>
                  <span className="stats-panel__label">Best Score</span>
                  <strong className="stats-panel__value">{stats.bestScore}</strong>
                </div>
              </div>
              <div className="stats-panel__pill">
                <span className="stats-panel__icon">🏔️</span>
                <div>
                  <span className="stats-panel__label">Highest Level</span>
                  <strong className="stats-panel__value">{stats.highestLevel}</strong>
                </div>
              </div>
              <div className="stats-panel__pill">
                <span className="stats-panel__icon">🔥</span>
                <div>
                  <span className="stats-panel__label">Best Streak</span>
                  <strong className="stats-panel__value">{stats.bestStreak}</strong>
                </div>
              </div>
              <div className="stats-panel__pill">
                <span className="stats-panel__icon">🎯</span>
                <div>
                  <span className="stats-panel__label">Win Rate</span>
                  <strong className="stats-panel__value">{winRate}%</strong>
                </div>
              </div>
            </div>
          )}

          {!isReturning && (
            <div className="menu__cta-banner">
              <span>👋 New player?</span>
              <strong>Start with Campaign — easy first level.</strong>
            </div>
          )}

          <button className="btn btn--primary btn--large btn--cta" onClick={start}>
            <span className="btn__icon">▶</span>
            <span>{isReturning ? 'Play Again' : 'Start Game'}</span>
          </button>
          <p className="menu__hint">
            <kbd>A</kbd>–<kbd>Z</kbd> to guess · <kbd>💡</kbd> for hints
          </p>
        </div>
      </section>

      <section className="menu__section">
        <h2 className="menu__section-title">Choose a mode</h2>
        <div className="modes">
          {MODES.map((m) => (
            <button
              key={m.id}
              className={`mode ${mode === m.id ? 'mode--active' : ''}`}
              onClick={() => setMode(m.id)}
              aria-pressed={mode === m.id}
            >
              {m.badge && <span className="mode__badge">{m.badge}</span>}
              <span className="mode__icon" aria-hidden>{m.icon}</span>
              <span className="mode__title">{m.title}</span>
              <span className="mode__desc">{m.desc}</span>
            </button>
          ))}
        </div>
      </section>

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
