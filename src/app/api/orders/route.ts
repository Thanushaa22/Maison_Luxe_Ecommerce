import { NextResponse } from 'next/server';

const mockOrders = [
  { id: 'ORD-001', userId: '2', total: 28000, status: 'DELIVERED', createdAt: '2026-07-28T00:00:00Z', items: [{ name: 'Noir Cristal', quantity: 1, size: '100ml', price: 14500 }, { name: 'Velvet Dusk', quantity: 1, size: '50ml', price: 12800 }] },
  { id: 'ORD-002', userId: '3', total: 16200, status: 'SHIPPED', createdAt: '2026-07-29T00:00:00Z', items: [{ name: 'Nocturne Jardin', quantity: 1, size: '100ml', price: 16200 }] },
  { id: 'ORD-003', userId: '2', total: 13500, status: 'PROCESSING', createdAt: '2026-07-30T00:00:00Z', items: [{ name: 'Lumiere Solaire', quantity: 1, size: '50ml', price: 13500 }] },
  { id: 'ORD-004', userId: '3', total: 44500, status: 'DELIVERED', createdAt: '2026-07-31T00:00:00Z', items: [{ name: 'Midnight Oud', quantity: 2, size: '50ml', price: 22500 }] },
  { id: 'ORD-005', userId: '2', total: 8500, status: 'PENDING', createdAt: '2026-08-01T00:00:00Z', items: [{ name: "Soleil d'Argent", quantity: 1, size: '100ml', price: 8500 }] },
];

export async function GET() {
  return NextResponse.json({ orders: mockOrders });
}
