'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronRight, CreditCard, Truck, CheckCircle, AlertCircle, Phone, MapPin, User, Mail, Smartphone } from 'lucide-react';
import { useCart } from '../../lib/CartContext';
import { useAuth } from '../../lib/CartContext';
import { api } from '../../lib/api';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const STEPS = ['Cart', 'Shipping', 'Payment', 'Confirm'];

const DIVISIONS = ['Dhaka', 'Chattogram', 'Sylhet', 'Rajshahi', 'Khulna', 'Barisal', 'Rangpur', 'Mymensingh'];

export default function CheckoutClient() {
  const { cart, cartSubtotal, cartTotal, shippingFee, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(1); // 1=shipping, 2=payment, 3=confirm
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
    method: 'cod', // 'bkash' | 'cod'
    bkashNumber: '',
    bkashTransactionId: '',
  });

  const [bkashStep, setBkashStep] = useState(1); // 1=enter number, 2=confirm txn

  useEffect(() => {
    if (!user) router.push('/account/login?redirect=/checkout');
  }, [user, router]);

  useEffect(() => {
    if (cart.length === 0 && !order) router.push('/');
  }, [cart, order, router]);

  const handleShippingChange = e => setShipping(p => ({ ...p, [e.target.name]: e.target.value }));
  const handlePaymentChange = e => setPayment(p => ({ ...p, [e.target.name]: e.target.value }));

  const handlePlaceOrder = async () => {
    if (!user) { router.push('/account/login'); return; }
    setLoading(true); setError('');
    try {
      const newOrder = await api.createOrder({
        items: cart.map(i => ({ productId: i.product.id, quantity: i.quantity })),
        shippingAddress: shipping,
        user: user.id,
        paymentMethod: payment.method,
        bkashNumber: payment.bkashNumber,
      });
      console.log(newOrder);
      
      if (payment.method === 'bkash') {
        setOrder(newOrder?.data);
        setBkashStep(2);
        setStep(2.5); // bkash confirm step
      } else {
        setOrder(newOrder?.data);
        clearCart();
        setStep(3);
      }
    } catch (err) {
      setError(err.message || 'Failed to place order');
    } finally { setLoading(false); }
  };

  const handleBkashConfirm = async () => {
    if (!payment.bkashTransactionId.trim()) { setError('Please enter your bKash transaction ID'); return; }
    setLoading(true); setError('');
    try {
      const updated = await api.confirmBkash(order?.id, payment.bkashTransactionId);
      setOrder(updated);
      clearCart();
      setStep(3);
    } catch (err) {
      setError(err.message || 'Failed to confirm payment');
    } finally { setLoading(false); }
  };

  if (!user || cart.length === 0 && !order) return null;

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
            const isActive = step === stepNum || (step === 2.5 && stepNum === 2);
            const isDone = step > stepNum || (step === 2.5 && stepNum === 1) || (step === 3 && stepNum <= 2);
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

                <div className="space-y-4 mb-6">
                  {/* bKash */}
                  <label className={`block border-2 rounded-xl p-4 cursor-pointer transition-colors ${payment.method === 'bkash' ? 'border-pink-500 bg-pink-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <div className="flex items-center gap-3">
                      <input type="radio" name="method" value="bkash" checked={payment.method === 'bkash'} onChange={handlePaymentChange} className="w-4 h-4 accent-pink-500" />
                      <div className="w-12 h-12 bg-pink-600 rounded-lg flex items-center justify-center">
                        <Smartphone size={22} className="text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-dark">bKash</p>
                        <p className="text-xs text-gray-500">Pay via bKash mobile banking</p>
                      </div>
                      <span className="ml-auto bg-pink-600 text-white text-xs px-2 py-0.5 rounded font-bold">POPULAR</span>
                    </div>
                    {payment.method === 'bkash' && (
                      <div className="mt-4 bg-white rounded-lg p-4 border border-pink-200">
                        <div className="bg-pink-600 text-white rounded-lg p-3 mb-3 text-center">
                          <p className="text-xs mb-1">Send to this bKash number</p>
                          <p className="text-xl font-bold tracking-widest">01700-000000</p>
                          <p className="text-xs mt-1">Amount: <strong>${cartTotal.toFixed(2)}</strong></p>
                        </div>
                        <p className="text-xs text-gray-500 mb-3">Send money → Personal → Enter number above → Enter amount → Use reference: your name</p>
                        <label className="text-sm font-medium text-dark mb-1.5 block">Your bKash Number <span className="text-accent">*</span></label>
                        <input type="tel" name="bkashNumber" value={payment.bkashNumber} onChange={handlePaymentChange} placeholder="01XXXXXXXXX"
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-pink-500" />
                      </div>
                    )}
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
                  <button onClick={handlePlaceOrder} disabled={loading || (payment.method === 'bkash' && !payment.bkashNumber)}
                    className="flex-1 btn-primary py-3 text-center disabled:opacity-60">
                    {loading ? 'Placing Order...' : payment.method === 'bkash' ? 'Place Order & Confirm bKash →' : 'Place Order →'}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2.5: bKash transaction confirm */}
            {step === 2.5 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Smartphone size={28} className="text-pink-600" />
                  </div>
                  <h2 className="text-xl font-bold text-dark">Confirm bKash Payment</h2>
                  <p className="text-gray-500 text-sm mt-1">Order #{order?.orderNumber}</p>
                </div>

                <div className="bg-pink-50 border border-pink-200 rounded-xl p-4 mb-6">
                  <p className="text-sm text-pink-800 font-medium mb-2">Payment Instructions:</p>
                  <ol className="text-sm text-pink-700 space-y-1 list-decimal list-inside">
                    <li>Open bKash app and tap <strong>Send Money</strong></li>
                    <li>Enter merchant: <strong>01700-000000</strong></li>
                    <li>Amount: <strong>৳{order?.total?.toFixed(2)}</strong></li>
                    <li>Reference: <strong>{order?.orderNumber}</strong></li>
                    <li>Complete payment and note your TxnID</li>
                  </ol>
                </div>

                <div className="mb-6">
                  <label className="text-sm font-medium text-dark mb-1.5 block">bKash Transaction ID <span className="text-accent">*</span></label>
                  <input type="text" name="bkashTransactionId" value={payment.bkashTransactionId} onChange={handlePaymentChange}
                    placeholder="e.g. 8D6XXXXXX"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-pink-500 font-mono uppercase" />
                  <p className="text-xs text-gray-400 mt-1">Find the TxnID in your bKash SMS confirmation</p>
                </div>

                {error && <p className="text-accent text-sm mb-4 flex items-center gap-1"><AlertCircle size={14} /> {error}</p>}

                <button onClick={handleBkashConfirm} disabled={loading} className="w-full bg-pink-600 text-white py-3 rounded-xl font-semibold hover:bg-pink-700 transition-colors disabled:opacity-60">
                  {loading ? 'Verifying...' : 'Confirm Payment'}
                </button>
              </div>
            )}

            {/* STEP 3: Success */}
            {step === 3 && order && (
              <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={40} className="text-green-500" />
                </div>
                <h2 className="text-2xl font-bold text-dark mb-2">Order Placed!</h2>
                <p className="text-gray-500 mb-1">Thank you for your order, {user?.name}!</p>
                <p className="text-primary font-bold text-lg mb-6">Order #{order.orderNumber}</p>

                <div className="bg-gray-50 rounded-xl p-5 text-left mb-6">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div><span className="text-gray-400">Payment</span><p className="font-semibold capitalize">{order.paymentMethod === 'bkash' ? '✓ bKash Confirmed' : 'Cash on Delivery'}</p></div>
                    <div><span className="text-gray-400">Total</span><p className="font-semibold text-primary">${order.total?.toFixed(2)}</p></div>
                    <div><span className="text-gray-400">Delivery to</span><p className="font-semibold">{order.shippingAddress?.city}, {order.shippingAddress?.division}</p></div>
                    <div><span className="text-gray-400">Est. Delivery</span><p className="font-semibold">{new Date(order.estimatedDelivery).toLocaleDateString('en-BD', { day: 'numeric', month: 'short' })}</p></div>
                  </div>
                </div>

                <div className="flex gap-3 justify-center">
                  <Link href={`/orders/${order.id}`} className="btn-primary px-6 py-2.5">Track Order</Link>
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
                {(step === 3 ? order?.items?.map(i => ({ product: { id: i.productId, name: i.name, image: i.image, price: i.price }, quantity: i.quantity })) : cart).map((item, i) => (
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
