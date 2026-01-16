import type { Handler } from '@netlify/functions';
import Anthropic from '@anthropic-ai/sdk';

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

export const handler: Handler = async (event, context) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: '',
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    // Validate API key
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      console.error('ERROR: ANTHROPIC_API_KEY environment variable is not set');
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ error: 'Server configuration error' }),
      };
    }

    // Parse request body
    const body = JSON.parse(event.body || '{}');
    const { categories, difficulty, count }: QuestionRequest = body;

    // Validate input
    if (!categories || categories.length === 0) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ error: 'At least one category is required' }),
      };
    }

    if (!difficulty || !['easy', 'medium', 'hard'].includes(difficulty)) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ error: 'Valid difficulty is required' }),
      };
    }

    if (!count || count < 1 || count > 20) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ error: 'Question count must be between 1 and 20' }),
      };
    }

    // Initialize Anthropic client
    const anthropic = new Anthropic({
      apiKey,
    });

    // Build prompt and generate questions
    const prompt = buildPrompt(categories, difficulty, count);

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }],
    });

    const content = message.content[0];
    if (content.type !== 'text') {
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ error: 'Unexpected response format' }),
      };
    }

    const parsed = parseResponse(content.text);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(parsed),
    };
  } catch (error) {
    console.error('Error generating questions:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ error: 'Failed to generate questions' }),
    };
  }
};
