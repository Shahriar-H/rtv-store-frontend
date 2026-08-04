'use client';
import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { AUTH_LOGOUT_EVENT } from './api';

const CartContext = createContext(null);
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    setUser(null);
    try { localStorage.removeItem('robo_user'); } catch {}
    try { localStorage.removeItem('robo_token'); } catch {}
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem('robo_user');
    const token = localStorage.getItem('robo_token');
    if (stored && token) { try { setUser(JSON.parse(stored)); } catch {} }
    setLoading(false);

    const onAuthLogout = () => logout();
    window.addEventListener(AUTH_LOGOUT_EVENT, onAuthLogout);
    window.addEventListener('storage', (e) => {
      if (e.key === 'robo_token' && !e.newValue) logout();
    });

    return () => {
      window.removeEventListener(AUTH_LOGOUT_EVENT, onAuthLogout);
    };
  }, [logout]);

  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem('robo_user', JSON.stringify(userData));
    localStorage.setItem('robo_token', token);
  };

  return <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>;
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('robo_cart');
    if (stored) { try { setCart(JSON.parse(stored)); } catch {} }
  }, []);

  const saveCart = (c) => {
    setCart(c);
    localStorage.setItem('robo_cart', JSON.stringify(c));
  };

  const addToCart = useCallback((product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      const updated = existing
        ? prev.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + quantity } : i)
        : [...prev, { product, quantity }];
      localStorage.setItem('robo_cart', JSON.stringify(updated));
      return updated;
    });
    setCartOpen(true);
  }, []);

  const removeFromCart = useCallback((productId) => {
    setCart(prev => {
      const updated = prev.filter(i => i.product.id !== productId);
      localStorage.setItem('robo_cart', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const updateQty = useCallback((productId, quantity) => {
    if (quantity < 1) return;
    setCart(prev => {
      const updated = prev.map(i => i.product.id === productId ? { ...i, quantity } : i);
      localStorage.setItem('robo_cart', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
    localStorage.removeItem('robo_cart');
  }, []);

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);
  const cartSubtotal = cart.reduce((s, i) => s + i.product.price * i.quantity, 0);
  const shippingFee = cartSubtotal >= 200 ? 0 : 60;
  const cartTotal = cartSubtotal + shippingFee;

  return (
    <CartContext.Provider value={{ cart, cartCount, cartSubtotal, cartTotal, shippingFee, cartOpen, setCartOpen, addToCart, removeFromCart, updateQty, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function AppProviders({ children }) {
  return <AuthProvider><CartProvider>{children}</CartProvider></AuthProvider>;
}

export const useCart = () => { const c = useContext(CartContext); if (!c) throw new Error('No CartContext'); return c; };
export const useAuth = () => { const c = useContext(AuthContext); if (!c) throw new Error('No AuthContext'); return c; };
