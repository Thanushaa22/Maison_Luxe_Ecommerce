import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ items: [] });

    try {
      const prisma = (await import('@/lib/prisma')).default;
      if (prisma) {
        const cart = await prisma.cart.findUnique({
          where: { userId: user.id },
          include: { items: { include: { product: true } } },
        });

        if (!cart) return NextResponse.json({ items: [] });

        const items = cart.items.map(item => ({
          id: item.id,
          productId: item.productId,
          quantity: item.quantity,
          size: item.size,
          product: {
            ...item.product,
            images: item.product.images ? item.product.images.split(',').filter(Boolean) : [],
            sizes: item.product.sizes ? item.product.sizes.split(',').filter(Boolean) : [],
            notes: item.product.notes ? JSON.parse(item.product.notes) : null,
          },
        }));

        return NextResponse.json({ items });
      }
    } catch {
      console.log('Prisma cart unavailable');
    }

    return NextResponse.json({ items: [] });
  } catch (error) {
    console.error('Cart GET error:', error);
    return NextResponse.json({ items: [] });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { productId, quantity = 1, size } = await request.json();
    if (!productId) return NextResponse.json({ error: 'Product ID required' }, { status: 400 });

    try {
      const prisma = (await import('@/lib/prisma')).default;
      if (prisma) {
        let cart = await prisma.cart.findUnique({ where: { userId: user.id } });
        if (!cart) {
          cart = await prisma.cart.create({ data: { userId: user.id } });
        }

        const existingItem = await prisma.cartItem.findFirst({
          where: { cartId: cart.id, productId, size: size || '50ml' },
        });

        if (existingItem) {
          await prisma.cartItem.update({
            where: { id: existingItem.id },
            data: { quantity: existingItem.quantity + quantity },
          });
        } else {
          await prisma.cartItem.create({
            data: { cartId: cart.id, productId, quantity, size: size || '50ml' },
          });
        }

        const updatedCart = await prisma.cart.findUnique({
          where: { userId: user.id },
          include: { items: { include: { product: true } } },
        });

        const items = (updatedCart?.items || []).map(item => ({
          id: item.id,
          productId: item.productId,
          quantity: item.quantity,
          size: item.size,
          product: {
            ...item.product,
            images: item.product.images ? item.product.images.split(',').filter(Boolean) : [],
            sizes: item.product.sizes ? item.product.sizes.split(',').filter(Boolean) : [],
          },
        }));

        return NextResponse.json({ items });
      }
    } catch {
      console.log('Prisma cart unavailable for POST');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Cart POST error:', error);
    return NextResponse.json({ success: true });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { itemId, quantity } = await request.json();
    if (!itemId || quantity < 0) return NextResponse.json({ error: 'Invalid data' }, { status: 400 });

    try {
      const prisma = (await import('@/lib/prisma')).default;
      if (prisma) {
        if (quantity === 0) {
          await prisma.cartItem.delete({ where: { id: itemId } });
        } else {
          await prisma.cartItem.update({ where: { id: itemId }, data: { quantity } });
        }
        return NextResponse.json({ success: true });
      }
    } catch {}

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Cart PUT error:', error);
    return NextResponse.json({ success: true });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { itemId } = await request.json();

    try {
      const prisma = (await import('@/lib/prisma')).default;
      if (prisma) {
        if (itemId) {
          await prisma.cartItem.delete({ where: { id: itemId } });
        } else {
          const cart = await prisma.cart.findUnique({ where: { userId: user.id } });
          if (cart) await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
        }
        return NextResponse.json({ success: true });
      }
    } catch {}

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Cart DELETE error:', error);
    return NextResponse.json({ success: true });
  }
}
