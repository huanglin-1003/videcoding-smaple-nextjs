import { prisma } from '@/lib/db/prisma';
import { NextRequest, NextResponse } from 'next/server';

interface CreateOrderRequest {
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    price: number;
    notes?: string;
  }>;
  subtotal: number;
  total: number;
  paymentMethod: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateOrderRequest = await request.json();

    // 驗證請求數據
    if (!body.items || body.items.length === 0) {
      return NextResponse.json(
        { error: '訂單必須包含至少一個商品' },
        { status: 400 }
      );
    }

    // 生成訂單號
    const orderNumber = `#${Date.now().toString().slice(-6)}`;

    // 建立訂單
    const order = await prisma.order.create({
      data: {
        orderNumber,
        subtotal: parseFloat(body.subtotal.toString()),
        total: parseFloat(body.total.toString()),
        status: 'PENDING',
        paymentMethod: body.paymentMethod as any,
        estimatedTime: 15,
        items: {
          create: body.items.map((item) => ({
            productId: item.productId,
            productName: item.productName,
            quantity: item.quantity,
            price: parseFloat(item.price.toString()),
            subtotal: parseFloat((item.price * item.quantity).toString()),
            notes: item.notes || '',
          })),
        },
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: '建立訂單失敗' },
      { status: 500 }
    );
  }
}
