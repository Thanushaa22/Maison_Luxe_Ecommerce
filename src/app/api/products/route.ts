import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const category = searchParams.get('categories') || searchParams.get('category') || '';
    const featured = searchParams.get('featured') === 'true';
    const sort = searchParams.get('sort') || '';
    const limit = parseInt(searchParams.get('limit') || '12');
    const page = parseInt(searchParams.get('page') || '1');
    const priceMin = parseInt(searchParams.get('priceMin') || '0');
    const priceMax = parseInt(searchParams.get('priceMax') || '999999');

    const where: Record<string, unknown> = { isActive: true };
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { brand: { contains: search } },
        { description: { contains: search } },
        { category: { contains: search } },
      ];
    }
    if (category) {
      const cats = category.split(',').map(c => c.trim());
      where.category = { in: cats };
    }
    if (featured) where.featured = true;
    if (priceMin > 0 || priceMax < 999999) {
      where.price = { gte: priceMin, lte: priceMax };
    }

    const orderBy: Record<string, string> = {};
    if (sort === 'price_asc') orderBy.price = 'asc';
    else if (sort === 'price_desc') orderBy.price = 'desc';
    else if (sort === 'rating') orderBy.rating = 'desc';
    else orderBy.createdAt = 'desc';

    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      prisma.product.findMany({ where, orderBy, skip, take: limit }),
      prisma.product.count({ where }),
    ]);

    // Parse JSON fields for each product
    const products = items.map(p => ({
      ...p,
      images: p.images ? p.images.split(',').filter(Boolean) : [],
      sizes: p.sizes ? p.sizes.split(',').filter(Boolean) : [],
      notes: p.notes ? JSON.parse(p.notes) : null,
    }));

    return NextResponse.json({
      products,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Products GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { requireAdmin } = await import('@/lib/auth');
    await requireAdmin(request);

    const product = await prisma.product.create({
      data: {
        ...body,
        images: Array.isArray(body.images) ? body.images.join(',') : body.images,
        sizes: Array.isArray(body.sizes) ? body.sizes.join(',') : body.sizes,
        notes: body.notes ? (typeof body.notes === 'string' ? body.notes : JSON.stringify(body.notes)) : null,
      },
    });
    return NextResponse.json({ product }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    if (message === 'UNAUTHORIZED') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (message === 'FORBIDDEN') return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    console.error('Products POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
