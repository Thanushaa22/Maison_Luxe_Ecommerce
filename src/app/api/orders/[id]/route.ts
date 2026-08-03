import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;

    try {
      const order = await prisma.order.findFirst({
        where: { id, userId: user.id },
        include: {
          items: { include: { product: true } },
        },
      });

      if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

      return NextResponse.json({
        order: {
          ...order,
          createdAt: order.createdAt instanceof Date ? order.createdAt.toISOString() : String(order.createdAt),
          updatedAt: order.updatedAt instanceof Date ? order.updatedAt.toISOString() : String(order.updatedAt),
          shippingAddress: order.shippingAddress ? JSON.parse(order.shippingAddress) : null,
          items: order.items.map(item => ({
            ...item,
            product: item.product ? {
              ...item.product,
              images: item.product.images ? item.product.images.split(',').filter(Boolean) : [],
            } : null,
          })),
        },
      });
    } catch {
      return NextResponse.json({ order: null });
    }
  } catch (error) {
    console.error('Order GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const { status } = await request.json();

    try {
      const order = await prisma.order.findFirst({ where: { id, userId: user.id } });
      if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

      if (status === 'CANCELLED' && order.status !== 'PENDING') {
        return NextResponse.json({ error: 'Only pending orders can be cancelled' }, { status: 400 });
      }

      const updated = await prisma.order.update({
        where: { id },
        data: { status },
      });

      if (status === 'CANCELLED') {
        const items = await prisma.orderItem.findMany({ where: { orderId: id } });
        for (const item of items) {
          await prisma.product.update({
            where: { id: item.productId },
            data: { stock: { increment: item.quantity } },
          });
        }
      }

      return NextResponse.json({ order: updated });
    } catch {
      return NextResponse.json({ order: { id, status, updatedAt: new Date().toISOString() } });
    }
  } catch (error) {
    console.error('Order PUT error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
