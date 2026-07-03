'use client';
import { X, ShoppingCart, Trash2, Plus, Minus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '../lib/CartContext';
import NoImage from '../assets/no-image.png';

export default function CartDrawer() {
  const { cart, cartSubtotal, cartTotal, shippingFee, cartOpen, setCartOpen, removeFromCart, updateQty } = useCart();
  return (
    <>
      {cartOpen && <div className="fixed inset-0 bg-black/40 z-50" onClick={() => setCartOpen(false)} />}
      <div className={`fixed top-0 right-0 h-full w-80 bg-white z-50 shadow-2xl transition-transform duration-300 flex flex-col ${cartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="font-bold text-lg flex items-center gap-2">
            <ShoppingCart size={20} className="text-primary" /> Cart
            {cart.length > 0 && <span className="bg-primary text-white text-xs rounded-full px-2 py-0.5">{cart.length}</span>}
          </h2>
          <button onClick={() => setCartOpen(false)} className="text-gray-400 hover:text-dark"><X size={22} /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <ShoppingCart size={48} className="mx-auto mb-3 opacity-30" />
              <p className="font-medium">Your cart is empty</p>
            </div>
          ) : cart.map(item => (
            <div key={item.product.id} className="flex gap-3 bg-gray-50 rounded-lg p-3">
              <div className="relative w-14 h-14 flex-shrink-0 bg-white rounded-md overflow-hidden">
                <Image src={item.product.image || NoImage} alt={item.product.name} fill className="object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-dark line-clamp-1">{item.product.name}</p>
                <p className="text-primary font-bold text-sm">${item.product.price}</p>
                <div className="flex items-center gap-2 mt-1">
                  <button onClick={() => updateQty(item.product.id, item.quantity - 1)} className="w-5 h-5 rounded bg-gray-200 flex items-center justify-center hover:bg-primary hover:text-white"><Minus size={10} /></button>
                  <span className="text-xs font-medium">{item.quantity}</span>
                  <button onClick={() => updateQty(item.product.id, item.quantity + 1)} className="w-5 h-5 rounded bg-gray-200 flex items-center justify-center hover:bg-primary hover:text-white"><Plus size={10} /></button>
                </div>
              </div>
              <button onClick={() => removeFromCart(item.product.id)} className="text-gray-300 hover:text-accent"><Trash2 size={15} /></button>
            </div>
          ))}
        </div>
        {cart.length > 0 && (
          <div className="p-4 border-t bg-gray-50">
            <div className="space-y-1 mb-3 text-sm">
              <div className="flex justify-between text-gray-500"><span>Subtotal</span><span>${cartSubtotal.toFixed(2)}</span></div>
              <div className="flex justify-between text-gray-500"><span>Shipping</span><span>{shippingFee === 0 ? <span className="text-green-600">Free</span> : '$' + shippingFee}</span></div>
              <div className="flex justify-between font-bold text-dark pt-1 border-t"><span>Total</span><span className="text-primary">${cartTotal.toFixed(2)}</span></div>
            </div>
            <Link href="/checkout" onClick={() => setCartOpen(false)} className="btn-primary w-full text-center block mb-2">Proceed to Checkout</Link>
            <Link href="/cart" onClick={() => setCartOpen(false)} className="block text-center text-sm text-gray-500 hover:text-dark py-1">View Cart</Link>
          </div>
        )}
      </div>
    </>
  );
}
