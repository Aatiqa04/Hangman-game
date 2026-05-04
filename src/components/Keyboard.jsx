const ROWS = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm'];

export default function Keyboard({ guessed, word, onGuess, disabled, lastGuess }) {
  const wordSet = new Set(word.toLowerCase().split(''));

  const keyClass = (l) => {
    const classes = ['key'];
    if (guessed.has(l)) classes.push(wordSet.has(l) ? 'key--correct' : 'key--wrong');
    if (lastGuess?.letter === l) classes.push(lastGuess.correct ? 'key--just-correct' : 'key--just-wrong');
    return classes.join(' ');
  };

  return (
    <div className="keyboard" aria-label="On-screen keyboard">
      {ROWS.map((row) => (
        <div className="keyboard__row" key={row}>
          {row.split('').map((l) => (
            <button
              key={l}
              className={keyClass(l)}
              disabled={disabled || guessed.has(l)}
              onClick={() => onGuess(l)}
              aria-label={`Letter ${l.toUpperCase()}`}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}
