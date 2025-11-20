'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/cart-context';
import { Button } from '@/components/ui/button';
import { ChevronDown, ArrowLeft } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, clearCart } = useCart();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('credit-card');
  const [billingAddressCheckbox, setBillingAddressCheckbox] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">購物車是空的</h1>
          <Button onClick={() => router.push('/')}>繼續購物</Button>
        </div>
      </div>
    );
  }

  const handleContinue = async () => {
    setIsProcessing(true);
    try {
      // 建立訂單
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.id,
            productName: item.nameZh || item.name,
            quantity: item.quantity,
            price: item.price,
            notes: item.notes || '',
          })),
          subtotal: total,
          total: total,
          paymentMethod: selectedPaymentMethod === 'credit-card' ? 'CREDIT_CARD' : selectedPaymentMethod === 'apple-pay' ? 'APPLE_PAY' : 'CASH',
          billingAddressSameAsShipping: billingAddressCheckbox,
        }),
      });

      if (!response.ok) {
        throw new Error('Order creation failed');
      }

      const order = await response.json();
      
      // 清空購物車
      clearCart();
      
      // 導航到支付確認頁面
      router.push(`/payment-confirmation/${order.id}`);
    } catch (error) {
      console.error('Checkout error:', error);
      alert('結帳失敗，請重試');
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
        {/* 標題和返回鈕 */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 transition"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span>返回</span>
          </button>
          <h1 className="text-2xl font-bold">支付方式</h1>
          <div className="w-20" /> {/* Spacer for alignment */}
        </div>

        {/* 訂單摘要 */}
        <div className="mb-8 pb-8 border-b">
          <h2 className="text-lg font-semibold mb-4">訂單摘要</h2>
          <div className="space-y-3 mb-4">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <div>
                  <div className="font-medium">{item.nameZh || item.name}</div>
                  <div className="text-gray-600">x{item.quantity}</div>
                  {item.notes && <div className="text-gray-500 text-xs">備註: {item.notes}</div>}
                </div>
                <div className="font-medium">NT${((item.price || 0) * (item.quantity || 1)).toLocaleString()}</div>
              </div>
            ))}
          </div>
          <div className="flex justify-between text-lg font-bold">
            <span>總計</span>
            <span>NT${total.toLocaleString()}</span>
          </div>
        </div>

        {/* 支付方式選擇 */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">選擇支付方式</h2>

          {/* 信用卡選項 */}
          <div
            onClick={() => setSelectedPaymentMethod('credit-card')}
            className={`mb-4 p-4 border rounded-lg cursor-pointer transition ${
              selectedPaymentMethod === 'credit-card'
                ? 'border-orange-500 bg-orange-50'
                : 'border-gray-200 bg-gray-50 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div
                  className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                    selectedPaymentMethod === 'credit-card'
                      ? 'border-orange-500 bg-orange-500'
                      : 'border-gray-300'
                  }`}
                >
                  {selectedPaymentMethod === 'credit-card' && (
                    <div className="w-2 h-2 bg-white rounded-full" />
                  )}
                </div>
                <span className="font-semibold">信用卡</span>
              </div>
              {selectedPaymentMethod === 'credit-card' && <ChevronDown className="w-5 h-5 text-orange-500" />}
            </div>

            {selectedPaymentMethod === 'credit-card' && (
              <div className="space-y-3 ml-8">
                {/* 已保存的卡片 */}
                <div className="space-y-2">
                  <label className="flex items-center cursor-pointer">
                    <input type="radio" name="card" defaultChecked className="w-4 h-4" />
                    <span className="ml-2 text-sm">
                      <div className="font-medium">Mastercard ••••••••1234</div>
                      <div className="text-gray-600">有效期至 12/25</div>
                    </span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input type="radio" name="card" className="w-4 h-4" />
                    <span className="ml-2 text-sm">
                      <div className="font-medium">Visa ••••••••5678</div>
                      <div className="text-gray-600">有效期至 08/26</div>
                    </span>
                  </label>
                </div>

                {/* 新增卡片選項 */}
                <button className="text-orange-600 hover:text-orange-700 font-medium text-sm mt-3">
                  + 新增卡片
                </button>
              </div>
            )}
          </div>

          {/* Apple Pay 選項 */}
          <div
            onClick={() => setSelectedPaymentMethod('apple-pay')}
            className={`mb-4 p-4 border rounded-lg cursor-pointer transition ${
              selectedPaymentMethod === 'apple-pay'
                ? 'border-orange-500 bg-orange-50'
                : 'border-gray-200 bg-gray-50 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center">
              <div
                className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                  selectedPaymentMethod === 'apple-pay'
                    ? 'border-orange-500 bg-orange-500'
                    : 'border-gray-300'
                }`}
              >
                {selectedPaymentMethod === 'apple-pay' && (
                  <div className="w-2 h-2 bg-white rounded-full" />
                )}
              </div>
              <span className="font-semibold">Apple Pay</span>
            </div>
          </div>

          {/* 現金選項 */}
          <div
            onClick={() => setSelectedPaymentMethod('cash')}
            className={`p-4 border rounded-lg cursor-pointer transition ${
              selectedPaymentMethod === 'cash'
                ? 'border-orange-500 bg-orange-50'
                : 'border-gray-200 bg-gray-50 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center">
              <div
                className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                  selectedPaymentMethod === 'cash'
                    ? 'border-orange-500 bg-orange-500'
                    : 'border-gray-300'
                }`}
              >
                {selectedPaymentMethod === 'cash' && (
                  <div className="w-2 h-2 bg-white rounded-full" />
                )}
              </div>
              <span className="font-semibold">現金</span>
            </div>
          </div>
        </div>

        {/* 地址勾選框 */}
        <div className="mb-8 pb-8 border-b">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={billingAddressCheckbox}
              onChange={(e) => setBillingAddressCheckbox(e.target.checked)}
              className="w-4 h-4 rounded"
            />
            <span className="ml-2 text-gray-700">我的帳單地址和運送地址相同</span>
          </label>
        </div>

        {/* 繼續按鈕 */}
        <Button
          onClick={handleContinue}
          disabled={isProcessing}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg text-lg"
        >
          {isProcessing ? '處理中...' : '繼續'}
        </Button>
      </div>
    </div>
  );
}
