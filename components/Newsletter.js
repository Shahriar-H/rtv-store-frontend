'use client';
import { useState } from 'react';
import { api } from '../lib/api';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error

  const handleSubmit = async () => {
    if (!email) return;
    setStatus('loading');
    try {
      await api.subscribeNewsletter(email);
      setStatus('success');
      setEmail('');
    } catch {
      setStatus('error');
    }
  };

  return (
    <section className="newsletter-bg py-12">
      <div className="container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-white text-2xl font-bold mb-1">
              Don&apos;t Miss Out Latest Trends & Offers
            </h2>
            <p className="text-blue-200 text-sm">
              Register to receive news about the latest offers & discount codes
            </p>
          </div>

          <div className="flex w-full md:w-auto">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              className="flex-1 md:w-72 px-4 py-3 rounded-l-lg text-sm outline-none border-2 border-white/20 bg-white text-dark"
            />
            <button
              onClick={handleSubmit}
              disabled={status === 'loading'}
              className="bg-white text-primary font-bold px-6 py-3 rounded-r-lg hover:bg-blue-50 transition-colors text-sm"
            >
              {status === 'loading' ? '...' : 'Subscribe'}
            </button>
          </div>
        </div>
        {status === 'success' && (
          <p className="text-green-300 text-sm mt-3 text-center">✓ Successfully subscribed!</p>
        )}
        {status === 'error' && (
          <p className="text-red-300 text-sm mt-3 text-center">Invalid email. Please try again.</p>
        )}
      </div>
    </section>
  );
}
