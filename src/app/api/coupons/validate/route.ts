import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

const knownCoupons: Record<string, { code: string; description: string; discountType: string; discountValue: number; minOrderAmount: number }> = {
  WELCOME10: { code: 'WELCOME10', description: '10% off your first order', discountType: 'percent', discountValue: 10, minOrderAmount: 1000 },
  LUXE20: { code: 'LUXE20', description: '20% off on orders above ₹5000', discountType: 'percent', discountValue: 20, minOrderAmount: 5000 },
  FLAT500: { code: 'FLAT500', description: '₹500 off on orders above ₹3000', discountType: 'flat', discountValue: 500, minOrderAmount: 3000 },
};

export async function POST(request: NextRequest) {
  try {
    const { code, subtotal } = await request.json();
    if (!code) return NextResponse.json({ error: 'Coupon code required' }, { status: 400 });

    let coupon: { code: string; description: string; discountType: string; discountValue: number; minOrderAmount: number } | null = null;

    try {
      const dbCoupon = await prisma.coupon.findUnique({ where: { code: code.toUpperCase() } });
      if (dbCoupon) {
        if (!dbCoupon.isActive) return NextResponse.json({ error: 'Coupon is inactive' }, { status: 400 });
        if (new Date(dbCoupon.validUntil) < new Date()) return NextResponse.json({ error: 'Coupon has expired' }, { status: 400 });
        if (dbCoupon.maxUses && dbCoupon.usedCount >= dbCoupon.maxUses) return NextResponse.json({ error: 'Coupon usage limit reached' }, { status: 400 });
        if (dbCoupon.minOrderAmount && subtotal < dbCoupon.minOrderAmount) {
          return NextResponse.json({ error: `Minimum order amount is ₹${dbCoupon.minOrderAmount}` }, { status: 400 });
        }

        let discount = 0;
        if (dbCoupon.discountType === 'percent') {
          discount = Math.round((subtotal || 0) * dbCoupon.discountValue / 100);
        } else {
          discount = dbCoupon.discountValue;
        }

        return NextResponse.json({
          valid: true,
          coupon: { code: dbCoupon.code, description: dbCoupon.description, discountType: dbCoupon.discountType, discountValue: dbCoupon.discountValue, discount },
        });
      }
    } catch {
      // Prisma failed, fall through to hardcoded coupons
    }

    coupon = knownCoupons[code.toUpperCase()] || null;
    if (!coupon) return NextResponse.json({ error: 'Invalid coupon code' }, { status: 404 });

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
      coupon: { code: coupon.code, description: coupon.description, discountType: coupon.discountType, discountValue: coupon.discountValue, discount },
    });
  } catch (error) {
    console.error('Coupon validate error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
