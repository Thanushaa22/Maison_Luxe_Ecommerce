import { NextRequest, NextResponse } from 'next/server';
import { mockUser } from '@/lib/mock-data';

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();
  if (!email || !password) return NextResponse.json({ message: 'Email and password required' }, { status: 400 });
  if (email === 'admin@luxeperfume.com' && password === 'admin123') {
    return NextResponse.json({ user: mockUser, token: 'mock-admin-token' });
  }
  const user = { id: "2", email, name: email.split('@')[0], role: "CUSTOMER" as const, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
  return NextResponse.json({ user, token: 'mock-customer-token' });
}
