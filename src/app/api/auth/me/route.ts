import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    return NextResponse.json({ user });
  } catch (error) {
    console.error('Auth me error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    const { name, phone, avatar } = await request.json();

    try {
      const prisma = (await import('@/lib/prisma')).default;
      const updated = await prisma.user.update({
        where: { id: user.id },
        data: { ...(name && { name }), ...(phone !== undefined && { phone }), ...(avatar !== undefined && { avatar }) },
        select: { id: true, email: true, name: true, role: true, phone: true, avatar: true, createdAt: true },
      });
      return NextResponse.json({ user: updated });
    } catch {
      return NextResponse.json({ user: { ...user, ...(name && { name }), ...(phone !== undefined && { phone }) } });
    }
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
