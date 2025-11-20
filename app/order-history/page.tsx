'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface OrderItem {
  id: string;
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;
}

interface Order {
  id: string;
  orderNumber: string;
  total: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
}

export default function OrderHistoryPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/orders/history');
        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleReorder = (orderId: string) => {
    // TODO: 實現重新訂購功能
    alert('重新訂購功能即將上線');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const toggleExpand = (orderId: string) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-slate-900" />
          </button>
          <h1 className="text-2xl font-bold text-slate-900">Order History</h1>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-md mx-auto px-4 py-6">
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-slate-600">載入中...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center">
            <p className="text-slate-600 text-lg">還沒有訂單</p>
            <Button
              onClick={() => router.push('/')}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
            >
              開始購物
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-md">
                {/* Order Header */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-slate-600">
                      {formatDate(order.createdAt)}
                    </p>
                    <Button
                      onClick={() => handleReorder(order.id)}
                      className="bg-orange-500 hover:bg-orange-600 text-white text-sm px-4 py-1"
                    >
                      Reorder
                    </Button>
                  </div>

                  <p className="text-lg font-bold text-slate-900">
                    ${parseFloat(order.total.toString()).toFixed(2)}
                  </p>

                  {/* Expand Button */}
                  <button
                    onClick={() => toggleExpand(order.id)}
                    className="mt-3 w-full flex items-center justify-between p-2 hover:bg-slate-50 rounded transition-colors"
                  >
                    <span className="text-sm text-slate-600">
                      {order.items.length} item{order.items.length > 1 ? 's' : ''}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-400 transition-transform ${
                        expandedOrderId === order.id ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                </div>

                {/* Order Items (Expandable) */}
                {expandedOrderId === order.id && (
                  <div className="border-t bg-slate-50 p-4 space-y-2">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between text-sm text-slate-600"
                      >
                        <span>
                          {item.productName} × {item.quantity}
                        </span>
                        <span>${parseFloat(item.subtotal.toString()).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
