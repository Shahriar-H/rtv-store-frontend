'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Trash2, Plus, Minus, ShoppingCart, ArrowRight, Tag, Truck } from 'lucide-react';
import { useCart } from '../../lib/CartContext';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function CartPageClient() {
  const { cart, cartSubtotal, cartTotal, shippingFee, removeFromCart, updateQty, clearCart } = useCart();

  return (
    <main>
      <Navbar />
      <div className="container py-8 min-h-[70vh]">
        <h1 className="text-2xl font-bold text-dark mb-8">Shopping Cart</h1>

        {cart.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingCart size={40} className="text-gray-300" />
            </div>
            <h2 className="text-xl font-bold text-dark mb-2">Your cart is empty</h2>
            <p className="text-gray-400 text-sm mb-6">Add some products to get started!</p>
            <Link href="/shop" className="btn-primary px-8">Browse Products</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart items */}
            <div className="lg:col-span-2">
              {/* Header */}
              <div className="hidden md:grid grid-cols-12 gap-4 text-xs font-semibold text-gray-400 uppercase tracking-wide pb-3 border-b border-gray-100 mb-4">
                <div className="col-span-6">Product</div>
                <div className="col-span-2 text-center">Price</div>
                <div className="col-span-2 text-center">Qty</div>
                <div className="col-span-2 text-right">Total</div>
              </div>

              <div className="space-y-4">
                {cart.map(item => (
                  <div key={item.product.id} className="grid grid-cols-12 gap-4 items-center py-4 border-b border-gray-100">
                    {/* Product */}
                    <div className="col-span-12 md:col-span-6 flex items-center gap-4">
                      <div className="relative w-20 h-20 flex-shrink-0 bg-gray-50 rounded-xl overflow-hidden">
                        <Image src={item.product.image} alt={item.product.name} fill className="object-contain p-2" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link href={`/product/${item.product.id}`} className="font-semibold text-dark text-sm hover:text-primary transition-colors line-clamp-2">{item.product.name}</Link>
                        {item.product.badge && <span className="inline-block mt-1 text-xs bg-red-100 text-accent px-2 py-0.5 rounded">{item.product.badge}</span>}
                        {/* Mobile price */}
                        <p className="md:hidden text-primary font-bold text-sm mt-1">${item.product.price}</p>
                      </div>
                    </div>

                    {/* Price - desktop */}
                    <div className="hidden md:flex md:col-span-2 justify-center">
                      <div>
                        <p className="font-semibold text-dark text-sm text-center">${item.product.price}</p>
                        {item.product.originalPrice && <p className="text-xs text-gray-400 line-through text-center">${item.product.originalPrice}</p>}
                      </div>
                    </div>

                    {/* Quantity */}
                    <div className="col-span-7 md:col-span-2 flex justify-start md:justify-center">
                      <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                        <button onClick={() => updateQty(item.product.id, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-40" disabled={item.quantity <= 1}>
                          <Minus size={13} />
                        </button>
                        <span className="w-10 text-center text-sm font-semibold">{item.quantity}</span>
                        <button onClick={() => updateQty(item.product.id, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors">
                          <Plus size={13} />
                        </button>
                      </div>
                    </div>

                    {/* Total + remove */}
                    <div className="col-span-5 md:col-span-2 flex items-center justify-end gap-3">
                      <p className="font-bold text-dark text-sm">${(item.product.price * item.quantity).toFixed(2)}</p>
                      <button onClick={() => removeFromCart(item.product.id)} className="text-gray-300 hover:text-accent transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between mt-6 pt-4">
                <Link href="/shop" className="flex items-center gap-1.5 text-sm text-primary hover:underline font-medium">
                  ← Continue Shopping
                </Link>
                <button onClick={clearCart} className="text-sm text-gray-400 hover:text-accent transition-colors flex items-center gap-1">
                  <Trash2 size={14} /> Clear Cart
                </button>
              </div>
            </div>

            {/* Summary sidebar */}
            <div className="space-y-4">
              {/* Order summary */}
              <div className="bg-white border border-gray-100 rounded-2xl p-5">
                <h3 className="font-bold text-dark mb-5">Order Summary</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-gray-500">
                    <span>Subtotal ({cart.reduce((s,i) => s+i.quantity, 0)} items)</span>
                    <span>${cartSubtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>Shipping</span>
                    <span>{shippingFee === 0 ? <span className="text-green-600 font-semibold">Free</span> : '$' + shippingFee}</span>
                  </div>
                  {shippingFee > 0 && (
                    <div className="text-xs text-gray-400 bg-blue-50 rounded-lg p-2.5 flex items-start gap-2">
                      <Truck size={13} className="text-primary mt-0.5 flex-shrink-0" />
                      <span>Add <strong>${(200 - cartSubtotal).toFixed(2)}</strong> more for free shipping!</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-dark text-base border-t pt-3">
                    <span>Total</span>
                    <span className="text-primary">${cartTotal.toFixed(2)}</span>
                  </div>
                </div>

                <Link href="/checkout" className="btn-primary w-full text-center block mt-5 py-3">
                  Proceed to Checkout <ArrowRight size={16} className="inline ml-1" />
                </Link>
              </div>

              {/* Coupon */}
              <div className="bg-white border border-gray-100 rounded-2xl p-5">
                <h3 className="font-bold text-dark mb-3 flex items-center gap-2"><Tag size={15} className="text-primary" /> Coupon Code</h3>
                <div className="flex gap-2">
                  <input type="text" placeholder="Enter coupon code" className="flex-1 border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-primary" />
                  <button className="bg-primary text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-primary-dark transition-colors">Apply</button>
                </div>
              </div>

              {/* Trust badges */}
              <div className="bg-gray-50 rounded-2xl p-4 space-y-2.5 text-sm text-gray-500">
                <div className="flex items-center gap-2"><span>🔒</span> Secure checkout</div>
                <div className="flex items-center gap-2"><span>📱</span> bKash & COD accepted</div>
                <div className="flex items-center gap-2"><span>🚚</span> Free delivery over $200</div>
                <div className="flex items-center gap-2"><span>↩️</span> 7-day easy returns</div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}
