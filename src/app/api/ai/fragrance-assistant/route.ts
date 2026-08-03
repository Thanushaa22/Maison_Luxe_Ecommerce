import { NextRequest, NextResponse } from 'next/server';
import { generateResponse } from '@/lib/chat-engine';

export async function POST(request: NextRequest) {
  const { message, history = [] } = await request.json();
  const query = (message || '').trim();

  if (!query) {
    return NextResponse.json({
      message: 'Tell me about the mood, occasion, or notes you are looking for, and I will find the perfect fragrance for you.',
      products: [],
      suggestions: ['Recommend a perfume', 'Show me bestsellers', 'Compare two fragrances', 'What is your return policy?'],
    });
  }

  const response = generateResponse(query, history);
  return NextResponse.json(response);
}
