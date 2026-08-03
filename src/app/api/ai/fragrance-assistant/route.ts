import { NextRequest, NextResponse } from 'next/server';
import { mockProducts } from '@/lib/mock-data';

export async function POST(request: NextRequest) {
  const { message } = await request.json();
  const q = (message || '').toLowerCase();
  const keywordMap: Record<string, string[]> = {
    wedding: ["floral"], evening: ["oriental"], romantic: ["floral"], summer: ["citrus"],
    fresh: ["aquatic"], sweet: ["oriental"], woody: ["woody"], office: ["citrus"],
    night: ["oriental"], date: ["floral"], beach: ["aquatic"], warm: ["oriental"],
    light: ["citrus"], luxury: ["oriental"], classic: ["woody"],
  };
  let matched = '';
  for (const [key, cats] of Object.entries(keywordMap)) { if (q.includes(key)) { matched = cats[0]; break; } }
  let results = matched ? mockProducts.filter(p => p.category === matched) : mockProducts;
  if (results.length === 0) results = mockProducts.slice(0, 3);
  return NextResponse.json({
    message: `Based on your description, I've curated these exceptional fragrances for you. Each one captures the essence of what you're looking for.`,
    products: results.slice(0, 3).map(p => ({ id: p.id, name: p.name, brand: p.brand, price: p.price, image: p.images[0] })),
  });
}
