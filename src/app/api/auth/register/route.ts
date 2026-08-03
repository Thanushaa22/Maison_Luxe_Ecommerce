import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hashPassword, generateToken } from '@/lib/auth';
import { isDbAvailable } from '@/lib/db-check';
import { findMockUserByEmail, createMockUser } from '@/lib/mock-data';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, phone } = await request.json();
    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 });
    }

    const dbUp = await isDbAvailable();

    if (dbUp) {
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) {
        return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
      }
      const hashedPassword = await hashPassword(password);
      const user = await prisma.user.create({
        data: { name, email, password: hashedPassword, phone: phone || null },
        select: { id: true, email: true, name: true, role: true, phone: true, avatar: true, createdAt: true },
      });
      const token = generateToken(user);
      return NextResponse.json({ user, token }, { status: 201 });
    }

    if (findMockUserByEmail(email)) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
    }
    const hashedPassword = await hashPassword(password);
    const newUser = createMockUser({
      id: `user-${Date.now()}`,
      name,
      email,
      password: hashedPassword,
      role: 'CUSTOMER',
      phone: phone || null,
      avatar: null,
      createdAt: new Date().toISOString(),
    });
    const token = generateToken({ id: newUser.id, email: newUser.email, role: newUser.role });
    const { password: _, ...userWithoutPassword } = newUser;
    return NextResponse.json({ user: userWithoutPassword, token }, { status: 201 });
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
