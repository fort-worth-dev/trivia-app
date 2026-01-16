export interface Question {
  id: string;
  category: string;
  text: string;
  options: string[];
  correctIndex: number;
}

export interface UserAnswer {
  questionId: string;
  selectedIndex: number;
  isCorrect: boolean;
}

export type GamePhase = 'setup' | 'loading' | 'playing' | 'feedback' | 'results';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface GameState {
  phase: GamePhase;
  selectedCategories: string[];
  difficulty: Difficulty;
  questionCount: number;
  questions: Question[];
  currentQuestionIndex: number;
  score: number;
  answers: UserAnswer[];
  lastAnswerCorrect: boolean | null;
}

export type GameAction =
  | { type: 'TOGGLE_CATEGORY'; category: string }
  | { type: 'SET_DIFFICULTY'; difficulty: Difficulty }
  | { type: 'SET_QUESTION_COUNT'; count: number }
  | { type: 'START_LOADING' }
  | { type: 'QUESTIONS_LOADED'; questions: Question[] }
  | { type: 'ANSWER_QUESTION'; selectedIndex: number }
  | { type: 'NEXT_QUESTION' }
  | { type: 'RESTART_GAME' };

export interface Category {
  id: string;
  name: string;
}

export const CATEGORIES: Category[] = [
  { id: 'science', name: 'Science' },
  { id: 'history', name: 'History' },
  { id: 'geography', name: 'Geography' },
  { id: 'movies', name: 'Movies' },
  { id: 'music', name: 'Music' },
  { id: 'sports', name: 'Sports' },
  { id: 'literature', name: 'Literature' },
  { id: 'technology', name: 'Technology' },
  { id: 'nature', name: 'Nature' },
  { id: 'food', name: 'Food & Drink' },
  { id: 'art', name: 'Art' },
  { id: 'popculture', name: 'Pop Culture' },
];

export const QUESTION_COUNTS = [5, 10, 15, 20];
