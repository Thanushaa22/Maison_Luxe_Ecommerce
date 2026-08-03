import { NextRequest, NextResponse } from 'next/server';
import { semanticSearch } from '@/lib/semantic-search';

export async function POST(request: NextRequest) {
  const { message } = await request.json();
  const query = (message || '').trim();

  if (!query) {
    return NextResponse.json({
      message: 'Tell me about the mood, occasion, or notes you are looking for, and I will find the perfect fragrance for you.',
      products: [],
    });
  }

  const results = semanticSearch(query, 3);

  if (results.length === 0) {
    return NextResponse.json({
      message: 'I could not find an exact match, but here are some of our finest fragrances you might love.',
      products: [],
    });
  }

  const topScore = results[0].score;
  let response = '';
  if (topScore > 0.5) {
    response = `Excellent taste! Based on "${query}", I have curated these exceptional fragrances that perfectly match your preferences.`;
  } else if (topScore > 0.25) {
    response = `Based on your description, I have found these fragrances that capture the essence of what you are looking for.`;
  } else {
    response = `Here are some of our finest fragrances that might resonate with your taste.`;
  }

  return NextResponse.json({
    message: response,
    products: results.map(r => ({
      id: r.product.id,
      name: r.product.name,
      brand: r.product.brand,
      price: r.product.price,
      image: r.product.images[0],
      matchScore: Math.round(r.score * 100),
    })),
  });
}
