import { type Question, type Difficulty } from '../types/game';

export async function generateQuestions(
  categories: string[],
  difficulty: Difficulty,
  count: number
): Promise<Question[]> {
  const response = await fetch('/api/generate-questions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ categories, difficulty, count }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Failed to generate questions');
  }

  const data = await response.json();
  return data.questions;
}
