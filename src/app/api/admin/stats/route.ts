import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);

    const [totalOrders, totalCustomers, totalProducts, totalRevenue, recentOrders, lowStockProducts] = await Promise.all([
      prisma.order.count(),
      prisma.user.count({ where: { role: 'CUSTOMER' } }),
      prisma.product.count(),
      prisma.order.aggregate({ _sum: { total: true }, where: { paymentStatus: 'paid' } }),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { name: true, email: true } }, items: true },
      }),
      prisma.product.findMany({ where: { stock: { lte: 10 } }, orderBy: { stock: 'asc' }, take: 5 }),
    ]);

    // Monthly revenue (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const monthlyOrders = await prisma.order.findMany({
      where: { createdAt: { gte: sixMonthsAgo }, paymentStatus: 'paid' },
      select: { total: true, createdAt: true },
    });

    const monthlyRevenue: Record<string, number> = {};
    monthlyOrders.forEach(order => {
      const month = order.createdAt.toLocaleString('default', { month: 'short', year: 'numeric' });
      monthlyRevenue[month] = (monthlyRevenue[month] || 0) + order.total;
    });

    // Best selling products
    const orderItems = await prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 5,
    });

    const bestSelling = await Promise.all(
      orderItems.map(async (item) => {
        const product = await prisma.product.findUnique({ where: { id: item.productId } });
        return { ...product, totalSold: item._sum.quantity || 0 };
      })
    );

    return NextResponse.json({
      stats: {
        totalRevenue: totalRevenue._sum.total || 0,
        totalOrders,
        totalCustomers,
        totalProducts,
        recentOrders: recentOrders.map(o => ({
          ...o,
          createdAt: o.createdAt.toISOString(),
          user: o.user,
        })),
        monthlyRevenue: Object.entries(monthlyRevenue).map(([month, revenue]) => ({ month, revenue })),
        bestSelling,
        lowStockProducts,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    if (message === 'UNAUTHORIZED') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (message === 'FORBIDDEN') return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    console.error('Admin stats error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
