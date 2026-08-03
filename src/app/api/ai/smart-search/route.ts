import { NextRequest, NextResponse } from 'next/server';
import { semanticSearch } from '@/lib/semantic-search';
import { mockProducts } from '@/lib/mock-data';

export async function GET(request: NextRequest) {
  const q = (new URL(request.url).searchParams.get('q') || '').trim();
  if (!q) return NextResponse.json({ products: [] });

  // Price filter
  const priceMatch = q.match(/under\s*₹?\s*(\d+)/);
  if (priceMatch) {
    const maxPrice = parseInt(priceMatch[1]);
    const filtered = mockProducts.filter(p => p.price <= maxPrice);
    return NextResponse.json({
      products: filtered.map(p => ({
        id: p.id, name: p.name, brand: p.brand, price: p.price, image: p.images[0], category: p.category,
      })),
    });
  }

  // Semantic search
  const results = semanticSearch(q, 8);
  return NextResponse.json({
    products: results.map(r => ({
      id: r.product.id,
      name: r.product.name,
      brand: r.product.brand,
      price: r.product.price,
      image: r.product.images[0],
      category: r.product.category,
    })),
  });
}
