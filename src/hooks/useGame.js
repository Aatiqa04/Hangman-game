import { useCallback, useEffect, useMemo, useReducer, useRef } from 'react';
import {
  CATEGORIES,
  DIFFICULTIES,
  DIFFICULTY_CONFIG,
  pickWord,
  pickWordAnyCategory,
} from '../data/words.js';
import { sfx } from './useSound.js';

// Pure helpers --------------------------------------------------------------
const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'.split('');

function uniqueLetters(word) {
  return new Set(word.toLowerCase().replace(/[^a-z]/g, '').split(''));
}

function isWordSolved(word, guessed) {
  for (const ch of word.toLowerCase()) {
    if (!/[a-z]/.test(ch)) continue;
    if (!guessed.has(ch)) return false;
  }
  return true;
}

function difficultyForLevel(level) {
  // Campaign mode: ramp difficulty as the player progresses.
  if (level <= 2) return 'easy';
  if (level <= 5) return 'medium';
  if (level <= 8) return 'hard';
  return 'expert';
}

function buildEntry(mode, options, used) {
  const { category, difficulty, level } = options;
  if (mode === 'campaign') {
    const diff = difficultyForLevel(level);
    return { ...pickWordAnyCategory(diff, used), difficulty: diff };
  }
  if (mode === 'categories') {
    const diff = DIFFICULTIES[Math.min(DIFFICULTIES.length - 1, Math.floor((level - 1) / 2))];
    return { ...pickWord(category, diff, used), category, difficulty: diff };
  }
  if (mode === 'timeAttack') {
    return { ...pickWordAnyCategory(difficulty, used), difficulty };
  }
  // classic
  return { ...pickWord(category, difficulty, used), category, difficulty };
}

// Reducer -------------------------------------------------------------------
const initialState = {
  status: 'menu',          // 'menu' | 'playing' | 'won' | 'lost' | 'roundWon' | 'roundLost'
  mode: null,              // 'classic' | 'campaign' | 'timeAttack' | 'categories'
  category: null,
  difficulty: 'easy',
  level: 1,
  lives: 3,
  score: 0,
  streak: 0,
  hintsLeft: 1,
  hintRevealed: false,
  word: '',
  hint: '',
  wordCategory: '',
  wordDifficulty: 'easy',
  guessed: new Set(),
  wrong: 0,
  maxWrong: 6,
  timeLeft: null,
  usedWords: new Set(),
  lastGuess: null,            // { letter, correct } — drives flash animations
  shakeKey: 0,                // bumps on wrong guesses to retrigger shake
  pulseKey: 0,                // bumps on correct guesses
};

function reducer(state, action) {
  switch (action.type) {
    case 'START_MODE': {
      const { mode, category, difficulty } = action;
      const lives = mode === 'campaign' ? 3 : 1;
      const level = 1;
      const used = new Set();
      const entry = buildEntry(mode, { mode, category, difficulty, level }, used);
      const cfg = DIFFICULTY_CONFIG[entry.difficulty];
      return {
        ...initialState,
        status: 'playing',
        mode,
        category: category ?? null,
        difficulty: difficulty ?? 'easy',
        level,
        lives,
        score: 0,
        streak: 0,
        hintsLeft: mode === 'campaign' ? 3 : 1,
        word: entry.word,
        hint: entry.hint,
        wordCategory: entry.category || category || '',
        wordDifficulty: entry.difficulty,
        maxWrong: cfg.maxWrong,
        timeLeft: mode === 'timeAttack' ? cfg.timeLimit : null,
        usedWords: new Set([entry.word]),
      };
    }

    case 'GUESS': {
      if (state.status !== 'playing') return state;
      const letter = action.letter.toLowerCase();
      if (state.guessed.has(letter)) return state;
      const guessed = new Set(state.guessed);
      guessed.add(letter);
      const wordLetters = uniqueLetters(state.word);
      const correct = wordLetters.has(letter);
      const wrong = correct ? state.wrong : state.wrong + 1;

      let score = state.score;
      if (correct) score += 10 * (DIFFICULTY_CONFIG[state.wordDifficulty].points / 50);

      const solved = isWordSolved(state.word, guessed);
      const dead = wrong >= state.maxWrong;

      if (solved) {
        const cfg = DIFFICULTY_CONFIG[state.wordDifficulty];
        const timeBonus = state.mode === 'timeAttack' ? state.timeLeft * 5 : 0;
        const livesBonus = (state.maxWrong - wrong) * 15;
        const winScore = score + cfg.points + timeBonus + livesBonus;
        const streak = state.streak + 1;
        return {
          ...state,
          guessed,
          wrong,
          score: winScore + streak * 10,
          streak,
          status: state.mode === 'classic' ? 'won' : 'roundWon',
          lastGuess: { letter, correct: true },
          pulseKey: state.pulseKey + 1,
        };
      }

      if (dead) {
        const lives = state.lives - 1;
        return {
          ...state,
          guessed,
          wrong,
          score,
          streak: 0,
          lives,
          status: state.mode === 'classic' ? 'lost' : lives <= 0 ? 'lost' : 'roundLost',
          lastGuess: { letter, correct: false },
          shakeKey: state.shakeKey + 1,
        };
      }

      return {
        ...state,
        guessed,
        wrong,
        score,
        lastGuess: { letter, correct },
        shakeKey: correct ? state.shakeKey : state.shakeKey + 1,
        pulseKey: correct ? state.pulseKey + 1 : state.pulseKey,
      };
    }

    case 'TICK': {
      if (state.status !== 'playing' || state.timeLeft == null) return state;
      const t = state.timeLeft - 1;
      if (t <= 0) {
        const lives = state.lives - 1;
        return {
          ...state,
          timeLeft: 0,
          lives,
          streak: 0,
          status: state.mode === 'classic' ? 'lost' : lives <= 0 ? 'lost' : 'roundLost',
        };
      }
      return { ...state, timeLeft: t };
    }

    case 'NEXT_LEVEL': {
      const level = state.level + 1;
      const used = new Set(state.usedWords);
      const entry = buildEntry(state.mode, {
        mode: state.mode,
        category: state.category,
        difficulty: state.difficulty,
        level,
      }, used);
      used.add(entry.word);
      const cfg = DIFFICULTY_CONFIG[entry.difficulty];
      return {
        ...state,
        status: 'playing',
        level,
        word: entry.word,
        hint: entry.hint,
        wordCategory: entry.category || state.category || '',
        wordDifficulty: entry.difficulty,
        maxWrong: cfg.maxWrong,
        guessed: new Set(),
        wrong: 0,
        timeLeft: state.mode === 'timeAttack' ? cfg.timeLimit : null,
        usedWords: used,
        hintsLeft: state.mode === 'campaign' ? Math.min(3, state.hintsLeft + 1) : 1,
        hintRevealed: false,
      };
    }

    case 'REPLAY': {
      // Same mode/options, fresh game.
      return reducer(initialState, {
        type: 'START_MODE',
        mode: state.mode,
        category: state.category,
        difficulty: state.difficulty,
      });
    }

    case 'USE_HINT': {
      if (state.hintsLeft <= 0 || state.hintRevealed) return state;
      return {
        ...state,
        hintsLeft: state.hintsLeft - 1,
        hintRevealed: true,
        score: Math.max(0, state.score - 25),
      };
    }

    case 'TO_MENU':
      return { ...initialState };

    default:
      return state;
  }
}

// Hook ----------------------------------------------------------------------
export function useGame() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const tickRef = useRef(null);
  const prevStatusRef = useRef(state.status);

  // Timer for time-attack mode.
  useEffect(() => {
    if (state.status !== 'playing' || state.timeLeft == null) {
      if (tickRef.current) clearInterval(tickRef.current);
      tickRef.current = null;
      return undefined;
    }
    tickRef.current = setInterval(() => dispatch({ type: 'TICK' }), 1000);
    return () => clearInterval(tickRef.current);
  }, [state.status, state.timeLeft != null, state.word]);

  // Audio cues — letter feedback.
  useEffect(() => {
    if (!state.lastGuess) return;
    if (state.lastGuess.correct) sfx.correct();
    else sfx.wrong();
  }, [state.shakeKey, state.pulseKey]);

  // Audio cues — round transitions.
  useEffect(() => {
    const prev = prevStatusRef.current;
    if (prev === state.status) return;
    if (state.status === 'won' || state.status === 'roundWon') sfx.win();
    if (state.status === 'lost' || state.status === 'roundLost') sfx.lose();
    if (prev === 'roundWon' && state.status === 'playing') sfx.level();
    prevStatusRef.current = state.status;
  }, [state.status]);

  // Tick sound for last 5 seconds in time-attack.
  useEffect(() => {
    if (state.timeLeft != null && state.timeLeft > 0 && state.timeLeft <= 5 && state.status === 'playing') {
      sfx.tick();
    }
  }, [state.timeLeft]);

  // Keyboard input.
  useEffect(() => {
    const onKey = (e) => {
      if (state.status !== 'playing') return;
      const k = e.key.toLowerCase();
      if (k.length === 1 && k >= 'a' && k <= 'z') {
        dispatch({ type: 'GUESS', letter: k });
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [state.status]);

  const startMode = useCallback(
    (mode, opts = {}) => dispatch({ type: 'START_MODE', mode, ...opts }),
    [],
  );
  const guess     = useCallback((letter) => dispatch({ type: 'GUESS', letter }), []);
  const nextLevel = useCallback(() => dispatch({ type: 'NEXT_LEVEL' }), []);
  const replay    = useCallback(() => dispatch({ type: 'REPLAY' }), []);
  const useHint   = useCallback(() => dispatch({ type: 'USE_HINT' }), []);
  const toMenu    = useCallback(() => dispatch({ type: 'TO_MENU' }), []);

  const correctLetters = useMemo(() => {
    const set = uniqueLetters(state.word);
    return [...state.guessed].filter((l) => set.has(l));
  }, [state.guessed, state.word]);

  const wrongLetters = useMemo(() => {
    const set = uniqueLetters(state.word);
    return [...state.guessed].filter((l) => !set.has(l));
  }, [state.guessed, state.word]);

  return {
    state,
    alphabet: ALPHABET,
    categories: CATEGORIES,
    difficulties: DIFFICULTIES,
    correctLetters,
    wrongLetters,
    actions: { startMode, guess, nextLevel, replay, useHint, toMenu },
  };
}
