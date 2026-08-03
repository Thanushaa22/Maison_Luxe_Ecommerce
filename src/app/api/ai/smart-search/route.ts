import { NextRequest, NextResponse } from 'next/server';
import { mockProducts } from '@/lib/mock-data';

export async function GET(request: NextRequest) {
  const q = (new URL(request.url).searchParams.get('q') || '').toLowerCase();
  if (!q) return NextResponse.json({ products: [] });
  let results = [...mockProducts];
  const priceMatch = q.match(/under\s*₹?\s*(\d+)/);
  if (priceMatch) results = results.filter(p => p.price <= parseInt(priceMatch[1]));
  for (const cat of ['floral', 'oriental', 'woody', 'citrus', 'aquatic']) {
    if (q.includes(cat)) { results = results.filter(p => p.category === cat); break; }
  }
  if (results.length === mockProducts.length) {
    results = results.filter(p => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.category.includes(q) || p.notes.top.some(n => n.toLowerCase().includes(q)) || p.notes.middle.some(n => n.toLowerCase().includes(q)));
  }
  return NextResponse.json({ products: results.map(p => ({ id: p.id, name: p.name, brand: p.brand, price: p.price, image: p.images[0], category: p.category })) });
}
