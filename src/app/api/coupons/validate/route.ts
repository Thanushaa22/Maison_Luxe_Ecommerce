import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { code, subtotal } = await request.json();
    if (!code) return NextResponse.json({ error: 'Coupon code required' }, { status: 400 });

    const coupon = await prisma.coupon.findUnique({ where: { code: code.toUpperCase() } });
    if (!coupon) return NextResponse.json({ error: 'Invalid coupon code' }, { status: 404 });
    if (!coupon.isActive) return NextResponse.json({ error: 'Coupon is inactive' }, { status: 400 });
    if (new Date(coupon.validUntil) < new Date()) return NextResponse.json({ error: 'Coupon has expired' }, { status: 400 });
    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) return NextResponse.json({ error: 'Coupon usage limit reached' }, { status: 400 });
    if (coupon.minOrderAmount && subtotal < coupon.minOrderAmount) {
      return NextResponse.json({ error: `Minimum order amount is ₹${coupon.minOrderAmount}` }, { status: 400 });
    }

    let discount = 0;
    if (coupon.discountType === 'percent') {
      discount = Math.round((subtotal || 0) * coupon.discountValue / 100);
    } else {
      discount = coupon.discountValue;
    }

    return NextResponse.json({
      valid: true,
      coupon: {
        code: coupon.code,
        description: coupon.description,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discount,
      },
    });
  } catch (error) {
    console.error('Coupon validate error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
