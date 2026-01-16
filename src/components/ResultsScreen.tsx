import { useGame } from '../context/GameContext';
import styles from './ResultsScreen.module.css';

function getScoreMessage(percentage: number): string {
  if (percentage === 100) return 'PERFECT!';
  if (percentage >= 80) return 'EXCELLENT!';
  if (percentage >= 60) return 'GREAT JOB!';
  if (percentage >= 40) return 'GOOD EFFORT!';
  return 'KEEP TRYING!';
}

export function ResultsScreen() {
  const { state, dispatch } = useGame();
  const { score, questions } = state;
  const total = questions.length;
  const percentage = Math.round((score / total) * 100);
  const message = getScoreMessage(percentage);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>GAME OVER</h2>

      <div className={styles.scoreCard}>
        <span className={styles.score}>{score}</span>
        <span className={styles.divider}>/</span>
        <span className={styles.total}>{total}</span>
      </div>

      <p className={styles.message}>{message}</p>
      <p className={styles.percentage}>You got {percentage}% correct</p>

      <button
        className={styles.playAgainBtn}
        onClick={() => dispatch({ type: 'RESTART_GAME' })}
      >
        PLAY AGAIN
      </button>
    </div>
  );
}
