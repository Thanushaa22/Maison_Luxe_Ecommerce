import { NextRequest, NextResponse } from 'next/server';
import { generateToken } from '@/lib/auth';
import { findMockUserByEmail } from '@/lib/mock-data';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    let user: any = null;

    try {
      const { default: prisma } = await import('@/lib/prisma');
      if (prisma) {
        user = await prisma.user.findUnique({ where: { email } });
      }
    } catch (e) {
      console.log('Prisma unavailable for login:', e);
    }

    if (!user) {
      user = findMockUserByEmail(email);
    }

    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const token = generateToken({ id: user.id, email: user.email, role: user.role });
    const { password: _, ...userWithoutPassword } = user;
    return NextResponse.json({ user: userWithoutPassword, token });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
