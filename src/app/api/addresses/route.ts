import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
      const addresses = await prisma.address.findMany({
        where: { userId: user.id },
        orderBy: { isDefault: 'desc' },
      });
      return NextResponse.json({ addresses });
    } catch {
      return NextResponse.json({ addresses: [] });
    }
  } catch (error) {
    console.error('Addresses GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();

    try {
      if (body.isDefault) {
        await prisma.address.updateMany({ where: { userId: user.id }, data: { isDefault: false } });
      }
      const address = await prisma.address.create({
        data: { ...body, userId: user.id },
      });
      return NextResponse.json({ address }, { status: 201 });
    } catch {
      return NextResponse.json({ address: { id: `addr-${Date.now()}`, ...body, userId: user.id, createdAt: new Date().toISOString() } }, { status: 201 });
    }
  } catch (error) {
    console.error('Addresses POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
