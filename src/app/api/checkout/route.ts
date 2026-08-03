import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { mockProducts } from '@/lib/mock-data';

const mockOrders: any[] = [];

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { shippingAddress, paymentMethod, couponCode, items: clientItems } = await request.json();

    let orderItems: any[] = [];
    let subtotal = 0;

    // Try server-side cart first (DB)
    try {
      const prisma = (await import('@/lib/prisma')).default;
      if (prisma) {
        const cart = await prisma.cart.findUnique({
          where: { userId: user.id },
          include: { items: { include: { product: true } } },
        });

        if (cart && cart.items.length > 0) {
          orderItems = cart.items.map(item => {
            const price = item.product.price;
            subtotal += price * item.quantity;
            return {
              productId: item.productId,
              quantity: item.quantity,
              size: item.size,
              price,
              product: {
                name: item.product.name,
                image: item.product.images ? item.product.images.split(',')[0] : '',
                brand: item.product.brand,
              },
            };
          });

          // Clear cart after order
          await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
        }
      }
    } catch {
      console.log('Prisma cart unavailable, using client items');
    }

    // Fallback to client-sent items (from useCartStore localStorage)
    if (orderItems.length === 0 && clientItems && clientItems.length > 0) {
      orderItems = clientItems.map((item: any) => {
        const product = item.product || mockProducts.find(p => p.id === item.productId);
        const price = product?.price || 0;
        subtotal += price * item.quantity;
        return {
          productId: item.productId,
          quantity: item.quantity,
          size: item.size,
          price,
          product: {
            name: product?.name || 'Product',
            image: product?.images?.[0] || '',
            brand: product?.brand || '',
          },
        };
      });
    }

    if (orderItems.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    // Coupon handling
    let discount = 0;
    if (couponCode) {
      try {
        const prisma = (await import('@/lib/prisma')).default;
        if (prisma) {
          const coupon = await prisma.coupon.findUnique({ where: { code: couponCode } });
          if (coupon && coupon.isActive && new Date(coupon.validUntil) > new Date()) {
            if (!coupon.maxUses || coupon.usedCount < coupon.maxUses) {
              discount = coupon.discountType === 'percent'
                ? Math.round(subtotal * coupon.discountValue / 100)
                : coupon.discountValue;
              await prisma.coupon.update({ where: { id: coupon.id }, data: { usedCount: { increment: 1 } } });
            }
          }
        }
      } catch {}
    }

    const shipping = subtotal >= 10000 ? 0 : 500;
    const tax = Math.round((subtotal - discount) * 0.18);
    const total = subtotal - discount + shipping + tax;

    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    const order = {
      id: orderId,
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
      shippingAddress: shippingAddress || null,
      items: orderItems,
      createdAt: new Date().toISOString(),
    };

    // Try saving to DB
    try {
      const prisma = (await import('@/lib/prisma')).default;
      if (prisma) {
        const dbOrder = await prisma.order.create({
          data: {
            userId: user.id,
            total,
            subtotal,
            shipping,
            tax,
            discount,
            couponCode: couponCode || null,
            status: order.status,
            paymentMethod: order.paymentMethod,
            paymentStatus: order.paymentStatus,
            shippingAddress: shippingAddress ? JSON.stringify(shippingAddress) : null,
            items: {
              create: orderItems.map((item: any) => ({
                productId: item.productId,
                quantity: item.quantity,
                size: item.size,
                price: item.price,
              })),
            },
          },
          include: { items: true },
        });
        return NextResponse.json({ order: { ...order, id: dbOrder.id, createdAt: dbOrder.createdAt.toISOString() }, message: 'Order placed successfully' });
      }
    } catch {
      console.log('Prisma order save unavailable, using mock order');
    }

    mockOrders.push(order);
    return NextResponse.json({ order, message: 'Order placed successfully' });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
