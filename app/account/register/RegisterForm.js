'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Mail, Lock, User, Phone, ShoppingBag } from 'lucide-react';
import { api } from '../../../lib/api';
import { useAuth } from '../../../lib/CartContext';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';

export default function RegisterForm() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) { setError('Passwords do not match'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true); setError('');
    try {
      const res = await api.register({ name: form.name, email: form.email, phone: form.phone, password: form.password });
      login(res.user, res.token);
      router.push('/');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <main>
      <Navbar />
      <div className="min-h-[70vh] flex items-center justify-center py-16 px-4 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                <ShoppingBag size={28} className="text-white" />
              </div>
              <h1 className="text-2xl font-bold text-dark">Create Account</h1>
              <p className="text-gray-500 text-sm mt-1">Join Robo Tech Valley today</p>
            </div>

            {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg mb-5">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                { label: 'Full Name', name: 'name', type: 'text', icon: User, placeholder: 'John Doe' },
                { label: 'Email Address', name: 'email', type: 'email', icon: Mail, placeholder: 'you@example.com' },
                { label: 'Phone Number', name: 'phone', type: 'tel', icon: Phone, placeholder: '01700000000' },
              ].map(({ label, name, type, icon: Icon, placeholder }) => (
                <div key={name}>
                  <label className="text-sm font-medium text-dark mb-1.5 block">{label}</label>
                  <div className="relative">
                    <Icon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type={type} name={name} value={form[name]} onChange={handleChange} placeholder={placeholder} required={name !== 'phone'}
                      className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary transition-colors" />
                  </div>
                </div>
              ))}
              <div>
                <label className="text-sm font-medium text-dark mb-1.5 block">Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type={showPass ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange} placeholder="Min. 6 characters" required
                    className="w-full pl-11 pr-11 py-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary transition-colors" />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-dark">
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-dark mb-1.5 block">Confirm Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="Repeat password" required
                    className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary transition-colors" />
                </div>
              </div>

              <button type="submit" disabled={loading} className="w-full btn-primary py-3 text-center disabled:opacity-60">
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
              Already have an account?{' '}
              <Link href="/account/login" className="text-primary font-semibold hover:underline">Sign In</Link>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
