import { useState } from 'react';
import { DIFFICULTY_CONFIG } from '../data/words.js';
import { setMuted, isMuted } from '../hooks/useSound.js';

const MODE_LABEL = {
  classic:    'Classic',
  campaign:   'Campaign',
  timeAttack: 'Time Attack',
  categories: 'Categories',
};

export default function HUD({ state, onHint, onMenu }) {
  const cfg = DIFFICULTY_CONFIG[state.wordDifficulty];
  const [mute, setMute] = useState(isMuted());
  const toggleMute = () => {
    const next = !mute;
    setMute(next);
    setMuted(next);
  };

  return (
    <header className="hud">
      <button className="btn btn--ghost" onClick={onMenu} aria-label="Back to menu">
        ← Menu
      </button>

      <div className="hud__chips">
        <div className="hud__chip">
          <span className="hud__chip-label">Mode</span>
          <span className="hud__chip-value">{MODE_LABEL[state.mode]}</span>
        </div>
        <div className="hud__chip">
          <span className="hud__chip-label">Level</span>
          <span className="hud__chip-value">{state.level}</span>
        </div>
        <div className={`hud__chip hud__chip--${state.wordDifficulty}`}>
          <span className="hud__chip-label">Difficulty</span>
          <span className="hud__chip-value">{cfg.label}</span>
        </div>
        {state.wordCategory && (
          <div className="hud__chip">
            <span className="hud__chip-label">Category</span>
            <span className="hud__chip-value">{state.wordCategory}</span>
          </div>
        )}
      </div>

      <div className="hud__right">
        {state.timeLeft != null && (
          <div className={`hud__timer ${state.timeLeft <= 10 ? 'hud__timer--low' : ''}`}>
            <span className="hud__timer-label">⏱</span>
            <span className="hud__timer-value">{state.timeLeft}s</span>
          </div>
        )}
        {state.streak > 0 && (
          <div className="hud__streak">🔥 {state.streak}</div>
        )}
        {state.mode === 'campaign' && (
          <div className="hud__lives" aria-label={`${state.lives} lives left`}>
            {Array.from({ length: 3 }).map((_, i) => (
              <span key={i} className={`heart ${i < state.lives ? 'heart--full' : 'heart--empty'}`}>
                ♥
              </span>
            ))}
          </div>
        )}
        <button
          className="btn btn--hint"
          onClick={onHint}
          disabled={state.hintsLeft <= 0 || state.hintRevealed}
          title="Reveal the hint (-25 score)"
        >
          💡 Hint {state.hintsLeft > 0 && `×${state.hintsLeft}`}
        </button>
        <button
          className="btn btn--ghost btn--icon"
          onClick={toggleMute}
          aria-label={mute ? 'Unmute sound' : 'Mute sound'}
          title={mute ? 'Unmute' : 'Mute'}
        >
          {mute ? '🔇' : '🔊'}
        </button>
      </div>
    </header>
  );
}
