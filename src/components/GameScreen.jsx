import { useEffect, useState } from 'react';
import HangmanDrawing from './HangmanDrawing.jsx';
import WordDisplay from './WordDisplay.jsx';
import Keyboard from './Keyboard.jsx';
import HUD from './HUD.jsx';
import GameOverModal from './GameOverModal.jsx';
import Confetti from './Confetti.jsx';

export default function GameScreen({ game }) {
  const { state, alphabet, wrongLetters, actions } = game;
  const isOver = state.status !== 'playing';
  const won = state.status === 'won' || state.status === 'roundWon';

  const [smallConfetti, setSmallConfetti] = useState(false);
  const [confettiKey, setConfettiKey] = useState(0);

  // Confetti burst on every correct letter — small, brief.
  useEffect(() => {
    if (!state.lastGuess?.correct) return;
    setConfettiKey((k) => k + 1);
    setSmallConfetti(true);
    const t = setTimeout(() => setSmallConfetti(false), 1100);
    return () => clearTimeout(t);
  }, [state.pulseKey]);

  const handleNext = () => {
    if (state.status === 'roundWon' || (state.status === 'roundLost' && state.lives > 0)) {
      actions.nextLevel();
    }
  };

  return (
    <div className="game">
      {/* Big celebration confetti when the round is won */}
      <Confetti active={won} />
      {/* Brief letter-by-letter confetti burst */}
      {smallConfetti && <Confetti key={confettiKey} active small />}

      <HUD state={state} onHint={actions.useHint} onMenu={actions.toMenu} />

      <main className="game__board">
        <section className="game__stage">
          <HangmanDrawing
            wrong={state.wrong}
            maxWrong={state.maxWrong}
            celebrating={won}
          />
        </section>

        <section className="game__center">
          {state.hintRevealed && (
            <div className="hint-banner">
              <span className="hint-banner__icon">💡</span>
              <span className="hint-banner__text">{state.hint}</span>
            </div>
          )}

          <WordDisplay
            word={state.word}
            guessed={state.guessed}
            reveal={state.status === 'lost' || state.status === 'roundLost'}
            lastGuess={state.lastGuess}
          />

          {wrongLetters.length > 0 && (
            <div className="wrong-list" aria-label="Wrong guesses">
              <span className="wrong-list__label">Wrong:</span>
              {wrongLetters.map((l) => (
                <span key={l} className="wrong-list__letter">{l.toUpperCase()}</span>
              ))}
            </div>
          )}

          <Keyboard
            alphabet={alphabet}
            guessed={state.guessed}
            word={state.word}
            onGuess={actions.guess}
            disabled={isOver}
            lastGuess={state.lastGuess}
          />
        </section>
      </main>

      {isOver && (
        <GameOverModal
          state={state}
          onNext={handleNext}
          onReplay={actions.replay}
          onMenu={actions.toMenu}
        />
      )}
    </div>
  );
}
