'use client';
import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ChevronRight, Search, Tag, Percent } from 'lucide-react';
import { api } from '../../lib/api';
import ProductCard from '../../components/ProductCard';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Link from 'next/link';
import { Pagination } from '../../lib/Pagination';

const SORT_OPTIONS = [
  { value: '', label: 'Default' },
  { value: 'price', label: 'Price: Low to High' },
  { value: '-price', label: 'Price: High to Low' },
  { value: '-rating', label: 'Best Rated' },
];

export default function SaleClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    sort: searchParams.get('sort') || '',
    page: parseInt(searchParams.get('page') || '1'),
  });

  const fetchProducts = useCallback(async (f) => {
    setLoading(true);
    try {
      const params = { perPage: 12, sale: 'true', ...f };
      Object.keys(params).forEach(k => !params[k] && delete params[k]);
      const data = await api.getProducts(params);
      setProducts(data.data?.products || data.data || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
    } catch (e) {
      console.error('Failed to fetch sale products:', e);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts(filters);
  }, [filters, fetchProducts]);

  const updateFilter = (key, value) => {
    const newFilters = { ...filters, [key]: value, page: key === 'page' ? value : 1 };
    setFilters(newFilters);
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => v && params.set(k, v));
    router.replace('/sale?' + params.toString(), { scroll: false });
  };

  return (
    <main>
      <Navbar />
      <div className="container py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
          <Link href="/" className="hover:text-primary">Home</Link>
          <ChevronRight size={14} />
          <span className="text-dark font-medium">Sale</span>
        </nav>

        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full">
            <Tag size={18} />
            <span className="font-bold text-sm">{total} items on sale</span>
          </div>
        </div>

        {/* Top bar */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <select value={filters.sort} onChange={e => updateFilter('sort', e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-primary bg-white">
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <p className="text-sm text-gray-400 ml-auto">{total} products</p>
        </div>

        {/* Products */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array(12).fill(0).map((_, i) => (
              <div key={i} className="h-64 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <Percent size={48} className="mx-auto text-gray-200 mb-4" />
            <h3 className="font-bold text-dark text-lg mb-2">No sale products found</h3>
            <p className="text-gray-400 text-sm mb-4">Check back later for new deals!</p>
            <Link href="/shop" className="btn-primary px-6 inline-block">Browse Shop</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {products.map(p => <ProductCard key={p._id || p.id} product={p} />)}
          </div>
        )}

        {/* Pagination */}
        <Pagination
          page={filters.page}
          totalPages={totalPages}
          total={total}
          perPage={12}
          onPageChange={(newPage) => {
            updateFilter('page', newPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      </div>
      <Footer />
    </main>
  );
}
