import { NextRequest, NextResponse } from 'next/server';
import { hashPassword, generateToken } from '@/lib/auth';
import { findMockUserByEmail, createMockUser } from '@/lib/mock-data';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, phone } = await request.json();
    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 });
    }

    let existing: any = null;

    try {
      const prisma = (await import('@/lib/prisma')).default;
      existing = await prisma.user.findUnique({ where: { email } });
    } catch {
      console.log('Prisma unavailable, using mock users');
    }

    if (!existing) {
      existing = findMockUserByEmail(email);
    }

    if (existing) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
    }

    const hashedPassword = await hashPassword(password);

    let newUser: any = null;

    try {
      const prisma = (await import('@/lib/prisma')).default;
      newUser = await prisma.user.create({
        data: { name, email, password: hashedPassword, phone: phone || null },
        select: { id: true, email: true, name: true, role: true, phone: true, avatar: true, createdAt: true },
      });
    } catch {
      console.log('Prisma unavailable, creating mock user');
    }

    if (!newUser) {
      newUser = createMockUser({
        id: `user-${Date.now()}`,
        name,
        email,
        password: hashedPassword,
        role: 'CUSTOMER',
        phone: phone || null,
        avatar: null,
        createdAt: new Date().toISOString(),
      });
      const { password: _, ...userWithoutPassword } = newUser;
      newUser = userWithoutPassword;
    }

    const token = generateToken({ id: newUser.id, email: newUser.email, role: newUser.role });
    return NextResponse.json({ user: newUser, token }, { status: 201 });
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
