'use client';

import Link from 'next/link';
import { ShoppingCart, Clock } from 'lucide-react';
import { useCart } from '@/lib/cart-context';

export function CartButton() {
  const { items, total } = useCart();

  return (
    <div className="flex items-center gap-3">
      {/* Order History Button */}
      <Link href="/order-history">
        <div className="flex items-center justify-center w-10 h-10 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer">
          <Clock className="w-5 h-5 text-slate-700" />
        </div>
      </Link>

      {/* Cart Button */}
      <Link href="/order">
        <div className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 rounded-lg px-4 py-2 transition-colors cursor-pointer">
          <ShoppingCart className="w-5 h-5 text-slate-700" />
          <span className="font-semibold text-slate-900">
            ${total.toFixed(2)}
          </span>
          {items.length > 0 && (
            <span className="ml-2 px-2 py-1 bg-red-500 text-white text-xs rounded-full font-bold">
              {items.length}
            </span>
          )}
        </div>
      </Link>
    </div>
  );
}
