import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { findMockUserByEmail } from '@/lib/mock-data';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    try {
      const { default: prisma } = await import('@/lib/prisma');
      if (prisma) {
        const user = await prisma.user.findUnique({ where: { email } });
        if (user) {
          const resetToken = crypto.randomBytes(32).toString('hex');
          const resetTokenExpiry = new Date(Date.now() + 3600000);
          await prisma.user.update({ where: { id: user.id }, data: { resetToken, resetTokenExpiry } });
          return NextResponse.json({ message: 'Reset token generated', resetToken });
        }
      }
    } catch {
      console.log('Prisma unavailable for forgot-password');
    }

    findMockUserByEmail(email);
    const resetToken = crypto.randomBytes(32).toString('hex');
    return NextResponse.json({ message: 'Reset token generated', resetToken });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
