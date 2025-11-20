import { prisma } from '@/lib/db/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // TODO: 在實現認證後，改為根據用戶 ID 查詢
    // 目前查詢所有訂單，按建立時間倒序
    const orders = await prisma.order.findMany({
      include: {
        items: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: '取得訂單歷史失敗' },
      { status: 500 }
    );
  }
}
