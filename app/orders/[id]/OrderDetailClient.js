'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ChevronRight, Package, MapPin, CreditCard, Clock, CheckCircle,
  Truck, XCircle, RefreshCw, ArrowLeft, Phone, Mail, Smartphone
} from 'lucide-react';
import { useAuth } from '../../../lib/CartContext';
import { api } from '../../../lib/api';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';

const ALL_STEPS = [
  { key: 'payment_pending', label: 'Order Placed',      icon: Clock,         desc: 'Your order has been received' },
  { key: 'confirmed',       label: 'Confirmed',          icon: CheckCircle,   desc: 'Order confirmed & verified' },
  { key: 'processing',      label: 'Processing',         icon: RefreshCw,     desc: 'Your items are being packed' },
  { key: 'shipped',         label: 'Shipped',            icon: Package,       desc: 'On the way to delivery hub' },
  { key: 'out_for_delivery',label: 'Out for Delivery',   icon: Truck,         desc: 'Delivery agent is on the way' },
  { key: 'delivered',       label: 'Delivered',          icon: CheckCircle,   desc: 'Package delivered successfully' },
];

const STATUS_ORDER = ['payment_pending','confirmed','processing','shipped','out_for_delivery','delivered'];

const STATUS_CONFIG = {
  payment_pending: { label: 'Payment Pending', color: 'bg-amber-100 text-amber-700', dot: 'bg-amber-400' },
  confirmed:       { label: 'Confirmed',        color: 'bg-blue-100 text-blue-700',   dot: 'bg-blue-500' },
  processing:      { label: 'Processing',       color: 'bg-purple-100 text-purple-700', dot: 'bg-purple-500' },
  shipped:         { label: 'Shipped',          color: 'bg-indigo-100 text-indigo-700', dot: 'bg-indigo-500' },
  out_for_delivery:{ label: 'Out for Delivery', color: 'bg-orange-100 text-orange-700', dot: 'bg-orange-500' },
  delivered:       { label: 'Delivered',        color: 'bg-green-100 text-green-700', dot: 'bg-green-500' },
  cancelled:       { label: 'Cancelled',        color: 'bg-red-100 text-red-700',     dot: 'bg-red-500' },
};

export default function OrderDetailClient({ orderId }) {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && !user) router.push('/account/login');
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;
    api.getOrder(orderId)
      .then((data) => setOrder(data?.data))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [user, orderId]);

  if (authLoading || !user) return null;

  if (loading) return (
    <main><Navbar />
      <div className="container py-12">
        <div className="space-y-4 max-w-3xl mx-auto">
          {[1,2,3].map(i => <div key={i} className="h-40 bg-gray-100 rounded-xl animate-pulse" />)}
        </div>
      </div>
      <Footer />
    </main>
  );

  if (error || !order) return (
    <main><Navbar />
      <div className="container py-12 text-center">
        <XCircle size={48} className="text-accent mx-auto mb-3" />
        <h2 className="text-xl font-bold text-dark mb-2">Order Not Found</h2>
        <p className="text-gray-400 text-sm mb-4">{error}</p>
        <Link href="/orders" className="btn-primary px-6">Back to Orders</Link>
      </div>
      <Footer />
    </main>
  );

  const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.confirmed;
  const currentStepIdx = STATUS_ORDER.indexOf(order.status);
  const isCancelled = order.status === 'cancelled';

  return (
    <main>
      <Navbar />
      <div className="container py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
          <Link href="/" className="hover:text-primary">Home</Link>
          <ChevronRight size={14} />
          <Link href="/orders" className="hover:text-primary">My Orders</Link>
          <ChevronRight size={14} />
          <span className="text-dark font-medium">#{order.orderNumber}</span>
        </nav>

        <Link href="/orders" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary mb-6 transition-colors">
          <ArrowLeft size={15} /> Back to Orders
        </Link>

        {/* Order header */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-dark">Order #{order.orderNumber}</h1>
              <p className="text-gray-400 text-sm mt-0.5">
                Placed on {new Date(order.createdAt).toLocaleDateString('en-BD', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold ${cfg.color}`}>
              <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
              {cfg.label}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">

            {/* Tracking timeline */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6">
              <h2 className="font-bold text-dark mb-6 flex items-center gap-2">
                <Truck size={18} className="text-primary" /> Order Tracking
              </h2>

              {isCancelled ? (
                <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
                  <XCircle size={24} className="text-red-500 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-red-700">Order Cancelled</p>
                    <p className="text-red-500 text-sm">
                      {order.statusHistory?.find(h => h.status === 'cancelled')?.note || 'This order has been cancelled.'}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  {ALL_STEPS.map((step, idx) => {
                    const isCompleted = currentStepIdx >= idx;
                    const isCurrent = currentStepIdx === idx;
                    const historyEntry = order.statusHistory?.find(h => h.status === step.key);
                    const StepIcon = step.icon;

                    return (
                      <div key={step.key} className="flex gap-4 relative">
                        {/* Line */}
                        {idx < ALL_STEPS.length - 1 && (
                          <div className={`absolute left-5 top-10 w-0.5 h-full -ml-px transition-colors duration-500 ${isCompleted && currentStepIdx > idx ? 'bg-primary' : 'bg-gray-200'}`} style={{ height: 'calc(100% - 0px)' }} />
                        )}

                        {/* Icon */}
                        <div className={`relative z-10 w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center transition-all duration-500 ${isCompleted ? 'bg-primary text-white shadow-md shadow-primary/30' : 'bg-gray-100 text-gray-400'} ${isCurrent ? 'ring-4 ring-primary/20 scale-110' : ''}`}>
                          <StepIcon size={16} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 pb-8">
                          <div className="flex items-center justify-between">
                            <p className={`font-semibold text-sm ${isCompleted ? 'text-dark' : 'text-gray-400'}`}>{step.label}</p>
                            {historyEntry && (
                              <p className="text-xs text-gray-400">{new Date(historyEntry.timestamp).toLocaleString('en-BD', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                            )}
                          </div>
                          <p className={`text-xs mt-0.5 ${isCompleted ? 'text-gray-500' : 'text-gray-300'}`}>
                            {historyEntry?.note || step.desc}
                          </p>
                          {isCurrent && (
                            <span className="inline-block mt-1.5 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">Current Status</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Estimated delivery */}
              {!isCancelled && order.status !== 'delivered' && order.estimatedDelivery && (
                <div className="mt-4 bg-blue-50 border border-blue-100 rounded-xl p-4">
                  <p className="text-sm text-blue-700">
                    <span className="font-semibold">Estimated Delivery: </span>
                    {new Date(order.estimatedDelivery).toLocaleDateString('en-BD', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
              )}
            </div>

            {/* Order items */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6">
              <h2 className="font-bold text-dark mb-5 flex items-center gap-2">
                <Package size={18} className="text-primary" /> Order Items ({order.items?.length})
              </h2>
              <div className="space-y-4">
                {order.items?.map((item, i) => (
                  <div key={i} className="flex items-center gap-4 pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                    <div className="relative w-16 h-16 flex-shrink-0 bg-gray-50 rounded-xl overflow-hidden">
                      <Image src={item.image} alt={item.name} fill className="object-contain p-2" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link href={`/product/${item.productId}`} className="font-semibold text-dark text-sm hover:text-primary transition-colors line-clamp-2">
                        {item.name}
                      </Link>
                      <p className="text-xs text-gray-400 mt-0.5">Qty: {item.quantity} × ৳{item.price?.toFixed(2)}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-bold text-dark">৳{item.subtotal?.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-5">
            {/* Price summary */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5">
              <h3 className="font-bold text-dark mb-4">Price Summary</h3>
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal ({order.items?.reduce((s, i) => s + i.quantity, 0)} items)</span>
                  <span>৳{order.subtotal?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Shipping</span>
                  <span>{order.shippingFee === 0 ? <span className="text-green-600 font-medium">Free</span> : '৳' + order.shippingFee?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-dark text-base border-t pt-2.5 mt-2">
                  <span>Total</span>
                  <span className="text-primary">৳{order.total?.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Payment info */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5">
              <h3 className="font-bold text-dark mb-4 flex items-center gap-2">
                <CreditCard size={16} className="text-primary" /> Payment
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  {order.paymentMethod === 'bkash' ? <Smartphone size={16} className="text-pink-600" /> : <CreditCard size={16} className="text-primary" />}
                  <span className="font-semibold capitalize">{order.paymentMethod === 'bkash' ? 'bKash' : 'Cash on Delivery'}</span>
                </div>
                {order.paymentMethod === 'bkash' && order.bkashTrxID && (
                  <div>
                    <span className="text-gray-400">bKash TrxID</span>
                    <p className="font-mono text-xs bg-gray-50 px-2 py-1 rounded inline-block">{order.bkashTrxID}</p>
                  </div>
                )}
                <div className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium ${order.status === 'payment_pending' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                  {order.status === 'payment_pending' ? '⏳ Pending' : '✓ Paid'}
                </div>
              </div>
            </div>

            {/* Shipping address */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5">
              <h3 className="font-bold text-dark mb-4 flex items-center gap-2">
                <MapPin size={16} className="text-primary" /> Delivery Address
              </h3>
              <div className="text-sm space-y-1.5 text-gray-600">
                <p className="font-semibold text-dark">{order.user?.name}</p>
                <p className='italic'>{order.shippingAddress?.street},{order.shippingAddress?.city}</p>
                <p className='italic'>{order.shippingAddress?.state}, {order.shippingAddress?.country}</p>
                <div className="flex items-center gap-1.5 pt-1">
                  <Phone size={13} className="text-gray-400" />
                  <span>{order.user?.phone}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Mail size={13} className="text-gray-400" />
                  <span>{order.user?.email}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <Link href="/orders" className="btn-outline w-full text-center block text-sm py-2.5">
                ← All Orders
              </Link>
              <Link href="/shop" className="btn-primary w-full text-center block text-sm py-2.5">
                Shop More
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
