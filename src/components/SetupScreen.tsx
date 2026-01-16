import { useGame } from '../context/GameContext';
import { CATEGORIES, QUESTION_COUNTS, type Difficulty } from '../types/game';
import { generateQuestions } from '../services/api';
import styles from './SetupScreen.module.css';
import photo1 from '../assets/photo1.jpg';
import photo2 from '../assets/photo2.jpg';

const DIFFICULTIES: { id: Difficulty; label: string }[] = [
  { id: 'easy', label: 'EASY' },
  { id: 'medium', label: 'MEDIUM' },
  { id: 'hard', label: 'HARD' },
];

export function SetupScreen() {
  const { state, dispatch, loadQuestions } = useGame();
  const { selectedCategories, difficulty, questionCount } = state;

  const canStart = selectedCategories.length > 0;

  const handleStart = async () => {
    if (!canStart) return;

    dispatch({ type: 'START_LOADING' });

    try {
      const questions = await generateQuestions(
        selectedCategories,
        difficulty,
        questionCount
      );
      loadQuestions(questions);
    } catch (error) {
      console.error('Failed to generate questions:', error);
      dispatch({ type: 'RESTART_GAME' });
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <img src={photo1} alt="" className={styles.headerImage} />
        <div className={styles.titleContainer}>
          <h1 className={styles.title}>TRICIA</h1>
          <h2 className={styles.subtitle}>TRIVIA</h2>
        </div>
        <img src={photo2} alt="" className={styles.headerImage} />
      </header>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>SELECT CATEGORIES</h3>
        <div className={styles.categoryGrid}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              className={`${styles.categoryBtn} ${
                selectedCategories.includes(cat.id) ? styles.selected : ''
              }`}
              onClick={() => dispatch({ type: 'TOGGLE_CATEGORY', category: cat.id })}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>DIFFICULTY</h3>
        <div className={styles.optionRow}>
          {DIFFICULTIES.map((d) => (
            <button
              key={d.id}
              className={`${styles.optionBtn} ${
                difficulty === d.id ? styles.selected : ''
              }`}
              onClick={() => dispatch({ type: 'SET_DIFFICULTY', difficulty: d.id })}
            >
              {d.label}
            </button>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>QUESTIONS</h3>
        <div className={styles.optionRow}>
          {QUESTION_COUNTS.map((count) => (
            <button
              key={count}
              className={`${styles.optionBtn} ${
                questionCount === count ? styles.selected : ''
              }`}
              onClick={() => dispatch({ type: 'SET_QUESTION_COUNT', count })}
            >
              {count}
            </button>
          ))}
        </div>
      </section>

      <button
        className={`${styles.startBtn} ${canStart ? styles.ready : ''}`}
        onClick={handleStart}
        disabled={!canStart}
      >
        START GAME
      </button>

      {!canStart && (
        <p className={styles.hint}>Select at least one category to begin</p>
      )}
    </div>
  );
}
