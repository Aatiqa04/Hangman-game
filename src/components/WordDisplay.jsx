export default function WordDisplay({ word, guessed, reveal = false, lastGuess = null }) {
  const letters = word.toLowerCase().split('');
  const justRevealed = lastGuess?.correct ? lastGuess.letter : null;

  return (
    <div className="word">
      {letters.map((ch, i) => {
        if (!/[a-z]/.test(ch)) {
          return <span key={i} className="word__space">·</span>;
        }
        const shown = reveal || guessed.has(ch);
        const flipNow = ch === justRevealed;
        return (
          <span
            key={i}
            className={`word__letter ${shown ? 'word__letter--shown' : ''} ${flipNow ? 'word__letter--flip' : ''}`}
          >
            <span className="word__letter-inner">{shown ? ch.toUpperCase() : ''}</span>
            <span className="word__letter-underscore" />
          </span>
        );
      })}
    </div>
  );
}
