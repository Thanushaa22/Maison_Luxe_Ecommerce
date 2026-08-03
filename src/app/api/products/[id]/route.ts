import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: { reviews: { include: { user: { select: { id: true, name: true, avatar: true } } }, orderBy: { createdAt: 'desc' } } },
    });
    if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });

    const formatted = {
      ...product,
      images: product.images ? product.images.split(',').filter(Boolean) : [],
      sizes: product.sizes ? product.sizes.split(',').filter(Boolean) : [],
      notes: product.notes ? JSON.parse(product.notes) : null,
      reviews: product.reviews.map(r => ({ ...r, createdAt: r.createdAt.toISOString() })),
    };
    return NextResponse.json({ product: formatted });
  } catch (error) {
    console.error('Product GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { requireAdmin } = await import('@/lib/auth');
    await requireAdmin(request);
    const body = await request.json();
    const product = await prisma.product.update({
      where: { id },
      data: {
        ...body,
        images: body.images ? (Array.isArray(body.images) ? body.images.join(',') : body.images) : undefined,
        sizes: body.sizes ? (Array.isArray(body.sizes) ? body.sizes.join(',') : body.sizes) : undefined,
        notes: body.notes ? (typeof body.notes === 'string' ? body.notes : JSON.stringify(body.notes)) : undefined,
      },
    });
    return NextResponse.json({ product });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    if (message === 'UNAUTHORIZED') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (message === 'FORBIDDEN') return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    console.error('Product PUT error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { requireAdmin } = await import('@/lib/auth');
    await requireAdmin(request);
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ message: 'Product deleted' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    if (message === 'UNAUTHORIZED') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (message === 'FORBIDDEN') return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    console.error('Product DELETE error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
