import { NextRequest, NextResponse } from 'next/server';
import { mockUser } from '@/lib/mock-data';

export async function GET(request: NextRequest) {
  const auth = request.headers.get('Authorization');
  if (!auth) return NextResponse.json({ message: 'No token' }, { status: 401 });
  return NextResponse.json({ user: mockUser });
}
