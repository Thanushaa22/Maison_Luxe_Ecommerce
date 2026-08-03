import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ items: [] });

    const items = await prisma.wishlist.findMany({
      where: { userId: user.id },
      include: { product: true },
      orderBy: { createdAt: 'desc' },
    });

    const formatted = items.map(item => ({
      id: item.id,
      productId: item.productId,
      createdAt: item.createdAt,
      product: {
        ...item.product,
        images: item.product.images ? item.product.images.split(',').filter(Boolean) : [],
        sizes: item.product.sizes ? item.product.sizes.split(',').filter(Boolean) : [],
        notes: item.product.notes ? JSON.parse(item.product.notes) : null,
      },
    }));

    return NextResponse.json({ items: formatted });
  } catch (error) {
    console.error('Wishlist GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { productId } = await request.json();
    if (!productId) return NextResponse.json({ error: 'Product ID required' }, { status: 400 });

    const existing = await prisma.wishlist.findFirst({ where: { userId: user.id, productId } });
    if (existing) {
      await prisma.wishlist.delete({ where: { id: existing.id } });
      return NextResponse.json({ action: 'removed', inWishlist: false });
    }

    await prisma.wishlist.create({ data: { userId: user.id, productId } });
    return NextResponse.json({ action: 'added', inWishlist: true });
  } catch (error) {
    console.error('Wishlist POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
