export default function GameOverModal({ state, onNext, onReplay, onMenu }) {
  const { status, word, score, streak, level, mode } = state;
  const isRoundWon = status === 'roundWon';
  const isRoundLost = status === 'roundLost';
  const isGameWon = status === 'won';
  const isGameLost = status === 'lost';

  const won = isRoundWon || isGameWon;
  const title = won
    ? (isRoundWon ? `Level ${level} Cleared!` : 'You Won!')
    : (isRoundLost ? 'Round Lost' : 'Game Over');
  const emoji = won ? '🎉' : '💀';

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label={title}>
      <div className={`modal ${won ? 'modal--win' : 'modal--lose'}`}>
        <div className="modal__emoji" aria-hidden>{emoji}</div>
        <h2 className="modal__title">{title}</h2>
        <p className="modal__word">
          The word was <strong>{word.toUpperCase()}</strong>
        </p>
        <div className="modal__stats">
          <div className="modal__stat">
            <span>Score</span>
            <strong>{Math.round(score)}</strong>
          </div>
          {mode === 'campaign' || mode === 'categories' || mode === 'timeAttack' ? (
            <div className="modal__stat">
              <span>Level</span>
              <strong>{level}</strong>
            </div>
          ) : null}
          {streak > 0 && (
            <div className="modal__stat">
              <span>Streak</span>
              <strong>🔥 {streak}</strong>
            </div>
          )}
        </div>
        <div className="modal__actions">
          {(isRoundWon || (isRoundLost && state.lives > 0)) && (
            <button className="btn btn--primary" onClick={onNext}>
              {isRoundWon ? 'Next Level →' : 'Try Next Word'}
            </button>
          )}
          {(isGameWon || isGameLost) && (
            <button className="btn btn--primary" onClick={onReplay}>
              Play Again
            </button>
          )}
          <button className="btn btn--ghost" onClick={onMenu}>
            Main Menu
          </button>
        </div>
      </div>
    </div>
  );
}
