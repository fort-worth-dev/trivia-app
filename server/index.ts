import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import Anthropic from '@anthropic-ai/sdk';

// Validate API key on startup
const apiKey = process.env.ANTHROPIC_API_KEY;
if (!apiKey) {
  console.error('ERROR: ANTHROPIC_API_KEY environment variable is not set');
  console.error('Please set it in your .env file or as an environment variable');
  process.exit(1);
}

const app = express();
app.use(cors());
app.use(express.json());

const anthropic = new Anthropic({
  apiKey,
});

interface QuestionRequest {
  categories: string[];
  difficulty: string;
  count: number;
}

function buildPrompt(categories: string[], difficulty: string, count: number): string {
  const categoryNames = categories.map((c) => {
    const names: Record<string, string> = {
      science: 'Science',
      history: 'History',
      geography: 'Geography',
      movies: 'Movies',
      music: 'Music',
      sports: 'Sports',
      literature: 'Literature',
      technology: 'Technology',
      nature: 'Nature',
      food: 'Food & Drink',
      art: 'Art',
      popculture: 'Pop Culture',
    };
    return names[c] || c;
  });

  return `You are a trivia question generator for a fun game app.

Generate exactly ${count} trivia questions with the following requirements:

CATEGORIES (distribute questions evenly across these):
${categoryNames.map((c) => `- ${c}`).join('\n')}

DIFFICULTY: ${difficulty}
- Easy: Common knowledge most adults would know
- Medium: Requires some specific knowledge or interest in the topic
- Hard: Challenging facts that only enthusiasts would know

RULES:
1. Each question must have exactly 4 answer options
2. Only ONE answer should be correct
3. Wrong answers must be plausible (not obviously wrong)
4. Questions should be engaging and interesting
5. Avoid overly obscure or controversial topics
6. For ${difficulty} difficulty, adjust complexity accordingly

OUTPUT FORMAT (respond ONLY with valid JSON, no markdown code blocks, no other text):
{
  "questions": [
    {
      "id": "q1",
      "category": "Category Name",
      "text": "What is the question?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 0
    }
  ]
}

Generate the questions now:`;
}

function parseResponse(responseText: string): unknown {
  // Handle potential markdown code blocks
  let jsonStr = responseText
    .replace(/```json\n?/g, '')
    .replace(/```\n?/g, '')
    .trim();

  const parsed = JSON.parse(jsonStr);
  return parsed;
}

app.post('/api/generate-questions', async (req, res) => {
  try {
    const { categories, difficulty, count }: QuestionRequest = req.body;

    if (!categories || categories.length === 0) {
      res.status(400).json({ error: 'At least one category is required' });
      return;
    }

    if (!difficulty || !['easy', 'medium', 'hard'].includes(difficulty)) {
      res.status(400).json({ error: 'Valid difficulty is required' });
      return;
    }

    if (!count || count < 1 || count > 20) {
      res.status(400).json({ error: 'Question count must be between 1 and 20' });
      return;
    }

    const prompt = buildPrompt(categories, difficulty, count);

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }],
    });

    const content = message.content[0];
    if (content.type !== 'text') {
      res.status(500).json({ error: 'Unexpected response format' });
      return;
    }

    const parsed = parseResponse(content.text);
    res.json(parsed);
  } catch (error) {
    console.error('Error generating questions:', error);
    res.status(500).json({ error: 'Failed to generate questions' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
