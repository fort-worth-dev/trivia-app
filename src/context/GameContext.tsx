import { createContext, useContext, useReducer, ReactNode } from 'react';
import { GameState, GameAction, Question } from '../types/game';

const initialState: GameState = {
  phase: 'setup',
  selectedCategories: [],
  difficulty: 'medium',
  questionCount: 10,
  questions: [],
  currentQuestionIndex: 0,
  score: 0,
  answers: [],
  lastAnswerCorrect: null,
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'TOGGLE_CATEGORY': {
      const isSelected = state.selectedCategories.includes(action.category);
      return {
        ...state,
        selectedCategories: isSelected
          ? state.selectedCategories.filter((c) => c !== action.category)
          : [...state.selectedCategories, action.category],
      };
    }
    case 'SET_DIFFICULTY':
      return { ...state, difficulty: action.difficulty };
    case 'SET_QUESTION_COUNT':
      return { ...state, questionCount: action.count };
    case 'START_LOADING':
      return { ...state, phase: 'loading' };
    case 'QUESTIONS_LOADED':
      return {
        ...state,
        phase: 'playing',
        questions: action.questions,
        currentQuestionIndex: 0,
        score: 0,
        answers: [],
      };
    case 'ANSWER_QUESTION': {
      const currentQuestion = state.questions[state.currentQuestionIndex];
      const isCorrect = action.selectedIndex === currentQuestion.correctIndex;
      const newAnswer = {
        questionId: currentQuestion.id,
        selectedIndex: action.selectedIndex,
        isCorrect,
      };
      return {
        ...state,
        phase: 'feedback',
        score: isCorrect ? state.score + 1 : state.score,
        answers: [...state.answers, newAnswer],
        lastAnswerCorrect: isCorrect,
      };
    }
    case 'NEXT_QUESTION': {
      const nextIndex = state.currentQuestionIndex + 1;
      if (nextIndex >= state.questions.length) {
        return { ...state, phase: 'results' };
      }
      return {
        ...state,
        phase: 'playing',
        currentQuestionIndex: nextIndex,
        lastAnswerCorrect: null,
      };
    }
    case 'RESTART_GAME':
      return {
        ...initialState,
        selectedCategories: state.selectedCategories,
        difficulty: state.difficulty,
        questionCount: state.questionCount,
      };
    default:
      return state;
  }
}

interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  loadQuestions: (questions: Question[]) => void;
}

const GameContext = createContext<GameContextType | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  const loadQuestions = (questions: Question[]) => {
    dispatch({ type: 'QUESTIONS_LOADED', questions });
  };

  return (
    <GameContext.Provider value={{ state, dispatch, loadQuestions }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
