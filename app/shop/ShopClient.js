'use client';
import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { SlidersHorizontal, ChevronRight, X, Search, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { api } from '../../lib/api';
import ProductCard from '../../components/ProductCard';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Link from 'next/link';

const SORT_OPTIONS = [
  { value: '', label: 'Default' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Best Rated' },
];

export default function ShopClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]); // ✅ Dynamic categories from DB
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    search: searchParams.get('search') || '',
    sort: searchParams.get('sort') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    page: parseInt(searchParams.get('page') || '1'),
  });
  const [searchInput, setSearchInput] = useState(filters.search);

  // ✅ Fetch categories from backend
  const fetchCategories = useCallback(async () => {
    try {
      setCategoriesLoading(true);
      const res = await api.getCategories();
      // ✅ Add "All Products" as first option
      const dbCategories = res.data || res.data?.data || [];
      setCategories([{ slug: '', label: 'All Products', icon: 'grid' }, ...dbCategories]);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
      // Fallback to empty if API fails
      setCategories([{ slug: '', label: 'All Products', icon: 'grid' }]);
    } finally {
      setCategoriesLoading(false);
    }
  }, []);

  // ✅ Fetch products with filters
  const fetchProducts = useCallback(async (f) => {
    setLoading(true);
    try {
      const params = { perPage: 12, ...f };
      Object.keys(params).forEach(k => !params[k] && delete params[k]);
      const data = await api.getProducts(params);
      setProducts(data.data?.products || data.data || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
    } catch (e) { 
      console.error('Failed to fetch products:', e); 
      setProducts([]);
    } finally { 
      setLoading(false); 
    }
  }, []);

  // ✅ Initial load
  useEffect(() => {
    fetchCategories();
    fetchProducts(filters);
  }, [fetchCategories, fetchProducts]);

  // ✅ Refetch products when filters change
  useEffect(() => {
    fetchProducts(filters);
  }, [filters, fetchProducts]);

  const updateFilter = (key, value) => {
    const newFilters = { ...filters, [key]: value, page: key === 'page' ? value : 1 };
    setFilters(newFilters);
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => v && params.set(k, v));
    router.replace('/shop?' + params.toString(), { scroll: false });
  };

  const clearFilters = () => {
    const reset = { category: '', search: '', sort: '', minPrice: '', maxPrice: '', page: 1 };
    setFilters(reset);
    setSearchInput('');
    router.replace('/shop');
  };

  const activeFilterCount = [filters.category, filters.minPrice, filters.maxPrice].filter(Boolean).length;

  // ✅ Get category label by slug for breadcrumb
  const getCategoryLabel = (slug) => {
    const cat = categories.find(c => c.slug === slug);
    return cat?.name || cat?.label || slug?.replace('-', ' & ');
  };

  return (
    <main>
      <Navbar />
      <div className="container py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
          <Link href="/" className="hover:text-primary">Home</Link>
          <ChevronRight size={14} />
          <Link href="/shop" className="hover:text-primary">Shop</Link>
          {filters.category && (
            <>
              <ChevronRight size={14} />
              <span className="text-dark font-medium capitalize">{getCategoryLabel(filters.category)}</span>
            </>
          )}
        </nav>

        {/* Top bar */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          {/* Search */}
          <form onSubmit={e => { e.preventDefault(); updateFilter('search', searchInput); }} 
            className="flex-1 min-w-[200px] max-w-md flex items-center border border-gray-200 rounded-lg overflow-hidden">
            <Search size={16} className="ml-3 text-gray-400 flex-shrink-0" />
            <input type="text" value={searchInput} onChange={e => setSearchInput(e.target.value)} 
              placeholder="Search products..." className="flex-1 px-3 py-2.5 text-sm outline-none" />
            {searchInput && (
              <button type="button" onClick={() => { setSearchInput(''); updateFilter('search', ''); }} 
                className="pr-3 text-gray-400 hover:text-dark"><X size={14} /></button>
            )}
          </form>

          {/* Sort */}
          <select value={filters.sort} onChange={e => updateFilter('sort', e.target.value)} 
            className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-primary bg-white">
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>

          {/* Filter toggle (mobile) */}
          <button onClick={() => setSidebarOpen(true)} 
            className="lg:hidden flex items-center gap-2 border border-gray-200 rounded-lg px-4 py-2.5 text-sm hover:border-primary">
            <SlidersHorizontal size={15} /> Filters 
            {activeFilterCount > 0 && (
              <span className="bg-primary text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Results count */}
          <p className="text-sm text-gray-400 ml-auto">{total} products</p>

          {/* Active filter tags */}
          {activeFilterCount > 0 && (
            <button onClick={clearFilters} 
              className="flex items-center gap-1 text-xs text-accent border border-red-200 bg-red-50 px-2.5 py-1.5 rounded-full hover:bg-red-100">
              <X size={11} /> Clear all
            </button>
          )}
        </div>

        <div className="flex gap-6">
          {/* Sidebar — desktop */}
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <FilterPanel 
              filters={filters} 
              updateFilter={updateFilter} 
              clearFilters={clearFilters}
              categories={categories}
              categoriesLoading={categoriesLoading}
            />
          </aside>

          {/* Mobile sidebar drawer */}
          {sidebarOpen && (
            <>
              <div className="fixed inset-0 bg-black/40 z-50 lg:hidden" onClick={() => setSidebarOpen(false)} />
              <div className="fixed top-0 left-0 h-full w-72 bg-white z-50 shadow-2xl p-5 overflow-y-auto lg:hidden">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-bold text-dark">Filters</h3>
                  <button onClick={() => setSidebarOpen(false)}><X size={20} /></button>
                </div>
                <FilterPanel 
                  filters={filters} 
                  updateFilter={(k,v) => { updateFilter(k,v); setSidebarOpen(false); }} 
                  clearFilters={() => { clearFilters(); setSidebarOpen(false); }}
                  categories={categories}
                  categoriesLoading={categoriesLoading}
                />
              </div>
            </>
          )}

          {/* Products */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {Array(12).fill(0).map((_, i) => (
                  <div key={i} className="h-64 bg-gray-100 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <Search size={48} className="mx-auto text-gray-200 mb-4" />
                <h3 className="font-bold text-dark text-lg mb-2">No products found</h3>
                <p className="text-gray-400 text-sm mb-4">Try adjusting your filters or search terms.</p>
                <button onClick={clearFilters} className="btn-primary px-6">Clear Filters</button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {products.map(p => <ProductCard key={p._id || p.id} product={p} />)}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button onClick={() => updateFilter('page', filters.page - 1)} 
                  disabled={filters.page <= 1}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:border-primary hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                  ← Prev
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  // Show pages around current page
                  const start = Math.max(1, filters.page - 2);
                  const end = Math.min(totalPages, start + 4);
                  const pages = [];
                  for (let p = start; p <= end; p++) pages.push(p);
                  return pages.map(p => (
                    <button key={p} onClick={() => updateFilter('page', p)}
                      className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                        p === filters.page ? 'bg-primary text-white' : 'border border-gray-200 hover:border-primary hover:text-primary'
                      }`}>
                      {p}
                    </button>
                  ));
                })}
                <button onClick={() => updateFilter('page', filters.page + 1)} 
                  disabled={filters.page >= totalPages}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:border-primary hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                  Next →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}

// ✅ Updated FilterPanel with dynamic categories + loading state
function FilterPanel({ filters, updateFilter, clearFilters, categories, categoriesLoading }) {
  const [priceOpen, setPriceOpen] = useState(true);
  const [minVal, setMinVal] = useState(filters.minPrice);
  const [maxVal, setMaxVal] = useState(filters.maxPrice);

  const applyPrice = () => {
    updateFilter('minPrice', minVal);
    updateFilter('maxPrice', maxVal);
  };

  return (
    <div className="space-y-6">
      {/* Categories - Dynamic from DB */}
      <div>
        <h4 className="font-bold text-dark text-sm mb-3">Categories</h4>
        {categoriesLoading ? (
          <div className="space-y-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-8 bg-gray-100 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          <ul className="space-y-1">
            {categories.map(cat => {
              const slug = cat.slug || '';
              const label = cat.name || cat.label || 'Category';
              const icon = cat.icon;
              
              return (
                <li key={cat._id || slug}>
                  <button 
                    onClick={() => updateFilter('category', slug)}
                    className={`w-full flex items-center gap-2 text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      filters.category === slug 
                        ? 'bg-primary text-white font-semibold' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {/* Optional: Show category icon if available */}
                    {/* {icon && <span className="text-xs">{icon}</span>} */}
                    {/* Optional: Show category image thumbnail */}
                    {/* {cat.image && (
                      <img src={cat.image} alt={label} className="w-5 h-5 rounded object-cover" />
                    )} */}
                    
                    <span className="flex-1">{label}</span>
                    {/* Optional: Show product count if API returns it */}
                    {cat.productCount !== undefined && (
                      <span className="text-xs text-gray-400">({cat.productCount})</span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Price range */}
      <div>
        <button onClick={() => setPriceOpen(!priceOpen)} 
          className="flex items-center justify-between w-full font-bold text-dark text-sm mb-3">
          Price Range {priceOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        </button>
        {priceOpen && (
          <div className="space-y-3">
            <div className="flex gap-2">
              <input type="number" value={minVal} onChange={e => setMinVal(e.target.value)} 
                placeholder="Min $" 
                className="w-full border border-gray-200 rounded-lg px-2 py-2 text-sm outline-none focus:border-primary" />
              <input type="number" value={maxVal} onChange={e => setMaxVal(e.target.value)} 
                placeholder="Max $" 
                className="w-full border border-gray-200 rounded-lg px-2 py-2 text-sm outline-none focus:border-primary" />
            </div>
            <button onClick={applyPrice} 
              className="w-full bg-primary text-white rounded-lg py-2 text-sm font-semibold hover:bg-primary-dark transition-colors">
              Apply
            </button>
          </div>
        )}
      </div>

      {/* Clear */}
      <button onClick={clearFilters} 
        className="w-full border border-gray-200 rounded-lg py-2 text-sm text-gray-500 hover:border-accent hover:text-accent transition-colors">
        Clear All Filters
      </button>
    </div>
  );
}