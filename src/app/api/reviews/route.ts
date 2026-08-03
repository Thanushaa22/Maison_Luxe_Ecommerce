import { NextRequest, NextResponse } from 'next/server';
import { getMockReviews } from '@/lib/mock-data';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  return NextResponse.json({ reviews: getMockReviews(searchParams.get('productId') || undefined) });
}
export async function POST(request: NextRequest) {
  const body = await request.json();
  return NextResponse.json({ review: { id: Date.now().toString(), userId: "2", productId: body.productId, rating: body.rating, comment: body.comment, createdAt: new Date().toISOString() } });
}
