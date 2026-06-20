'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Phone, User, ShoppingCart, Heart, Eye, Menu, X, ChevronDown, LogOut, Package, Settings } from 'lucide-react';
import { useCart } from '../lib/CartContext';
import { useAuth } from '../lib/CartContext';
import CartDrawer from './CartDrawer';
import Image from 'next/image';
import logo from '../assets/logo.png';

export default function Navbar() {
  const { cartCount, setCartOpen } = useCart();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) router.push('/shop?search=' + encodeURIComponent(searchQuery.trim()));
  };

  const handleLogout = () => { logout(); setUserMenuOpen(false); router.push('/'); };

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/shop' },
    { label: 'Contact', href: '/contact-us' },
    { label: 'Categories', href: '/shop', hasDropdown: false },
  ];

  return (
    <>
      <CartDrawer />
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="border-b border-gray-100 pt-4">
          <div className="container flex items-center justify-between h-16 gap-4">
            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
              {/* <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">R</span>
              </div>
              <div className="leading-tight">
                <div className="font-bold text-dark text-sm">ROBO</div>
                <div className="text-gray-400 text-xs">TECH VALLEY</div>
              </div> */}
              <Image src={logo} alt="Robo Tech Valley" width={100} height={20} className="object-contain" />
            </Link>

            <form onSubmit={handleSearch} className="flex-1 max-w-2xl hidden md:flex items-center border border-gray-200 rounded-lg overflow-hidden">
              <input type="text" placeholder="Search products..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="flex-1 px-4 py-3 text-sm outline-none" />
              <button type="submit" className="px-4 py-3 text-gray-400 hover:text-primary transition-colors"><Search size={18} /></button>
            </form>

            <div className="flex items-center gap-5">
              <div className="hidden lg:flex items-center gap-2 text-sm">
                <Phone size={18} className="text-primary" />
                <div>
                  <div className="text-xs text-gray-400">24/7 SUPPORT</div>
                  <div className="font-semibold text-dark">(+880) 1700-000000</div>
                </div>
              </div>

              {/* User menu */}
              <div className="relative">
                {user ? (
                  <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="hidden sm:flex flex-col items-center text-gray-600 hover:text-primary transition-colors">
                    <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">{user.name.charAt(0).toUpperCase()}</div>
                    <span className="text-xs mt-0.5">{user.name.split(' ')[0]}</span>
                  </button>
                ) : (
                  <Link href="/account/login" className="hidden sm:flex flex-col items-center text-gray-600 hover:text-primary transition-colors">
                    <User size={20} /><span className="text-xs">Sign In</span>
                  </Link>
                )}
                {userMenuOpen && user && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-xl py-1 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="font-semibold text-sm text-dark">{user.name}</p>
                      <p className="text-xs text-gray-400">{user.email}</p>
                    </div>
                    <Link href="/orders" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                      <Package size={15} /> My Orders
                    </Link>
                    <Link href="/account" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                      <Settings size={15} /> Account Settings
                    </Link>
                    <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2.5 text-sm text-accent hover:bg-red-50 w-full">
                      <LogOut size={15} /> Logout
                    </button>
                  </div>
                )}
              </div>

              <button onClick={() => setCartOpen(true)} className="relative flex flex-col items-center text-gray-600 hover:text-primary transition-colors">
                <ShoppingCart size={20} />
                <span className="text-xs">Cart</span>
                {cartCount > 0 && <span className="absolute -top-1 -right-1 bg-accent text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">{cartCount}</span>}
              </button>
              <button className="md:hidden text-gray-600" onClick={() => setMobileOpen(!mobileOpen)}>
                {mobileOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        <nav className="border-b border-gray-100 hidden md:block">
          <div className="container flex items-center justify-between h-11">
            <div className="flex items-center gap-8">
              {navLinks.map(link => (
                <Link key={link.label} href={link.href} className="flex items-center gap-1 text-sm text-gray-700 hover:text-primary transition-colors font-medium">
                  {link.label}{link.hasDropdown && <ChevronDown size={13} />}
                </Link>
              ))}
            </div>
            <div className="flex items-center gap-5 text-sm text-gray-600">
              <Link href="/orders" className="flex items-center gap-1 hover:text-primary transition-colors"><Package size={15} /> My Orders</Link>
              <button className="flex items-center gap-1 hover:text-primary transition-colors"><Heart size={15} /> Wishlist</button>
            </div>
          </div>
        </nav>

        {mobileOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-4 pb-4">
            <form onSubmit={handleSearch} className="flex items-center border border-gray-200 rounded-lg my-3 overflow-hidden">
              <input type="text" placeholder="Search..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="flex-1 px-3 py-2.5 text-sm outline-none" />
              <button type="submit" className="px-3 text-gray-400"><Search size={18} /></button>
            </form>
            {navLinks.map(link => (
              <Link key={link.label} href={link.href} onClick={() => setMobileOpen(false)} className="flex items-center py-2.5 border-b border-gray-50 text-sm text-gray-700 font-medium">{link.label}</Link>
            ))}
            {user ? (
              <button onClick={handleLogout} className="flex items-center gap-2 py-2.5 text-sm text-accent w-full"><LogOut size={15} /> Logout ({user.name})</button>
            ) : (
              <Link href="/account/login" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 py-2.5 text-sm text-primary font-medium"><User size={15} /> Sign In / Register</Link>
            )}
          </div>
        )}
      </header>
    </>
  );
}
