'use client';
import { useEffect, useState } from 'react';
import { Calendar } from 'lucide-react';
import ProductCard from './ProductCard';
import { api } from '../lib/api';
import Link from 'next/link';

export default function NewArrivals() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getProducts({ type: 'all', limit: 8 })
      .then((data) => {
        console.log(data);
        
        setProducts(data?.data || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="container py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="section-label"><Calendar size={14} /> This Week&apos;s</p>
          <h2 className="section-title mb-0">New Arrivals</h2>
        </div>
        <Link href="/shop" className="btn-outline text-sm py-2 px-4">
          View All
        </Link>
      </div>
    
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array(8).fill(0).map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-lg h-64 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products?.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </section>
  );
}
