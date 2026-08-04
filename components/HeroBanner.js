'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { api } from '../lib/api';
import NoImage from '../assets/no-image.png';

const slides1 = [
  {
    badge: '30% Sale Off',
    title: 'True Wireless Noise Cancelling Headphone',
    desc: 'Lorem ipsum dolor sit, consectetur elit nunc suscipit non ipsum nec suscipit.',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
    bg: 'from-blue-50 to-indigo-100',
  },
  {
    badge: '25% Sale Off',
    title: 'Latest iPhone 14 Pro Max — Now Available',
    desc: 'Experience the most powerful iPhone ever. A16 Bionic chip, Pro camera system.',
    image: 'https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=500&q=80',
    bg: 'from-slate-50 to-blue-50',
  },
  {
    badge: 'New Arrival',
    title: 'MacBook Air M2 – Remarkably Thin & Powerful',
    desc: 'The world\'s best consumer laptop just got even better with M2 chip inside.',
    image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=500&q=80',
    bg: 'from-gray-50 to-slate-100',
  },
];

const sideDeals1 = [
  {
    title: 'iPhone 14 Plus & 14 Pro Max',
    tag: 'limited time offer',
    price: '৳699',
    original: '৳999',
    image: 'https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=120&q=80',
  },
  {
    title: 'Wireless Headphone',
    tag: 'limited time offer',
    price: '৳699',
    original: '৳999',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=120&q=80',
  },
];

export default function HeroBanner() {
  const [active, setActive] = useState(1);
  const [products, setProducts] = useState([]);
  const [slides, setslides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sideDeals, setsideDeals] = useState(sideDeals1);

  useEffect(() => {
    api.getProducts({ type: 'sale', perPage: 2 })
      .then((data) => {
        // setProducts(data?.data || []);
        setsideDeals(data?.data || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    api.getProducts({ type: 'new', perPage: 3 })
      .then((data) => {
        // setProducts(data?.data || []);
        setslides(data?.data || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      setActive((p) => (p + 1) % slides.length);
      
    }, 4000);
    
    return () => clearInterval(t);
  }, [slides]);

  const slide = slides[active];

  return (
    <section className="container py-5">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main slide */}
        {!loading&&<div className={`lg:col-span-2 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl overflow-hidden relative`}>
          <div className="flex flex-col md:flex-row items-center p-8 md:p-10 min-h-[300px] md:min-h-[360px]">
            <div className="flex-1 z-10">
              <div className="inline-block   bg-white/70 backdrop-blur text-primary font-bold text-2xl md:text-4xl px-3 py-1 rounded mb-4">
                {slide?.badge}
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-dark mb-3 leading-tight max-w-xs">
                {slide?.name}
              </h1>
              <p className="text-gray-500 text-sm mb-6 max-w-xs">{slide?.description?.substring(0, 100)}</p>
              <button className="btn-primary">Shop Now →</button>
            </div>
            <div className="relative w-56 h-56 md:w-72 md:h-72 flex-shrink-0 mt-6 md:mt-0">
              <Image src={slide?.image || NoImage} alt={slide?.name} fill className="object-contain drop-shadow-2xl" />
            </div>
          </div>
          {/* Dots */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`slider-dot ${i === active ? 'active' : ''}`}
              />
            ))}
          </div>
        </div>}
        {loading&&<div className={`lg:col-span-2 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl overflow-hidden relative`}>
          <div className="flex flex-col md:flex-row items-center p-8 md:p-10 min-h-[300px] md:min-h-[360px]">
            <div className="flex-1 z-10">
              <div className="inline-block animate-pulse  bg-white/70 backdrop-blur text-primary font-bold text-2xl md:text-4xl px-3 py-1 rounded mb-4">
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-dark mb-3 leading-tight max-w-xs animate-pulse bg-black/10 rounded p-2">
              </h1>
              <p className="text-gray-500 text-sm mb-6 max-w-xs animate-pulse bg-black/10 rounded p-2">
                {slide?.description?.substring(0, 100)}
              </p>
              <button className="btn-primary animate-pulse bg-black/10 rounded p-2"></button>
            </div>
            <div className="relative w-56 h-56 md:w-72 md:h-72 flex-shrink-0 mt-6 md:mt-0 animate-pulse bg-black/10 rounded">
              
            </div>
          </div>
          {/* Dots */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`slider-dot ${i === active ? 'active' : ''}`}
              />
            ))}
          </div>
        </div>}

        {/* Side deals */}
        <div className="flex flex-col gap-4">
          {!loading&&sideDeals.map((deal, i) => (
            <div key={i} className="bg-gray-50 rounded-2xl p-5 flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex-1">
                <h3 className="font-bold text-dark text-base mb-1 leading-tight">{deal.name}</h3>
                <p className="text-xs text-gray-400 mb-2">{deal.category}</p>
                <div className="flex items-center gap-2">
                  <span className="text-accent font-bold text-lg">৳{deal.price}</span>
                  <span className="text-gray-400 text-sm line-through">৳{deal.originalPrice}</span>
                </div>
              </div>
              <div className="relative w-24 h-24 flex-shrink-0">
                <Image src={deal.image} alt={deal.name} fill className="object-contain" />
              </div>
            </div>
          ))}

          {loading&&Array(2).fill().map((_, i) => (
            <div key={i} className="bg-gray-50 rounded-2xl p-5 flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex-1">
                <h3 className="font-bold text-dark text-base mb-1 leading-tight bg-black/10 animate-pulse rounded">{''}</h3>
                <p className="text-xs text-gray-400 mb-2 bg-black/10 animate-pulse rounded">{''}</p>
                <div className="flex items-center gap-2 ">
                  <span className="text-accent font-bold text-lg bg-black/10 animate-pulse rounded p-2">{''}</span>
                  <span className="text-gray-400 text-sm line-through bg-black/10 animate-pulse rounded p-2">{''}</span>
                </div>
              </div>
              <div className="relative w-24 h-24 flex-shrink-0 bg-black/10 animate-pulse rounded">
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
