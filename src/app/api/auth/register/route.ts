import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { name, email, password } = await request.json();
  if (!name || !email || !password) return NextResponse.json({ message: 'All fields required' }, { status: 400 });
  return NextResponse.json({ user: { id: Date.now().toString(), email, name, role: "CUSTOMER", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }, token: 'mock-new-token' });
}
