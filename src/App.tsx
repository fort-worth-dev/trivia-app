import { GameProvider, useGame } from './context/GameContext';
import { SetupScreen } from './components/SetupScreen';
import { LoadingScreen } from './components/LoadingScreen';
import { QuestionScreen } from './components/QuestionScreen';
import { ResultsScreen } from './components/ResultsScreen';
import './styles/global.css';

function GameRouter() {
  const { state } = useGame();

  switch (state.phase) {
    case 'setup':
      return <SetupScreen />;
    case 'loading':
      return <LoadingScreen />;
    case 'playing':
    case 'feedback':
      return <QuestionScreen />;
    case 'results':
      return <ResultsScreen />;
    default:
      return <SetupScreen />;
  }
}

function App() {
  return (
    <GameProvider>
      <GameRouter />
    </GameProvider>
  );
}

export default App;
