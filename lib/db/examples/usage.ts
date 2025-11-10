/**
 * Prisma Client Usage Examples
 *
 * This file contains example queries for the breakfast delivery app.
 * These are NOT meant to be imported - they are reference examples only.
 */

import { prisma } from '@/lib/db/prisma'
import { ProductCategory, OrderStatus, PaymentMethodType } from '@prisma/client'

// ============================================
// Product Examples
// ============================================

/**
 * Get all available products
 */
export async function getAllProducts() {
  return await prisma.product.findMany({
    where: { isAvailable: true },
    orderBy: { category: 'asc' }
  })
}

/**
 * Get products by category
 */
export async function getProductsByCategory(category: ProductCategory) {
  return await prisma.product.findMany({
    where: {
      category,
      isAvailable: true
    }
  })
}

/**
 * Create a new product
 */
export async function createProduct() {
  return await prisma.product.create({
    data: {
      name: 'Soy Milk',
      nameZh: '豆漿',
      description: 'Freshly made traditional soy milk',
      price: 2.00,
      image: '/images/products/soy-milk.jpg',
      category: ProductCategory.DRINK,
      isAvailable: true
    }
  })
}

// ============================================
// Order Examples
// ============================================

/**
 * Create a new order with items
 */
export async function createOrder(userId?: string) {
  // Generate order number (e.g., #123456)
  const orderNumber = `#${Math.floor(100000 + Math.random() * 900000)}`

  return await prisma.order.create({
    data: {
      orderNumber,
      subtotal: 10.50,
      total: 10.50,
      status: OrderStatus.PENDING,
      paymentMethod: PaymentMethodType.CREDIT_CARD,
      estimatedTime: 15,
      userId,
      items: {
        create: [
          {
            productId: 'product-id-here', // Replace with actual product ID
            productName: 'Soy Milk',
            quantity: 2,
            price: 2.00,
            subtotal: 4.00
          },
          {
            productId: 'product-id-here-2',
            productName: 'Egg Crepe',
            quantity: 1,
            price: 3.50,
            subtotal: 3.50
          }
        ]
      }
    },
    include: {
      items: true
    }
  })
}

/**
 * Get order by order number
 */
export async function getOrderByNumber(orderNumber: string) {
  return await prisma.order.findUnique({
    where: { orderNumber },
    include: {
      items: {
        include: {
          product: true
        }
      },
      user: true
    }
  })
}

/**
 * Update order status
 */
export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  return await prisma.order.update({
    where: { id: orderId },
    data: { status }
  })
}

/**
 * Get user's order history
 */
export async function getUserOrderHistory(userId: string) {
  return await prisma.order.findMany({
    where: { userId },
    include: {
      items: {
        include: {
          product: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
}

// ============================================
// User Examples
// ============================================

/**
 * Create a new user
 */
export async function createUser(email: string, name?: string) {
  return await prisma.user.create({
    data: {
      email,
      name
    }
  })
}

/**
 * Get user with orders and payment methods
 */
export async function getUserWithRelations(userId: string) {
  return await prisma.user.findUnique({
    where: { id: userId },
    include: {
      orders: {
        include: {
          items: true
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: 10 // Last 10 orders
      },
      paymentMethods: true
    }
  })
}

// ============================================
// Payment Method Examples
// ============================================

/**
 * Add payment method for user
 */
export async function addPaymentMethod(userId: string) {
  return await prisma.paymentMethod.create({
    data: {
      userId,
      type: PaymentMethodType.VISA,
      last4: '1234',
      brand: 'Visa',
      isDefault: false
    }
  })
}

/**
 * Get user's payment methods
 */
export async function getUserPaymentMethods(userId: string) {
  return await prisma.paymentMethod.findMany({
    where: { userId },
    orderBy: {
      isDefault: 'desc' // Default payment method first
    }
  })
}

// ============================================
// Advanced Queries
// ============================================

/**
 * Get order statistics
 */
export async function getOrderStatistics() {
  const totalOrders = await prisma.order.count()
  const pendingOrders = await prisma.order.count({
    where: { status: OrderStatus.PENDING }
  })
  const completedOrders = await prisma.order.count({
    where: { status: OrderStatus.DELIVERED }
  })

  const totalRevenue = await prisma.order.aggregate({
    _sum: {
      total: true
    },
    where: {
      status: {
        in: [OrderStatus.CONFIRMED, OrderStatus.PREPARING, OrderStatus.READY, OrderStatus.DELIVERED]
      }
    }
  })

  return {
    totalOrders,
    pendingOrders,
    completedOrders,
    totalRevenue: totalRevenue._sum.total
  }
}

/**
 * Get popular products (based on order count)
 */
export async function getPopularProducts(limit = 5) {
  return await prisma.product.findMany({
    where: { isAvailable: true },
    include: {
      orderItems: {
        select: {
          quantity: true
        }
      }
    },
    take: limit
  })
}

/**
 * Transaction example: Create order and payment intent atomically
 */
export async function createOrderWithPayment(userId?: string) {
  const orderNumber = `#${Math.floor(100000 + Math.random() * 900000)}`

  return await prisma.$transaction(async (tx) => {
    // Create order
    const order = await tx.order.create({
      data: {
        orderNumber,
        subtotal: 10.50,
        total: 10.50,
        status: OrderStatus.PENDING,
        paymentMethod: PaymentMethodType.CREDIT_CARD,
        userId,
        items: {
          create: [
            {
              productId: 'product-id',
              productName: 'Soy Milk',
              quantity: 2,
              price: 2.00,
              subtotal: 4.00
            }
          ]
        }
      }
    })

    // Create payment intent
    const paymentIntent = await tx.paymentIntent.create({
      data: {
        orderId: order.id,
        amount: order.total,
        currency: 'USD',
        paymentMethod: PaymentMethodType.CREDIT_CARD,
        status: 'PENDING'
      }
    })

    return { order, paymentIntent }
  })
}
