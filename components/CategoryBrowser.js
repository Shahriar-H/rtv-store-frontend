'use client';
import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Tag } from 'lucide-react';
import { api } from '../lib/api';
import NoImage from '../assets/no-image.png';

const categoryImages = {
  'televisions': 'https://images.unsplash.com/photo-1593359677879-a4bb92f4834c?w=80&q=80',
  'laptop-pc': 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=80&q=80',
  'mobile-tablets': 'https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=80&q=80',
  'games-videos': 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=80&q=80',
  'home-appliances': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=80&q=80',
  'health-sports': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=80&q=80',
};

export default function CategoryBrowser() {
  const [categories, setCategories] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    api.getCategories().then((data) => setCategories(data?.data || [])).catch(console.error);
  }, []);

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * 200, behavior: 'smooth' });
    }
  };

  return (
    <section className="container py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="section-label"><Tag size={14} /> Categories</p>
          <h2 className="section-title mb-0">Browse by Category</h2>
        </div>
        <div className="flex gap-2">
          <button onClick={() => scroll(-1)} className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all">
            <ChevronLeft size={18} />
          </button>
          <button onClick={() => scroll(1)} className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div ref={scrollRef} className="flex gap-6 overflow-x-auto scrollbar-hide pb-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            className="group flex flex-col items-center flex-shrink-0 min-w-[100px]"
          >
            <div className="category-circle">
              {cat.image ? (
                <div className="relative w-full h-full">
                  <Image src={cat?.image || NoImage} alt={cat?.name} fill className="object-cover" />
                </div>

              ) : (
                <div className="relative w-full h-full">
                  <Image src={NoImage} alt={cat?.name} fill className="object-cover" />
                </div>
              )}
            </div>
            <p className="text-sm font-medium text-gray-700 group-hover:text-primary transition-colors text-center">
              {cat?.name}
            </p>
          </button>
        ))}
      </div>
    </section>
  );
}
