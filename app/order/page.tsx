'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Minus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/lib/cart-context';

export default function OrderPage() {
  const router = useRouter();
  const { items, updateQuantity, removeItem, total, clearCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = () => {
    router.push('/checkout');
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={handleBack}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-slate-900" />
          </button>
          <h1 className="text-2xl font-bold text-slate-900">Your Order</h1>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-md mx-auto px-4 py-6">
        {items.length === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center">
            <p className="text-slate-600 text-lg">購物車是空的</p>
            <Button
              onClick={() => router.push('/')}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
            >
              繼續購物
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Order Items */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md">
              <div className="p-6 space-y-6">
                {items.map((item) => (
                  <div key={item.id} className="border-b last:border-b-0 pb-6 last:pb-0">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-slate-900">
                          {item.nameZh || item.name}
                        </h3>
                        <p className="text-sm text-slate-600">x {item.quantity}</p>
                      </div>
                      <p className="text-lg font-bold text-slate-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 bg-slate-100 rounded-lg px-3 py-2">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="p-1 hover:bg-slate-200 rounded transition-colors"
                        >
                          <Minus className="w-4 h-4 text-slate-600" />
                        </button>
                        <span className="w-8 text-center text-sm font-semibold text-slate-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="p-1 hover:bg-slate-200 rounded transition-colors"
                        >
                          <Plus className="w-4 h-4 text-slate-600" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5 text-red-600" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Subtotal and Preparation Time */}
              <div className="bg-slate-50 px-6 py-4 space-y-2">
                <div className="flex justify-between text-slate-700">
                  <span>Subtotal</span>
                  <span className="font-semibold">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>Estimated Preparation Time</span>
                  <span className="font-semibold">15-20 min</span>
                </div>
              </div>
            </div>

            {/* Checkout Button */}
            <div className="flex gap-3">
              <Button
                onClick={() => router.push('/')}
                variant="outline"
                className="flex-1"
              >
                繼續購物
              </Button>
              <Button
                onClick={handleCheckout}
                disabled={isLoading}
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white disabled:opacity-50"
              >
                {isLoading ? '處理中...' : 'Checkout'}
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
