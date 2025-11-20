import { prisma } from '@/lib/db/prisma';
import { ProductCard } from '@/components/product-card';
import { CartButton } from '@/components/cart-button';

export default async function Home() {
  const products = await prisma.product.findMany({
    where: {
      isAvailable: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  // 轉換 Decimal 為字符串以避免向客戶端傳遞非序列化物件
  // @ts-ignore
  const serializedProducts = products.map((product) => ({
    ...product,
    price: product.price.toString(),
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">飲料點單系統</h1>
            <p className="text-sm text-slate-600">台灣在地飲品 · 新鮮製作</p>
          </div>
          <CartButton />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-600 text-lg">目前沒有可用的商品</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* @ts-ignore */}
            {serializedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
