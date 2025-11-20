'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

export default function PaymentConfirmationPage({ params }: { params: { id: string } }) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12 px-4">
      <div className="max-w-md mx-auto text-center">
        {/* 成功圖示 */}
        <div className="mb-6">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto" />
        </div>

        {/* 標題和信息 */}
        <h1 className="text-3xl font-bold text-gray-900 mb-2">支付成功！</h1>
        <p className="text-gray-600 mb-6">您的訂單已成功提交</p>

        {/* 訂單編號 */}
        <div className="bg-gray-100 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-600 mb-1">訂單編號</p>
          <p className="text-2xl font-mono font-bold text-gray-900">{params.id}</p>
        </div>

        {/* 提示文本 */}
        <p className="text-sm text-gray-600 mb-8">
          我們已向您的電子郵箱發送訂單確認。您可以隨時查看訂單詳情和配送狀態。
        </p>

        {/* 按鈕 */}
        <div className="space-y-3">
          <Button
            onClick={() => router.push('/order-history')}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg"
          >
            查看訂單
          </Button>
          <Button
            onClick={() => router.push('/')}
            variant="outline"
            className="w-full py-3 rounded-lg"
          >
            繼續購物
          </Button>
        </div>
      </div>
    </div>
  );
}
