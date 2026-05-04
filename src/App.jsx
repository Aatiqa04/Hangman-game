import './App.css';
import { useGame } from './hooks/useGame.js';
import { useStats } from './hooks/useStats.js';
import { useBackButton } from './hooks/useBackButton.js';
import MainMenu from './components/MainMenu.jsx';
import GameScreen from './components/GameScreen.jsx';

export default function App() {
  const game = useGame();
  const stats = useStats(game.state);
  const inMenu = game.state.status === 'menu';
  useBackButton({ inMenu, onMenu: game.actions.toMenu });

  return (
    <div className="app">
      <div className="app__bg" aria-hidden />
      {inMenu
        ? <MainMenu onStart={game.actions.startMode} stats={stats} />
        : <GameScreen game={game} />}
      <footer className="app__footer">
        <span>Hangman · Built with React</span>
      </footer>
    </div>
  );
}
