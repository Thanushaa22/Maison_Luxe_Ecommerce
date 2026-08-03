import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import crypto from 'crypto';
import { isDbAvailable } from '@/lib/db-check';
import { findMockUserByEmail } from '@/lib/mock-data';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const dbUp = await isDbAvailable();

    if (dbUp) {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return NextResponse.json({ message: 'If an account exists, a reset link has been sent.' });
      }
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenExpiry = new Date(Date.now() + 3600000);
      await prisma.user.update({
        where: { id: user.id },
        data: { resetToken, resetTokenExpiry },
      });
      return NextResponse.json({ message: 'Reset token generated', resetToken });
    }

    const mockUser = findMockUserByEmail(email);
    if (!mockUser) {
      return NextResponse.json({ message: 'If an account exists, a reset link has been sent.' });
    }
    const resetToken = crypto.randomBytes(32).toString('hex');
    return NextResponse.json({ message: 'Reset token generated', resetToken });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
