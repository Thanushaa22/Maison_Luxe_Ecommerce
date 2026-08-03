import { NextRequest, NextResponse } from 'next/server';
import { getMockProducts } from '@/lib/mock-data';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const result = getMockProducts({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || searchParams.get('categories') || '',
    featured: searchParams.get('featured') === 'true',
    sort: searchParams.get('sort') || '',
    limit: parseInt(searchParams.get('limit') || '12'),
    page: parseInt(searchParams.get('page') || '1'),
    priceMin: parseInt(searchParams.get('priceMin') || '0'),
    priceMax: parseInt(searchParams.get('priceMax') || '999999'),
  });
  return NextResponse.json({ products: result.items, total: result.total, page: result.page, totalPages: result.totalPages });
}
