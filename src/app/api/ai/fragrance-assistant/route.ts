import { NextRequest, NextResponse } from 'next/server';
import { semanticSearch } from '@/lib/semantic-search';

function getPersonalizedResponse(query: string, results: ReturnType<typeof semanticSearch>): string {
  const q = query.toLowerCase();
  const top = results[0];

  // Detect intent
  const isQuestion = q.includes('?') || q.startsWith('what') || q.startsWith('which') || q.startsWith('recommend') || q.startsWith('suggest');
  const isGreeting = q.startsWith('hi') || q.startsWith('hello') || q.startsWith('hey');
  const isMood = q.includes('romantic') || q.includes('fresh') || q.includes('bold') || q.includes('elegant') || q.includes('sexy') || q.includes('warm');
  const isOccasion = q.includes('wedding') || q.includes('date') || q.includes('office') || q.includes('party') || q.includes('night') || q.includes('summer') || q.includes('winter');
  const isNote = q.includes('rose') || q.includes('oud') || q.includes('vanilla') || q.includes('amber') || q.includes('citrus') || q.includes('sandalwood') || q.includes('musk');

  if (isGreeting) {
    return 'Welcome to MAISON LUXE. I am your personal fragrance consultant. Tell me about the mood you want to set, the occasion, or any notes you are drawn to, and I will find your perfect scent.';
  }

  // Build personalized response with match details
  const matchPct = Math.round(top.score * 100);
  let intro = '';
  if (matchPct > 70) {
    intro = `I found an exceptional match for "${query}".`;
  } else if (matchPct > 40) {
    intro = `Based on "${query}", here are fragrances that capture that essence.`;
  } else {
    intro = `Here are some fragrances that might resonate with your taste.`;
  }

  // Add context about what was matched
  if (isMood) {
    const moodWord = ['romantic', 'fresh', 'bold', 'elegant', 'sexy', 'warm'].find(w => q.includes(w));
    intro += ` For a ${moodWord} mood, I recommend these.`;
  } else if (isOccasion) {
    const occasionWord = ['wedding', 'date', 'office', 'party', 'night', 'summer', 'winter'].find(w => q.includes(w));
    intro += ` For ${occasionWord}, these are ideal.`;
  } else if (isNote) {
    const noteWord = ['rose', 'oud', 'vanilla', 'amber', 'citrus', 'sandalwood', 'musk'].find(w => q.includes(w));
    intro += ` For ${noteWord} lovers, these are exceptional.`;
  }

  return intro;
}

function getTopNotes(product: { notes: { top: string[]; middle: string[]; base: string[] } }): string {
  return [...product.notes.top.slice(0, 2), ...product.notes.middle.slice(0, 1)].join(', ');
}

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
      message: 'I could not find an exact match for that. Try describing the mood (romantic, fresh, bold), an occasion (wedding, date, office), or notes you love (rose, oud, vanilla).',
      products: [],
    });
  }

  const response = getPersonalizedResponse(query, results);

  return NextResponse.json({
    message: response,
    products: results.map(r => ({
      id: r.product.id,
      name: r.product.name,
      brand: r.product.brand,
      price: r.product.price,
      image: r.product.images[0],
      matchScore: Math.round(r.score * 100),
      topNotes: getTopNotes(r.product),
      reason: r.score > 0.5
        ? `Perfect match — ${getTopNotes(r.product)}`
        : `Strong match — ${r.product.description.slice(0, 80)}...`,
    })),
  });
}
