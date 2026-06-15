'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Mail, Phone, MapPin, Package, LogOut, Edit3, Save, X, ChevronRight, ShoppingBag } from 'lucide-react';
import { useAuth } from '../../lib/CartContext';
import { api } from '../../lib/api';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const STATUS_COLORS = {
  payment_pending: 'bg-amber-100 text-amber-700',
  confirmed:       'bg-blue-100 text-blue-700',
  processing:      'bg-purple-100 text-purple-700',
  shipped:         'bg-indigo-100 text-indigo-700',
  out_for_delivery:'bg-orange-100 text-orange-700',
  delivered:       'bg-green-100 text-green-700',
  cancelled:       'bg-red-100 text-red-700',
};

export default function AccountClient() {
  const { user, login, logout, loading: authLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [form, setForm] = useState({ name: '', phone: '', address: '' });

  useEffect(() => {
    if (!authLoading && !user) router.push('/account/login?redirect=/account');
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;
    setForm({ name: user.name || '', phone: user.phone || '', address: user.address?.country || '' });
    api.getOrders().then((data) => setOrders(data?.data || [])).catch(() => {});
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await api.updateProfile(form);
      //console.log(updated?.data?.user);
      
      login(updated?.data?.user, localStorage.getItem('robo_token'));
      setSaveMsg('Profile updated!');
      setEditing(false);
      setTimeout(() => setSaveMsg(''), 3000);
    } catch (e) {
      setSaveMsg('Failed to save: ' + e.message);
    } finally { setSaving(false); }
  };

  const handleLogout = () => { logout(); router.push('/'); };

  if (authLoading || !user) return null;

  const deliveredCount = orders.filter(o => o.status === 'delivered').length;
  const pendingCount = orders.filter(o => !['delivered','cancelled'].includes(o.status)).length;
  const totalSpent = orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + (o.total || 0), 0);

  return (
    <main>
      <Navbar />
      <div className="container py-8 min-h-[70vh]">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left sidebar */}
          <div className="space-y-5">
            {/* Profile card */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-3">
                {user?.name?user?.name?.charAt(0).toUpperCase():"A"}
              </div>
              <h2 className="font-bold text-dark text-lg">{user?.name}</h2>
              <p className="text-gray-400 text-sm">{user?.email}</p>
              {user?.phone && <p className="text-gray-400 text-sm">{user.phone}</p>}
              <div className="mt-4 pt-4 border-t border-gray-100 flex justify-center">
                <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-gray-400 hover:text-accent transition-colors">
                  <LogOut size={14} /> Sign Out
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5">
              <h3 className="font-bold text-dark mb-4">My Stats</h3>
              <div className="space-y-3">
                {[
                  { label: 'Total Orders', value: orders.length, color: 'text-primary' },
                  { label: 'Delivered', value: deliveredCount, color: 'text-green-600' },
                  { label: 'Pending', value: pendingCount, color: 'text-amber-600' },
                  { label: 'Total Spent', value: '$' + totalSpent.toFixed(2), color: 'text-dark' },
                ].map(stat => (
                  <div key={stat.label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <span className="text-sm text-gray-500">{stat.label}</span>
                    <span className={`font-bold text-sm ${stat.color}`}>{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick links */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5">
              <h3 className="font-bold text-dark mb-3">Quick Links</h3>
              <div className="space-y-1">
                {[
                  { href: '/orders', label: 'My Orders', icon: Package },
                  { href: '/shop', label: 'Continue Shopping', icon: ShoppingBag },
                  { href: '/cart', label: 'View Cart', icon: ShoppingBag },
                ].map(({ href, label, icon: Icon }) => (
                  <Link key={href} href={href} className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Icon size={15} className="text-primary" /> {label}
                    </div>
                    <ChevronRight size={14} className="text-gray-300" />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile edit */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-dark text-lg flex items-center gap-2">
                  <User size={18} className="text-primary" /> Profile Information
                </h2>
                {!editing ? (
                  <button onClick={() => setEditing(true)} className="flex items-center gap-1.5 text-sm text-primary hover:underline font-medium">
                    <Edit3 size={14} /> Edit
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button onClick={() => { setEditing(false); setForm({ name: user.name, phone: user.phone || '', address: user.address || '' }); }} className="flex items-center gap-1 text-sm text-gray-400 hover:text-dark px-3 py-1.5 border border-gray-200 rounded-lg">
                      <X size={13} /> Cancel
                    </button>
                    <button onClick={handleSave} disabled={saving} className="flex items-center gap-1 text-sm btn-primary py-1.5 px-3">
                      <Save size={13} /> {saving ? 'Saving...' : 'Save'}
                    </button>
                  </div>
                )}
              </div>

              {saveMsg && <div className={`text-sm px-4 py-2.5 rounded-lg mb-4 ${saveMsg.includes('Failed') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>{saveMsg}</div>}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {[
                  { label: 'Full Name', key: 'name', icon: User, type: 'text', editable: true },
                  { label: 'Email', key: 'email', icon: Mail, type: 'email', editable: false, value: user.email },
                  { label: 'Phone', key: 'phone', icon: Phone, type: 'tel', editable: true },
                  { label: 'Address', key: 'address', icon: MapPin, type: 'text', editable: true },
                ].map(({ label, key, icon: Icon, type, editable, value }) => (
                  <div key={key}>
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                      <Icon size={12} /> {label}
                    </label>
                    {editing && editable ? (
                      <input type={type} value={form[key] || ''} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-primary" />
                    ) : (
                      <p className="text-sm text-dark font-medium py-2.5 px-3 bg-gray-50 rounded-lg">{value ?? form[key] ?? <span className="text-gray-300">Not set</span>}</p>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-5 pt-5 border-t border-gray-100">
                <p className="text-xs text-gray-400">Member since {new Date(user.createdAt || Date.now()).toLocaleDateString('en-BD', { month: 'long', year: 'numeric' })}</p>
              </div>
            </div>

            {/* Recent orders */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-dark text-lg flex items-center gap-2">
                  <Package size={18} className="text-primary" /> Recent Orders
                </h2>
                <Link href="/orders" className="text-sm text-primary hover:underline">View All →</Link>
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-10">
                  <Package size={36} className="mx-auto text-gray-200 mb-2" />
                  <p className="text-gray-400 text-sm">No orders yet</p>
                  <Link href="/shop" className="btn-primary text-sm py-2 px-5 mt-3 inline-block">Start Shopping</Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.slice(0, 5).map(order => (
                    <Link key={order.id} href={`/orders/${order.id}`}
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Package size={16} className="text-gray-400" />
                        </div>
                        <div>
                          <p className="font-semibold text-dark text-sm">#{order.orderNumber}</p>
                          <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString('en-BD', { month: 'short', day: 'numeric' })} · {order.items?.length} item{order.items?.length !== 1 ? 's' : ''}</p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-bold text-primary text-sm">${order.total?.toFixed(2)}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-600'}`}>
                          {order.status?.replace(/_/g, ' ')}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
