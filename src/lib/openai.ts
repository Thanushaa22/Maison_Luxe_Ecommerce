import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  console.warn('OPENAI_API_KEY is not set. AI features will use fallback algorithm.');
}

export const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

export async function generateFragranceRecommendations(description: string): Promise<string> {
  if (!openai) {
    return '';
  }

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: `You are a luxury perfume expert. Based on user descriptions, recommend perfume notes and characteristics. Return a JSON object with: topNotes, heartNotes, baseNotes (arrays of strings), mood (array of strings), and category (string). Be specific and sophisticated in your recommendations.`,
      },
      {
        role: 'user',
        content: description,
      },
    ],
    temperature: 0.7,
    max_tokens: 500,
  });

  return response.choices[0].message.content || '';
}
