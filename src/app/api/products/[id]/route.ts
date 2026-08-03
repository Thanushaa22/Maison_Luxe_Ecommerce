import { NextRequest, NextResponse } from 'next/server';
import { mockProducts, mockReviews } from '@/lib/mock-data';

async function getProductFromDB(idOrSlug: string) {
  try {
    const prisma = (await import('@/lib/prisma')).default;
    const product = await prisma.product.findFirst({
      where: { OR: [{ id: idOrSlug }, { slug: idOrSlug }] },
      include: { reviews: { include: { user: { select: { id: true, name: true, avatar: true } } }, orderBy: { createdAt: 'desc' } } },
    });
    if (!product) return null;
    return {
      ...product,
      images: typeof product.images === 'string' ? (product.images as string).split(',').filter(Boolean) : [],
      sizes: typeof product.sizes === 'string' ? (product.sizes as string).split(',').filter(Boolean) : [],
      notes: typeof product.notes === 'string' ? JSON.parse(product.notes as string) : product.notes,
      reviews: product.reviews.map((r: Record<string, unknown>) => ({
        ...r,
        createdAt: (r.createdAt as Date).toISOString(),
      })),
    };
  } catch {
    return null;
  }
}

function getProductFromMock(idOrSlug: string) {
  const product = mockProducts.find(p => p.id === idOrSlug || p.slug === idOrSlug);
  if (!product) return null;
  const reviews = mockReviews.filter(r => r.productId === product.id);
  return { ...product, reviews };
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const dbProduct = await getProductFromDB(id);
    if (dbProduct) return NextResponse.json({ product: dbProduct });

    const mockProduct = getProductFromMock(id);
    if (mockProduct) return NextResponse.json({ product: mockProduct });

    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
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
    const prisma = (await import('@/lib/prisma')).default;
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
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { requireAdmin } = await import('@/lib/auth');
    await requireAdmin(request);
    const prisma = (await import('@/lib/prisma')).default;
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ message: 'Product deleted' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    if (message === 'UNAUTHORIZED') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (message === 'FORBIDDEN') return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
