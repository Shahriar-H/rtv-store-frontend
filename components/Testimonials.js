'use client';
import { useEffect, useState } from 'react';
import { Star, MessageSquare, ChevronLeft, ChevronRight } from 'lucide-react';
import { api } from '../lib/api';

function StarRow({ count }) {
  return (
    <div className="flex gap-0.5 mb-3">
      {Array(count).fill(0).map((_, i) => (
        <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
      ))}
    </div>
  );
}

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    api.getTestimonials().then((data) => setTestimonials(data?.data || [])).catch(console.error);
  }, []);

  return (
    <section className="container py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="section-label"><MessageSquare size={14} /> Testimonials</p>
          <h2 className="section-title mb-0">User Feedbacks</h2>
        </div>
        <div className="flex gap-2">
          <button className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all">
            <ChevronLeft size={18} />
          </button>
          <button className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((t) => (
          <div key={t.id} className="border border-gray-100 rounded-xl p-6 hover:shadow-md transition-shadow">
            <StarRow count={t.rating} />
            <p className="text-gray-600 text-sm leading-relaxed mb-5">{t.text}</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                {t.name.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-dark text-sm">{t.name}</p>
                <p className="text-gray-400 text-xs">{t.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
