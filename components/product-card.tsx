'use client';

import { useState } from 'react';
import { ShoppingCart, Plus, Minus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/lib/cart-context';

interface ProductCardProps {
  product: any;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const [showModal, setShowModal] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');

  const handleAddToCart = () => {
    setShowModal(true);
  };

  const handleConfirmAddToCart = () => {
    addItem({ ...product, quantity, notes });
    setShowModal(false);
    setQuantity(1);
    setNotes('');
  };

  const handleIncrement = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
        {/* Image */}
        <div className="relative h-48 bg-slate-200 overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Content */}
        <div className="p-4">
          <h2 className="text-lg font-bold text-slate-900">{product.nameZh || product.name}</h2>
          <p className="text-sm text-slate-600 mt-1 line-clamp-2">
            {product.description}
          </p>

          {/* Price */}
          <div className="mt-4 flex items-center justify-between">
            <span className="text-2xl font-bold text-slate-900">
              ${product.price}
            </span>
          </div>

          {/* Add to Cart Button */}
          <Button
            onClick={handleAddToCart}
            className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            加入購物車
          </Button>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 max-h-[80vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-900">
                {product.nameZh || product.name}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            {/* Price */}
            <div className="mb-4">
              <p className="text-sm text-slate-600 mb-1">價格</p>
              <p className="text-2xl font-bold text-slate-900">
                ${product.price}
              </p>
            </div>

            {/* Quantity Selector */}
            <div className="mb-4">
              <p className="text-sm font-medium text-slate-700 mb-2">數量</p>
              <div className="flex items-center gap-3 bg-slate-100 w-fit rounded-lg p-2">
                <button
                  onClick={handleDecrement}
                  className="p-1 hover:bg-slate-200 rounded transition-colors"
                  disabled={quantity === 1}
                >
                  <Minus className="w-5 h-5 text-slate-600" />
                </button>
                <span className="w-8 text-center font-semibold text-slate-900">
                  {quantity}
                </span>
                <button
                  onClick={handleIncrement}
                  className="p-1 hover:bg-slate-200 rounded transition-colors"
                >
                  <Plus className="w-5 h-5 text-slate-600" />
                </button>
              </div>
            </div>

            {/* Notes */}
            <div className="mb-6">
              <p className="text-sm font-medium text-slate-700 mb-2">備註 (選填)</p>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="例如：少冰、少糖..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none text-sm"
                rows={3}
              />
            </div>

            {/* Total */}
            <div className="border-t border-slate-200 pt-4 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-700 font-medium">小計</span>
                <span className="text-xl font-bold text-slate-900">
                  ${(product.price * quantity).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                onClick={() => setShowModal(false)}
                variant="outline"
                className="flex-1"
              >
                取消
              </Button>
              <Button
                onClick={handleConfirmAddToCart}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                確認加入購物車
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
