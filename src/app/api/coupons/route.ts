import { NextRequest, NextResponse } from 'next/server';

const mockCoupons = [
  { id: '1', code: 'WELCOME10', type: 'PERCENTAGE', value: 10, minOrder: 5000, maxDiscount: 3000, isActive: true, usageLimit: 100, usedCount: 24, validUntil: new Date('2026-12-31'), createdAt: new Date() },
  { id: '2', code: 'LUXE20', type: 'PERCENTAGE', value: 20, minOrder: 15000, maxDiscount: 8000, isActive: true, usageLimit: 50, usedCount: 12, validUntil: new Date('2026-12-31'), createdAt: new Date() },
  { id: '3', code: 'FLAT500', type: 'FIXED', value: 500, minOrder: 3000, maxDiscount: 500, isActive: true, usageLimit: 200, usedCount: 67, validUntil: new Date('2026-12-31'), createdAt: new Date() },
  { id: '4', code: 'DIWALI15', type: 'PERCENTAGE', value: 15, minOrder: 10000, maxDiscount: 5000, isActive: true, usageLimit: 150, usedCount: 33, validUntil: new Date('2026-11-30'), createdAt: new Date() },
];

export async function GET() {
  try {
    const prisma = (await import('@/lib/prisma')).default;
    const coupons = await prisma.coupon.findMany({
      where: { isActive: true, validUntil: { gt: new Date() } },
      orderBy: { createdAt: 'desc' },
    });
    if (coupons.length === 0) return NextResponse.json({ coupons: mockCoupons });
    return NextResponse.json({ coupons });
  } catch {
    return NextResponse.json({ coupons: mockCoupons });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { requireAdmin } = await import('@/lib/auth');
    await requireAdmin(request);
    const body = await request.json();
    const prisma = (await import('@/lib/prisma')).default;
    const coupon = await prisma.coupon.create({ data: body });
    return NextResponse.json({ coupon }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    if (message === 'UNAUTHORIZED') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (message === 'FORBIDDEN') return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    console.error('Coupons POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
