'use client';
import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
import ProductCard from './ProductCard';
import { api } from '../lib/api';
import Link from 'next/link';

export default function BestSellers() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.getProducts({ type: 'bestseller', limit: 6 })
      .then((data) => setProducts(data?.data || []))
      .catch(console.error);
  }, []);

  return (
    <section className="container py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="section-label"><Clock size={14} /> This Month</p>
          <h2 className="section-title mb-0">Best Sellers</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} layout="horizontal" />
        ))}
      </div>

      <div className="text-center mt-8">
        <Link href="/shop" className="btn-outline">
          View All
        </Link>
      </div>
    </section>
  );
}
