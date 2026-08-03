import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { shippingAddress, paymentMethod, couponCode } = await request.json();

    // Get cart
    const cart = await prisma.cart.findUnique({
      where: { userId: user.id },
      include: { items: { include: { product: true } } },
    });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    // Calculate totals
    let subtotal = 0;
    const orderItems = cart.items.map(item => {
      const price = item.product.price;
      subtotal += price * item.quantity;
      return {
        productId: item.productId,
        quantity: item.quantity,
        size: item.size,
        price,
      };
    });

    let discount = 0;
    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({ where: { code: couponCode } });
      if (coupon && coupon.isActive && new Date(coupon.validUntil) > new Date()) {
        if (!coupon.maxUses || coupon.usedCount < coupon.maxUses) {
          if (coupon.discountType === 'percent') {
            discount = Math.round(subtotal * coupon.discountValue / 100);
          } else {
            discount = coupon.discountValue;
          }
          await prisma.coupon.update({
            where: { id: coupon.id },
            data: { usedCount: { increment: 1 } },
          });
        }
      }
    }

    const shipping = subtotal >= 10000 ? 0 : 500;
    const tax = Math.round((subtotal - discount) * 0.18);
    const total = subtotal - discount + shipping + tax;

    // Create order
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        total,
        subtotal,
        shipping,
        tax,
        discount,
        couponCode: couponCode || null,
        status: paymentMethod === 'cod' ? 'PENDING' : 'PROCESSING',
        paymentMethod: paymentMethod || 'card',
        paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
        shippingAddress: shippingAddress ? JSON.stringify(shippingAddress) : null,
        items: { create: orderItems },
      },
      include: { items: true },
    });

    // Update stock
    for (const item of cart.items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    // Clear cart
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });

    return NextResponse.json({
      order: {
        ...order,
        shippingAddress: order.shippingAddress ? JSON.parse(order.shippingAddress) : null,
        createdAt: order.createdAt.toISOString(),
      },
      message: 'Order placed successfully',
    });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
