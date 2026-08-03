import { NextRequest, NextResponse } from 'next/server';
import { mockProducts } from '@/lib/mock-data';

async function getProductsFromDB(searchParams: URLSearchParams) {
  try {
    const prisma = (await import('@/lib/prisma')).default;
    const search = searchParams.get('search') || '';
    const category = searchParams.get('categories') || searchParams.get('category') || '';
    const featured = searchParams.get('featured') === 'true';
    const sort = searchParams.get('sort') || '';
    const limit = parseInt(searchParams.get('limit') || '12');
    const page = parseInt(searchParams.get('page') || '1');
    const priceMin = parseInt(searchParams.get('priceMin') || '0');
    const priceMax = parseInt(searchParams.get('priceMax') || '999999');

    const count = await prisma.product.count();
    if (count === 0) return null;

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

    const products = items.map((p: Record<string, unknown>) => ({
      ...p,
      images: typeof p.images === 'string' ? (p.images as string).split(',').filter(Boolean) : [],
      sizes: typeof p.sizes === 'string' ? (p.sizes as string).split(',').filter(Boolean) : [],
      notes: typeof p.notes === 'string' ? JSON.parse(p.notes as string) : p.notes,
    }));

    return { products, total, page, totalPages: Math.ceil(total / limit) };
  } catch {
    return null;
  }
}

function getProductsFromMock(searchParams: URLSearchParams) {
  const search = searchParams.get('search') || '';
  const category = searchParams.get('categories') || searchParams.get('category') || '';
  const featured = searchParams.get('featured') === 'true';
  const sort = searchParams.get('sort') || '';
  const limit = parseInt(searchParams.get('limit') || '12');
  const page = parseInt(searchParams.get('page') || '1');
  const priceMin = parseInt(searchParams.get('priceMin') || '0');
  const priceMax = parseInt(searchParams.get('priceMax') || '999999');

  let filtered = [...mockProducts];

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  }
  if (category) {
    const cats = category.split(',').map(c => c.trim().toLowerCase());
    filtered = filtered.filter(p => cats.includes(p.category.toLowerCase()));
  }
  if (featured) filtered = filtered.filter(p => p.featured);
  if (priceMin > 0 || priceMax < 999999) {
    filtered = filtered.filter(p => p.price >= priceMin && p.price <= priceMax);
  }

  if (sort === 'price_asc') filtered.sort((a, b) => a.price - b.price);
  else if (sort === 'price_desc') filtered.sort((a, b) => b.price - a.price);
  else if (sort === 'rating') filtered.sort((a, b) => b.rating - a.rating);
  else filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const total = filtered.length;
  const start = (page - 1) * limit;
  const products = filtered.slice(start, start + limit);

  return { products, total, page, totalPages: Math.ceil(total / limit) };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dbResult = await getProductsFromDB(searchParams);
    if (dbResult) return NextResponse.json(dbResult);
    return NextResponse.json(getProductsFromMock(searchParams));
  } catch (error) {
    console.error('Products GET error:', error);
    const { searchParams } = new URL(request.url);
    return NextResponse.json(getProductsFromMock(searchParams));
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { requireAdmin } = await import('@/lib/auth');
    await requireAdmin(request);
    const prisma = (await import('@/lib/prisma')).default;
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
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
