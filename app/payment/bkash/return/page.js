'use client';
import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle, XCircle, AlertCircle, ArrowLeft, Phone, Mail, Smartphone, Package, Truck } from 'lucide-react';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import { api } from '../../../lib/api';

function statusFromParams(raw) {
  if (!raw) return null;
  const s = String(raw).toLowerCase();
  if (s === 'success' || s === 'completed' || s === 's') return 'success';
  if (s === 'cancel' || s === 'canceled' || s === 'cancelled') return 'cancel';
  if (s === 'failure' || s === 'failed' || s === 'fail' || s === 'error') return 'failure';
  return null;
}

function PageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const status = statusFromParams(searchParams.get('status'));
  const orderId =
    searchParams.get('orderId') ||
    (typeof window !== 'undefined' ? localStorage.getItem('lastBkashOrderId') : null);

  useEffect(() => {
    let mounted = true;
    if (!orderId) {
      setLoading(false);
      setError('Missing order id');
      return;
    }
    api.getOrder(orderId)
      .then((data) => {
        if (!mounted) return;
        setOrder(data?.data || data);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err.message || 'Could not load order');
      })
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, [orderId]);

  useEffect(() => {
    if (orderId && typeof window !== 'undefined') {
      localStorage.removeItem('lastBkashOrderId');
    }
  }, [orderId]);

  return (
    <main>
      <Navbar />
      <div className="container py-10 min-h-[70vh]">
        {!status && (
          <div className="max-w-xl mx-auto bg-white border rounded-2xl p-8 text-center">
            <XCircle size={48} className="text-accent mx-auto mb-3" />
            <h2 className="text-2xl font-bold text-dark mb-2">Unknown payment status</h2>
            <p className="text-gray-500 mb-6">We could not determine the outcome of your payment.</p>
            <Link href="/shop" className="btn-primary px-6">Continue Shopping</Link>
          </div>
        )}

        {status === 'success' && (
          <SuccessCard order={order} loading={loading} error={error} />
        )}

        {(status === 'cancel' || status === 'failure') && (
          <FailureCard status={status} order={order} loading={loading} error={error} />
        )}
      </div>
      <Footer />
    </main>
  );
}

function SuccessCard({ order, loading, error }) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white border border-gray-100 rounded-2xl p-8 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={40} className="text-green-500" />
        </div>
        <h2 className="text-2xl font-bold text-dark mb-2">Payment Successful</h2>
        <p className="text-gray-500 mb-1">Thank you for your order!</p>
        {order && (
          <p className="text-primary font-bold text-lg mb-6">Order #{order.orderNumber}</p>
        )}

        {loading && <p className="text-gray-400 text-sm">Loading order details…</p>}
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        {order && (
          <div className="bg-gray-50 rounded-xl p-5 text-left mb-6">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-400">Payment</span>
                <p className="font-semibold flex items-center gap-1">
                  <Smartphone size={14} className="text-pink-600" /> bKash
                </p>
              </div>
              <div>
                <span className="text-gray-400">Total</span>
                <p className="font-semibold text-primary">৳{order.total?.toFixed(2)}</p>
              </div>
              {order.bkashTrxID && (
                <div className="col-span-2">
                  <span className="text-gray-400">bKash TrxID</span>
                  <p className="font-mono text-xs bg-white border px-2 py-1 rounded inline-block">
                    {order.bkashTrxID}
                  </p>
                </div>
              )}
              {order.estimatedDelivery && (
                <div className="col-span-2">
                  <span className="text-gray-400 flex items-center gap-1"><Truck size={13} /> Estimated Delivery</span>
                  <p className="font-semibold">
                    {new Date(order.estimatedDelivery).toLocaleDateString('en-BD', { weekday: 'long', day: 'numeric', month: 'short' })}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-3 justify-center">
          {order && (
            <Link href={`/orders/${order._id || order.id}`} className="btn-primary px-6 py-2.5">
              <Package size={16} className="inline mr-1.5" /> Track Order
            </Link>
          )}
          <Link href="/shop" className="btn-outline px-6 py-2.5">Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
}

function FailureCard({ status, order, loading, error }) {
  const title = status === 'cancel' ? 'Payment Cancelled' : 'Payment Failed';
  const desc =
    status === 'cancel'
      ? 'You cancelled the bKash payment. Your cart is preserved and no order was completed.'
      : 'bKash could not complete the payment. Please try again or use Cash on Delivery.';
  const tone = status === 'cancel' ? 'amber' : 'red';

  return (
    <div className="max-w-2xl mx-auto">
      <div className={`bg-white border rounded-2xl p-8 text-center border-${tone}-200`}>
        <div className={`w-20 h-20 bg-${tone}-100 rounded-full flex items-center justify-center mx-auto mb-4`}>
          <XCircle size={40} className={`text-${tone}-500`} />
        </div>
        <h2 className="text-2xl font-bold text-dark mb-2">{title}</h2>
        <p className="text-gray-500 mb-4">{desc}</p>

        {order && order._id && (
          <p className="text-gray-400 text-sm mb-6">
            Reference: Order #{order.orderNumber || order._id}
          </p>
        )}

        {loading && <p className="text-gray-400 text-sm">Loading order details…</p>}
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <div className="flex flex-wrap gap-3 justify-center">
          <Link href="/cart" className="btn-primary px-6 py-2.5 flex items-center gap-1.5">
            <ArrowLeft size={15} /> Back to Cart
          </Link>
          <Link href="/checkout" className="btn-outline px-6 py-2.5">Try Again</Link>
        </div>
      </div>
    </div>
  );
}

export default function BkashReturnPage() {
  return (
    <Suspense fallback={<main><Navbar /><div className="container py-20 text-center text-gray-400">Loading...</div><Footer /></main>}>
      <PageInner />
    </Suspense>
  );
}
