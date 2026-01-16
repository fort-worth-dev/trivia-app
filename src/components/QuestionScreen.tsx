import { useEffect, useState } from 'react';
import { useGame } from '../context/GameContext';
import styles from './QuestionScreen.module.css';

export function QuestionScreen() {
  const { state, dispatch } = useGame();
  const { questions, currentQuestionIndex, phase, lastAnswerCorrect } = state;
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const question = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  useEffect(() => {
    if (phase === 'feedback') {
      const timer = setTimeout(() => {
        dispatch({ type: 'NEXT_QUESTION' });
        setSelectedAnswer(null);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [phase, dispatch]);

  const handleAnswer = (index: number) => {
    if (phase !== 'playing') return;
    setSelectedAnswer(index);
    dispatch({ type: 'ANSWER_QUESTION', selectedIndex: index });
  };

  const getAnswerClass = (index: number) => {
    if (phase !== 'feedback') {
      return styles.answerBtn;
    }

    if (index === question.correctIndex) {
      return `${styles.answerBtn} ${styles.correct}`;
    }
    if (index === selectedAnswer && !lastAnswerCorrect) {
      return `${styles.answerBtn} ${styles.incorrect}`;
    }
    return `${styles.answerBtn} ${styles.dimmed}`;
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.progress}>
          QUESTION {currentQuestionIndex + 1} OF {questions.length}
        </span>
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className={styles.questionCard}>
        <p className={styles.questionText}>{question.text}</p>
        <span className={styles.category}>{question.category}</span>
      </div>

      <div className={styles.answers}>
        {question.options.map((option, index) => (
          <button
            key={index}
            className={getAnswerClass(index)}
            onClick={() => handleAnswer(index)}
            disabled={phase === 'feedback'}
          >
            {option}
          </button>
        ))}
      </div>

      {phase === 'feedback' && (
        <div className={`${styles.feedback} ${lastAnswerCorrect ? styles.feedbackCorrect : styles.feedbackIncorrect}`}>
          {lastAnswerCorrect ? 'CORRECT!' : 'WRONG!'}
        </div>
      )}
    </div>
  );
}
