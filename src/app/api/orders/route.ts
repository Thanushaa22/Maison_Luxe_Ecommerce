import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';

const mockOrders = [
  {
    id: 'ORD-001',
    total: 28000,
    subtotal: 27300,
    shipping: 0,
    tax: 4700,
    discount: 0,
    status: 'DELIVERED',
    paymentMethod: 'card',
    paymentStatus: 'paid',
    createdAt: '2026-07-28T00:00:00Z',
    updatedAt: '2026-07-31T00:00:00Z',
    items: [
      { id: '1', quantity: 1, size: '100ml', price: 14500, product: { id: '1', name: 'Noir Cristal', brand: 'Noir Cristal', images: ['/images/products/noir-cristal.png'] } },
      { id: '2', quantity: 1, size: '50ml', price: 12800, product: { id: '10', name: 'Velvet Dusk', brand: 'Maison Luxe', images: ['/images/products/velvet-orchid.png'] } },
    ],
  },
  {
    id: 'ORD-002',
    total: 16200,
    subtotal: 16200,
    shipping: 0,
    tax: 0,
    discount: 0,
    status: 'SHIPPED',
    paymentMethod: 'card',
    paymentStatus: 'paid',
    createdAt: '2026-07-29T00:00:00Z',
    updatedAt: '2026-08-01T00:00:00Z',
    items: [
      { id: '3', quantity: 1, size: '100ml', price: 16200, product: { id: '3', name: 'Nocturne Jardin', brand: 'Aurora Botanica', images: ['/images/products/nocturne-jardin.png'] } },
    ],
  },
  {
    id: 'ORD-003',
    total: 13500,
    subtotal: 13500,
    shipping: 0,
    tax: 0,
    discount: 0,
    status: 'PROCESSING',
    paymentMethod: 'cod',
    paymentStatus: 'pending',
    createdAt: '2026-07-30T00:00:00Z',
    updatedAt: '2026-07-30T00:00:00Z',
    items: [
      { id: '4', quantity: 1, size: '50ml', price: 13500, product: { id: '4', name: 'Lumière Solaire', brand: "Lumière d'Or", images: ['/images/products/lumiere-solaire.png'] } },
    ],
  },
];

async function getOrdersFromDB(userId: string) {
  try {
    const prisma = (await import('@/lib/prisma')).default;
    const count = await prisma.order.count({ where: { userId } });
    if (count === 0) return null;

    const orders = await prisma.order.findMany({
      where: { userId },
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' },
    });

    return orders.map(order => ({
      ...order,
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
      shippingAddress: order.shippingAddress ? JSON.parse(order.shippingAddress as string) : null,
      items: order.items.map(item => ({
        ...item,
        product: item.product ? {
          ...item.product,
          images: typeof item.product.images === 'string' ? (item.product.images as string).split(',').filter(Boolean) : [],
        } : null,
      })),
    }));
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      // Not logged in — return mock orders for demo
      return NextResponse.json({ orders: mockOrders });
    }

    const dbOrders = await getOrdersFromDB(user.id);
    if (dbOrders) return NextResponse.json({ orders: dbOrders });

    // DB empty — return mock orders
    return NextResponse.json({ orders: mockOrders });
  } catch (error) {
    console.error('Orders GET error:', error);
    // Fallback to mock on error
    return NextResponse.json({ orders: mockOrders });
  }
}
