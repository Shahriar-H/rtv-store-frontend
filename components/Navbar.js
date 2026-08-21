'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Phone, User, ShoppingCart, Heart, Menu, X, ChevronDown, LogOut, Package, Settings, Loader2 } from 'lucide-react';
import { useCart } from '../lib/CartContext';
import { useAuth } from '../lib/CartContext';
import CartDrawer from './CartDrawer';
import Image from 'next/image';
import logo from '../assets/logo.png';
import NoImage from '../assets/no-image.png';
import { api } from '../lib/api';

function SuggestionDropdown({ loading, products, query, onSelect, onViewAll }) {
  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
      {loading ? (
        <div className="flex items-center justify-center gap-2 py-6 text-sm text-gray-400">
          <Loader2 size={16} className="animate-spin" /> Searching products...
        </div>
      ) : products.length === 0 ? (
        <div className="py-6 text-center text-sm text-gray-400">No products found for &quot;{query}&quot;</div>
      ) : (
        <>
          <div className="max-h-80 overflow-y-auto">
            {products.map(p => (
              <Link
                key={p._id || p.slug}
                href={`/product/${p.slug}`}
                onClick={onSelect}
                className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors"
              >
                <div className="relative w-10 h-10 flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden">
                  <Image src={p.image || NoImage} alt={p.name} fill sizes="40px" className="object-contain p-1" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-dark truncate">{p.name}</p>
                  <p className="text-xs text-accent font-bold">৳{p.price}</p>
                </div>
                <Search size={14} className="text-gray-300 flex-shrink-0" />
              </Link>
            ))}
          </div>
          <button
            onClick={onViewAll}
            className="w-full py-2.5 text-xs font-semibold text-primary border-t border-gray-100 hover:bg-gray-50 transition-colors"
          >
            View all results for &quot;{query}&quot;
          </button>
        </>
      )}
    </div>
  );
}

export default function Navbar() {
  const { cartCount, setCartOpen } = useCart();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [suggestLoading, setSuggestLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const q = searchQuery.trim();
    if (q.length < 2) {
      setSuggestions([]);
      setSuggestLoading(false);
      setSuggestionsOpen(false);
      return;
    }
    setSuggestLoading(true);
    const t = setTimeout(async () => {
      try {
        const data = await api.getProducts({ search: q, perPage: 6 });
        setSuggestions(data.data?.products || data.data || []);
        setSuggestionsOpen(true);
      } catch {
        setSuggestions([]);
      } finally {
        setSuggestLoading(false);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [searchQuery]);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (!e.target.closest('[data-search-wrap]')) setSuggestionsOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push('/shop?search=' + encodeURIComponent(searchQuery.trim()));
    setSuggestionsOpen(false);
  };

  const handleViewAll = () => {
    if (!searchQuery.trim()) return;
    router.push('/shop?search=' + encodeURIComponent(searchQuery.trim()));
    setSuggestionsOpen(false);
  };

  const closeSearch = () => {
    setSuggestionsOpen(false);
    setSearchQuery('');
    setMobileOpen(false);
  };

  const handleLogout = () => { logout(); setUserMenuOpen(false); router.push('/'); };

  const navLinks = [
    { label: 'Home test1', href: '/' },
    { label: 'Shop', href: '/shop' },
    { label: 'Contact', href: '/contact-us' },
    { label: 'Categories', href: '/shop', hasDropdown: false },
  ];

  return (
    <>
      <CartDrawer />
      <header className="sticky top-0 z-20 bg-white shadow-sm">
        <div className="border-b border-gray-100 pt-4">
          <div className="container flex items-center justify-between h-16 gap-4">
            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
              <Image src={logo} alt="Robo Tech Valley" width={100} height={20} className="object-contain" />
            </Link>

            <div data-search-wrap className="relative flex-1 max-w-2xl hidden md:block">
              <form onSubmit={handleSearch} className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onFocus={() => suggestions.length > 0 && setSuggestionsOpen(true)}
                  onKeyDown={e => e.key === 'Escape' && setSuggestionsOpen(false)}
                  className="flex-1 px-4 py-3 text-sm outline-none"
                />
                <button type="submit" className="px-4 py-3 text-gray-400 hover:text-primary transition-colors">
                  <Search size={18} />
                </button>
              </form>
              {suggestionsOpen && (
                <SuggestionDropdown
                  loading={suggestLoading}
                  products={suggestions}
                  query={searchQuery.trim()}
                  onSelect={() => { setSuggestionsOpen(false); setSearchQuery(''); }}
                  onViewAll={handleViewAll}
                />
              )}
            </div>

            <div className="flex items-center gap-5">
              <div className="hidden lg:flex items-center gap-2 text-sm">
                <Phone size={18} className="text-primary" />
                <div>
                  <div className="text-xs text-gray-400">24/7 SUPPORT</div>
                  <div className="font-semibold text-dark">(+880) 1758-518707</div>
                </div>
              </div>

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
            <div data-search-wrap className="relative my-3">
              <form onSubmit={handleSearch} className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onKeyDown={e => e.key === 'Escape' && setSuggestionsOpen(false)}
                  className="flex-1 px-3 py-2.5 text-sm outline-none"
                />
                <button type="submit" className="px-3 text-gray-400"><Search size={18} /></button>
              </form>
              {suggestionsOpen && (
                <SuggestionDropdown
                  loading={suggestLoading}
                  products={suggestions}
                  query={searchQuery.trim()}
                  onSelect={closeSearch}
                  onViewAll={() => { handleViewAll(); setMobileOpen(false); }}
                />
              )}
            </div>
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
