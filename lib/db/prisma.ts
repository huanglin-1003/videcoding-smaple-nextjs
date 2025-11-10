/**
 * Prisma Client Instance
 *
 * This file creates a singleton Prisma Client instance to prevent
 * creating multiple connections in development (hot reload).
 *
 * Usage:
 * ```ts
 * import { prisma } from '@/lib/db/prisma'
 *
 * const products = await prisma.product.findMany()
 * ```
 */

import { PrismaClient } from '@prisma/client'

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
//
// Learn more:
// https://pris.ly/d/help/next-js-best-practices

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma
