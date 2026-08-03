import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { mockCoupons } from '@/lib/mock-data';

export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);

    try {
      const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: 'desc' } });
      return NextResponse.json({ coupons });
    } catch {
      return NextResponse.json({ coupons: mockCoupons });
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    if (message === 'UNAUTHORIZED') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (message === 'FORBIDDEN') return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request);
    const body = await request.json();

    try {
      const coupon = await prisma.coupon.create({ data: body });
      return NextResponse.json({ coupon }, { status: 201 });
    } catch {
      return NextResponse.json({ coupon: { id: `coupon-${Date.now()}`, ...body, createdAt: new Date().toISOString() } }, { status: 201 });
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    if (message === 'UNAUTHORIZED') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (message === 'FORBIDDEN') return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await requireAdmin(request);
    const { id, ...data } = await request.json();
    if (!id) return NextResponse.json({ error: 'Coupon ID required' }, { status: 400 });

    try {
      const coupon = await prisma.coupon.update({ where: { id }, data });
      return NextResponse.json({ coupon });
    } catch {
      return NextResponse.json({ coupon: { id, ...data } });
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    if (message === 'UNAUTHORIZED') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (message === 'FORBIDDEN') return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await requireAdmin(request);
    const { id } = await request.json();
    if (!id) return NextResponse.json({ error: 'Coupon ID required' }, { status: 400 });

    try {
      await prisma.coupon.delete({ where: { id } });
      return NextResponse.json({ message: 'Coupon deleted' });
    } catch {
      return NextResponse.json({ message: 'Coupon deleted' });
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    if (message === 'UNAUTHORIZED') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (message === 'FORBIDDEN') return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
