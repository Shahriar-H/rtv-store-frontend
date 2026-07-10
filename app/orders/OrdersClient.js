'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Package, ChevronRight, Clock, CheckCircle, Truck, XCircle, ShoppingBag, RefreshCw } from 'lucide-react';
import { useAuth } from '../../lib/CartContext';
import { api } from '../../lib/api';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const STATUS_CONFIG = {
  payment_pending: { label: 'Payment Pending', color: 'bg-amber-100 text-amber-700', icon: Clock },
  confirmed:       { label: 'Confirmed',        color: 'bg-blue-100 text-blue-700',   icon: CheckCircle },
  processing:      { label: 'Processing',       color: 'bg-purple-100 text-purple-700', icon: RefreshCw },
  shipped:         { label: 'Shipped',          color: 'bg-indigo-100 text-indigo-700', icon: Truck },
  out_for_delivery:{ label: 'Out for Delivery', color: 'bg-orange-100 text-orange-700', icon: Truck },
  delivered:       { label: 'Delivered',        color: 'bg-green-100 text-green-700', icon: CheckCircle },
  cancelled:       { label: 'Cancelled',        color: 'bg-red-100 text-red-700',     icon: XCircle },
};

export default function OrdersClient() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && !user) router.push('/account/login?redirect=/orders');
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;
    api.getOrders()
      .then((data) => setOrders(data?.data || []))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [user]);

  if (authLoading || !user) return null;

  return (
    <main>
      <Navbar />
      <div className="container py-8 min-h-[70vh]">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-dark">My Orders</h1>
            <p className="text-gray-500 text-sm mt-1">Track and manage your purchases</p>
          </div>
          <Link href="/shop" className="btn-primary text-sm py-2 px-4">Continue Shopping</Link>
        </div>

        {loading && (
          <div className="space-y-4">
            {[1,2,3].map(i => <div key={i} className="h-32 bg-gray-100 rounded-xl animate-pulse" />)}
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">{error}</div>
        )}

        {!loading && orders.length === 0 && (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag size={40} className="text-gray-300" />
            </div>
            <h2 className="text-xl font-bold text-dark mb-2">No orders yet</h2>
            <p className="text-gray-400 text-sm mb-6">Looks like you haven&apos;t placed any orders yet.</p>
            <Link href="/shop" className="btn-primary px-8">Start Shopping</Link>
          </div>
        )}

        <div className="space-y-4">
          {orders.map(order => {
            const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.confirmed;
            const StatusIcon = cfg.icon;
            return (
              <div key={order.id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
                {/* Order header */}
                <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-b border-gray-100 bg-gray-50">
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-xs text-gray-400">Order</p>
                      <p className="font-bold text-dark">#{order.orderNumber}</p>
                    </div>
                    <div className="hidden sm:block">
                      <p className="text-xs text-gray-400">Placed</p>
                      <p className="font-medium text-sm">{new Date(order.createdAt).toLocaleDateString('en-BD', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Total</p>
                      <p className="font-bold text-primary">৳{order.total?.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Payment</p>
                      <p className="font-medium text-sm capitalize">{order.paymentMethod === 'bkash' ? '📱 bKash' : '💵 COD'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${cfg.color}`}>
                      <StatusIcon size={12} />
                      {cfg.label}
                    </span>
                    <Link href={`/orders/${order.id}`} className="flex items-center gap-1 text-primary text-sm font-medium hover:underline">
                      Details <ChevronRight size={14} />
                    </Link>
                  </div>
                </div>

                {/* Order items preview */}
                <div className="px-6 py-4">
                  <div className="flex items-center gap-3 flex-wrap">
                    {order.items?.slice(0, 4).map((item, i) => (
                      <div key={i} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                        <div className="relative w-10 h-10 flex-shrink-0">
                          <Image src={item.image} alt={item.name} fill className="object-contain" />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-dark line-clamp-1 max-w-[120px]">{item.name}</p>
                          <p className="text-xs text-gray-400">Qty: {item.quantity} × ৳{item.price}</p>
                        </div>
                      </div>
                    ))}
                    {order.items?.length > 4 && (
                      <span className="text-sm text-gray-400">+{order.items.length - 4} more</span>
                    )}
                  </div>
                </div>

                {/* Estimated delivery */}
                {order.status !== 'delivered' && order.status !== 'cancelled' && order.estimatedDelivery && (
                  <div className="px-6 pb-4">
                    <p className="text-xs text-gray-400">
                      Estimated Delivery: <span className="font-semibold text-dark">
                        {new Date(order.estimatedDelivery).toLocaleDateString('en-BD', { weekday: 'long', day: 'numeric', month: 'long' })}
                      </span>
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <Footer />
    </main>
  );
}
