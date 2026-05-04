import { useEffect, useState } from 'react';

const KEY = 'hangman:stats:v1';

const DEFAULT = {
  bestScore: 0,
  highestLevel: 0,
  totalGames: 0,
  totalWins: 0,
  bestStreak: 0,
};

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...DEFAULT };
    return { ...DEFAULT, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT };
  }
}

function save(data) {
  try { localStorage.setItem(KEY, JSON.stringify(data)); } catch { /* ignore */ }
}

// Hook providing stats and an updater that records the result of a finished game.
export function useStats(state) {
  const [stats, setStats] = useState(load);

  useEffect(() => {
    if (state.status !== 'won' && state.status !== 'lost') return;
    setStats((prev) => {
      const next = {
        bestScore:    Math.max(prev.bestScore, Math.round(state.score)),
        highestLevel: Math.max(prev.highestLevel, state.level),
        totalGames:   prev.totalGames + 1,
        totalWins:    prev.totalWins + (state.status === 'won' ? 1 : 0),
        bestStreak:   Math.max(prev.bestStreak, state.streak),
      };
      save(next);
      return next;
    });
  }, [state.status]);

  return stats;
}

// For the menu — read-only access without subscribing to game state.
export function useStatsReadonly() {
  const [stats, setStats] = useState(load);
  useEffect(() => {
    const onStorage = (e) => { if (e.key === KEY) setStats(load()); };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);
  return stats;
}
