'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronRight, CreditCard, Truck, CheckCircle, AlertCircle, Phone, MapPin, User, Mail, Smartphone, Info } from 'lucide-react';
import { useCart } from '../../lib/CartContext';
import { useAuth } from '../../lib/CartContext';
import { api, ApiError } from '../../lib/api';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const FALLBACK_STATUSES = new Set([0, 502, 503]);

function isFallbackEligible(err) {
  if (!err) return false;
  if (err instanceof ApiError && FALLBACK_STATUSES.has(err.status)) return true;
  if (FALLBACK_STATUSES.has(err.status)) return true;
  const code = String(err.code || '').toUpperCase();
  return (
    code === 'NETWORK_ERROR' ||
    code === 'ENOTFOUND' ||
    code === 'ECONNREFUSED' ||
    code === 'ECONNRESET' ||
    code === 'ETIMEDOUT' ||
    code === 'BKASH_NOT_CONFIGURED'
  );
}

export default function CheckoutClient() {
  const { cart, cartSubtotal, cartTotal, shippingFee, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [bkashAvailable, setBkashAvailable] = useState(true);
  const [bkashReason, setBkashReason] = useState('');
  const healthCheckedRef = useRef(false);

  const [shipping, setShipping] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    street: '',
    city: '',
    state: 'Dhaka',
    zipCode: '',
    country: 'Bangladesh',
  });

  const [payment, setPayment] = useState({
    method: 'cod',
  });

  useEffect(() => {
    if (!user) router.push('/account/login?redirect=/checkout');
  }, [user, router]);

  useEffect(() => {
    if (cart.length === 0) router.push('/');
  }, [cart, router]);

  useEffect(() => {
    if (healthCheckedRef.current) return;
    healthCheckedRef.current = true;
    api.bkashHealth()
      .then((res) => {
        const data = res?.data || res;
        if (data?.configured === false) {
          setBkashAvailable(false);
          setBkashReason('bKash payments are not configured on the server.');
        } else {
          setBkashAvailable(true);
        }
      })
      .catch(() => {
        setBkashAvailable(true);
      });
  }, []);

  const handleShippingChange = e => setShipping(p => ({ ...p, [e.target.name]: e.target.value }));
  const handlePaymentChange = e => setPayment(p => ({ ...p, [e.target.name]: e.target.value }));

  const buildShippingPayload = () => ({
    fullName: shipping.fullName,
    email: shipping.email,
    phone: shipping.phone,
    street: shipping.street,
    city: shipping.city,
    state: shipping.state,
    zipCode: shipping.zipCode,
    country: shipping.country,
  });

  const buildItemPayload = () => cart.map(i => ({ productId: i.product.id, quantity: i.quantity }));

  const placeCodOrder = async () => {
    const newOrder = await api.createOrder({
      items: buildItemPayload(),
      shippingAddress: buildShippingPayload(),
      paymentMethod: 'cod',
    });
    const created = newOrder?.data || newOrder;
    setOrder(created);
    clearCart();

    const orderId = created?._id || created?.id;
    if (orderId) {
      router.push(`/orders/${orderId}`);
    } else {
      setStep(3);
    }
  };

  const handlePlaceOrder = async () => {
    if (!user) { router.push('/account/login'); return; }
    setLoading(true); setError('');
    setInfo('');

    if (payment.method === 'bkash' && !bkashAvailable) {
      setInfo('bKash is temporarily unavailable. Your order has been placed with Cash on Delivery instead.');
      setPayment(p => ({ ...p, method: 'cod' }));
      try {
        await placeCodOrder();
      } catch (err) {
        setError(err.message || 'Failed to place COD order');
      } finally {
        setLoading(false);
      }
      return;
    }

    try {
      if (payment.method === 'bkash') {
        try {
          const res = await api.bkashCreatePayment({
            items: buildItemPayload(),
            shippingAddress: buildShippingPayload(),
            customer: {
              name: user.name,
              email: user.email,
              phone: shipping.phone,
            },
          });

          const payload = res?.data || res;
          const bkashURL = payload?.bkashURL;
          const orderId = payload?.orderId;

          if (!bkashURL || !orderId) {
            throw new Error(res?.message || 'bKash did not return a checkout URL');
          }

          try { localStorage.setItem('lastBkashOrderId', orderId); } catch {}
          window.location.href = bkashURL;
          return;
        } catch (err) {
          if (isFallbackEligible(err)) {
            setBkashAvailable(false);
            setBkashReason(err.message || 'bKash gateway is unreachable.');
            setInfo('bKash is having trouble connecting. Your order has been placed with Cash on Delivery instead.');
            setPayment(p => ({ ...p, method: 'cod' }));
            await placeCodOrder();
            return;
          }
          throw err;
        }
      }

      await placeCodOrder();
    } catch (err) {
      setError(err.message || 'Failed to place order');
    } finally { setLoading(false); }
  };

  if (!user || cart.length === 0) return null;

  return (
    <main>
      <Navbar />
      <div className="container py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
          <Link href="/" className="hover:text-primary">Home</Link>
          <ChevronRight size={14} />
          <Link href="/cart" className="hover:text-primary">Cart</Link>
          <ChevronRight size={14} />
          <span className="text-dark font-medium">Checkout</span>
        </nav>

        {/* Step indicators */}
        <div className="flex items-center justify-center mb-10">
          {['Shipping', 'Payment', 'Complete'].map((label, i) => {
            const stepNum = i + 1;
            const isActive = step === stepNum;
            const isDone = step > stepNum;
            return (
              <div key={label} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${isDone ? 'bg-green-500 text-white' : isActive ? 'bg-primary text-white' : 'bg-gray-200 text-gray-400'}`}>
                    {isDone ? <CheckCircle size={18} /> : stepNum}
                  </div>
                  <span className={`text-xs mt-1.5 font-medium ${isActive ? 'text-primary' : isDone ? 'text-green-600' : 'text-gray-400'}`}>{label}</span>
                </div>
                {i < 2 && <div className={`w-20 md:w-32 h-0.5 mx-2 mb-5 transition-colors ${isDone ? 'bg-green-400' : 'bg-gray-200'}`} />}
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main form */}
          <div className="lg:col-span-2">

            {/* STEP 1: Shipping */}
            {step === 1 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h2 className="text-xl font-bold text-dark mb-6 flex items-center gap-2"><Truck size={20} className="text-primary" /> Shipping Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { label: 'Full Name', name: 'fullName', type: 'text', icon: User, placeholder: 'John Doe', required: true },
                    { label: 'Email', name: 'email', type: 'email', icon: Mail, placeholder: 'you@example.com', required: true },
                    { label: 'Phone Number', name: 'phone', type: 'tel', icon: Phone, placeholder: '01700000000', required: true },
                  ].map(({ label, name, type, icon: Icon, placeholder, required }) => (
                    <div key={name}>
                      <label className="text-sm font-medium text-dark mb-1.5 block">{label} {required && <span className="text-accent">*</span>}</label>
                      <div className="relative">
                        <Icon size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type={type} name={name} value={shipping[name]} onChange={handleShippingChange} placeholder={placeholder} required={required}
                          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary" />
                      </div>
                    </div>
                  ))}
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-dark mb-1.5 block">Street Address <span className="text-accent">*</span></label>
                    <div className="relative">
                      <MapPin size={15} className="absolute left-3 top-3.5 text-gray-400" />
                      <input type="text" name="street" value={shipping.street} onChange={handleShippingChange} placeholder="House #, Road #, Area" required
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-dark mb-1.5 block">State <span className="text-accent">*</span></label>
                    <input list="divisions" name="state" value={shipping.state} onChange={handleShippingChange} placeholder="Select division" required
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-dark mb-1.5 block">City <span className="text-accent">*</span></label>
                    <input type="text" name="city" value={shipping.city} onChange={handleShippingChange} placeholder="e.g. Mirpur" required
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary" />
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (!shipping.fullName || !shipping.phone || !shipping.street || !shipping.city) { setError('Please fill all required fields'); return; }
                    setError(''); setStep(2);
                  }}
                  className="btn-primary mt-6 w-full py-3 text-center">
                  Continue to Payment →
                </button>
                {error && <p className="text-accent text-sm mt-3 flex items-center gap-1"><AlertCircle size={14} /> {error}</p>}
              </div>
            )}

            {/* STEP 2: Payment */}
            {step === 2 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h2 className="text-xl font-bold text-dark mb-6 flex items-center gap-2"><CreditCard size={20} className="text-primary" /> Payment Method</h2>

                {info && (
                  <div className="mb-4 bg-blue-50 border border-blue-200 text-blue-700 text-sm px-4 py-3 rounded-lg flex items-start gap-2">
                    <Info size={16} className="flex-shrink-0 mt-0.5" />
                    <span>{info}</span>
                  </div>
                )}

                <div className="space-y-4 mb-6">
                  {/* bKash */}
                  <label
                    title={bkashAvailable ? '' : bkashReason}
                    className={`block border-2 rounded-xl p-4 transition-colors ${
                      !bkashAvailable
                        ? 'border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed'
                        : payment.method === 'bkash'
                          ? 'border-pink-500 bg-pink-50 cursor-pointer'
                          : 'border-gray-200 hover:border-gray-300 cursor-pointer'
                    }`}>
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="method"
                        value="bkash"
                        checked={payment.method === 'bkash'}
                        onChange={handlePaymentChange}
                        disabled={!bkashAvailable}
                        className="w-4 h-4 accent-pink-500 disabled:cursor-not-allowed"
                      />
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${bkashAvailable ? 'bg-pink-600' : 'bg-gray-300'}`}>
                        <Smartphone size={22} className="text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-dark">bKash</p>
                        <p className="text-xs text-gray-500">
                          {bkashAvailable ? 'You\'ll be redirected to bKash to complete payment' : bkashReason || 'Temporarily unavailable'}
                        </p>
                      </div>
                      {bkashAvailable && (
                        <span className="ml-auto bg-pink-600 text-white text-xs px-2 py-0.5 rounded font-bold">POPULAR</span>
                      )}
                    </div>
                  </label>

                  {/* COD */}
                  <label className={`block border-2 rounded-xl p-4 cursor-pointer transition-colors ${payment.method === 'cod' ? 'border-primary bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <div className="flex items-center gap-3">
                      <input type="radio" name="method" value="cod" checked={payment.method === 'cod'} onChange={handlePaymentChange} className="w-4 h-4 accent-blue-600" />
                      <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                        <Truck size={22} className="text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-dark">Cash on Delivery</p>
                        <p className="text-xs text-gray-500">Pay when your order arrives</p>
                      </div>
                    </div>
                    {payment.method === 'cod' && (
                      <div className="mt-3 bg-white rounded-lg p-3 border border-blue-200">
                        <p className="text-xs text-gray-600">Pay <strong>৳{cartTotal.toFixed(2)}</strong> in cash to our delivery agent. Available across Bangladesh.</p>
                      </div>
                    )}
                  </label>
                </div>

                {error && <p className="text-accent text-sm mb-4 flex items-center gap-1"><AlertCircle size={14} /> {error}</p>}

                <div className="flex gap-3">
                  <button onClick={() => setStep(1)} className="flex-1 btn-outline py-3 text-center">← Back</button>
                  <button onClick={handlePlaceOrder} disabled={loading}
                    className="flex-1 btn-primary py-3 text-center disabled:opacity-60">
                    {loading
                      ? payment.method === 'bkash' ? 'Connecting to bKash...' : 'Placing Order...'
                      : payment.method === 'bkash'
                        ? 'Pay with bKash →'
                        : 'Place Order →'}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Success (COD only) */}
            {step === 3 && order && (
              <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={40} className="text-green-500" />
                </div>
                <h2 className="text-2xl font-bold text-dark mb-2">Order Placed!</h2>
                <p className="text-gray-500 mb-1">Thank you for your order, {user?.name}!</p>
                <p className="text-primary font-bold text-lg mb-6">Order #{order.orderNumber}</p>

                {info && (
                  <div className="mb-4 bg-blue-50 border border-blue-200 text-blue-700 text-sm px-4 py-3 rounded-lg flex items-start gap-2 text-left">
                    <Info size={16} className="flex-shrink-0 mt-0.5" />
                    <span>{info}</span>
                  </div>
                )}

                <div className="bg-gray-50 rounded-xl p-5 text-left mb-6">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div><span className="text-gray-400">Payment</span><p className="font-semibold">Cash on Delivery</p></div>
                    <div><span className="text-gray-400">Total</span><p className="font-semibold text-primary">৳{order.total?.toFixed(2)}</p></div>
                    <div><span className="text-gray-400">Delivery to</span><p className="font-semibold">{order.shippingAddress?.city}</p></div>
                    <div><span className="text-gray-400">Est. Delivery</span><p className="font-semibold">{new Date(order.estimatedDelivery).toLocaleDateString('en-BD', { day: 'numeric', month: 'short' })}</p></div>
                  </div>
                </div>

                <div className="flex gap-3 justify-center">
                  <Link href={`/orders/${order.id || order._id}`} className="btn-primary px-6 py-2.5">Track Order</Link>
                  <Link href="/" className="btn-outline px-6 py-2.5">Continue Shopping</Link>
                </div>
              </div>
            )}
          </div>

          {/* Order summary sidebar */}
          <div>
            <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-24">
              <h3 className="font-bold text-dark mb-4">Order Summary</h3>
              <div className="space-y-3 mb-5 max-h-64 overflow-y-auto">
                {(step === 3 ? (order?.items || []).map(i => ({ product: { id: i.product, name: i.name, image: i.image, price: i.price }, quantity: i.quantity })) : cart).map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="relative w-12 h-12 flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden">
                      <Image src={item.product?.image || item.image} alt={item.product?.name || item.name} fill className="object-contain" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-dark line-clamp-1">{item.product?.name || item.name}</p>
                      <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-sm font-semibold">৳{((item.product?.price || item.price) * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-100 pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-gray-500"><span>Subtotal</span><span>৳{(step === 3 ? order?.subtotal : cartSubtotal)?.toFixed(2)}</span></div>
                <div className="flex justify-between text-gray-500">
                  <span>Shipping</span>
                  <span>{(step === 3 ? order?.shippingFee : shippingFee) === 0 ? <span className="text-green-600 font-medium">Free</span> : '৳' + (step === 3 ? order?.shippingFee : shippingFee)}</span>
                </div>
                <div className="flex justify-between font-bold text-dark text-base border-t pt-2">
                  <span>Total</span>
                  <span className="text-primary">৳{(step === 3 ? order?.total : cartTotal)?.toFixed(2)}</span>
                </div>
              </div>
              {shippingFee === 0 && step !== 3 && <p className="text-green-600 text-xs mt-2 text-center">🎉 You qualify for free shipping!</p>}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}