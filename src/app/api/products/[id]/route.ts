import { NextRequest, NextResponse } from 'next/server';
import { getMockProductById, getMockReviews } from '@/lib/mock-data';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = getMockProductById(id);
  if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const reviews = getMockReviews(id);
  return NextResponse.json({ ...product, reviews });
}
