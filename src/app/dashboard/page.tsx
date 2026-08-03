'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Package, Heart, MapPin, User, Mail, Phone, Lock, Plus, Trash2, ChevronRight, Clock, Truck, CheckCircle, Star } from 'lucide-react';
import { useStore } from '@/store/useStore';

interface Order {
  id: string;
  total: number;
  status: string;
  createdAt: string;
  items: { product?: { name: string; images: string[] }; quantity: number; size: string; price: number }[];
}

interface Address {
  id: string;
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault: boolean;
}

const statusConfig: Record<string, { color: string; bg: string; icon: typeof Clock; label: string }> = {
  PENDING: { color: 'text-yellow-400', bg: 'bg-yellow-400/10', icon: Clock, label: 'Pending' },
  PROCESSING: { color: 'text-blue-400', bg: 'bg-blue-400/10', icon: Package, label: 'Processing' },
  SHIPPED: { color: 'text-purple-400', bg: 'bg-purple-400/10', icon: Truck, label: 'Shipped' },
  DELIVERED: { color: 'text-green-400', bg: 'bg-green-400/10', icon: CheckCircle, label: 'Delivered' },
  CANCELLED: { color: 'text-red-400', bg: 'bg-red-400/10', icon: Package, label: 'Cancelled' },
};

const tabs = [
  { key: 'orders', label: 'Orders', icon: Package },
  { key: 'profile', label: 'Profile', icon: User },
  { key: 'addresses', label: 'Addresses', icon: MapPin },
  { key: 'wishlist', label: 'Wishlist', icon: Heart },
];

export default function DashboardPage() {
  const user = useStore((s) => s.user.user);
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [wishlistItems, setWishlistItems] = useState<{ id: string; product: { id: string; name: string; brand: string; price: number; images: string[] } }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [profileName, setProfileName] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) { window.location.href = '/auth'; return; }
    setProfileName(user.name || '');
    setProfilePhone(user.phone || '');

    const token = localStorage.getItem('auth_token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    Promise.all([
      fetch('/api/orders', { headers }).then(r => r.json()).catch(() => ({ orders: [] })),
      fetch('/api/addresses', { headers }).then(r => r.json()).catch(() => ({ addresses: [] })),
      fetch('/api/wishlist', { headers }).then(r => r.json()).catch(() => ({ items: [] })),
    ]).then(([ordersData, addrData, wishData]) => {
      setOrders(ordersData.orders || []);
      setAddresses(addrData.addresses || []);
      setWishlistItems(wishData.items || []);
      setIsLoading(false);
    });
  }, [user]);

  const handleSaveProfile = async () => {
    setSaving(true);
    const token = localStorage.getItem('auth_token');
    await fetch('/api/auth/me', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name: profileName, phone: profilePhone }),
    });
    useStore.setState({ user: { ...user!, name: profileName, phone: profilePhone } });
    setSaving(false);
  };

  const handleAddAddress = async () => {
    const token = localStorage.getItem('auth_token');
    await fetch('/api/addresses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name: user?.name, phone: user?.phone || '', line1: '123 New St', city: 'Mumbai', state: 'Maharashtra', pincode: '400001', isDefault: addresses.length === 0 }),
    });
    const res = await fetch('/api/addresses', { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    setAddresses(data.addresses || []);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-luxury-bg pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <h1 className="font-display text-3xl md:text-4xl text-gradient-gold mb-2">My Dashboard</h1>
          <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-gold-500 to-transparent" />
          <p className="text-white/40 font-body text-sm mt-3">Welcome back, {user.name}</p>
        </motion.div>

        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-body tracking-wider transition-all whitespace-nowrap ${
                activeTab === tab.key
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black font-semibold'
                  : 'glass text-white/60 hover:text-white/80'
              }`}
            >
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="text-center py-20">
            <div className="w-10 h-10 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-white/40 text-sm tracking-wider">Loading...</p>
          </div>
        ) : (
          <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            {/* Orders */}
            {activeTab === 'orders' && (
              <div className="space-y-4">
                <h2 className="font-display text-xl text-white mb-4">Order History</h2>
                {orders.length === 0 ? (
                  <div className="glass rounded-xl p-12 text-center">
                    <Package size={40} className="text-white/10 mx-auto mb-4" />
                    <p className="text-white/40 mb-4">No orders yet</p>
                    <Link href="/collection" className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-black text-sm font-semibold rounded-full tracking-wider">
                      Browse Collection
                    </Link>
                  </div>
                ) : orders.map((order) => {
                  const cfg = statusConfig[order.status] || statusConfig.PENDING;
                  return (
                    <div key={order.id} className="glass rounded-xl p-5 hover:border-amber-500/20 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="text-white/40 text-xs font-body">Order #{order.id.slice(0, 8).toUpperCase()}</p>
                          <p className="text-white/30 text-xs mt-0.5">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                        </div>
                        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs ${cfg.bg} ${cfg.color}`}>
                          <cfg.icon size={12} />
                          {cfg.label}
                        </div>
                      </div>
                      <div className="space-y-2 mb-3">
                        {order.items.map((item, i) => (
                          <div key={i} className="flex items-center justify-between text-sm">
                            <span className="text-white/60">{item.product?.name || 'Product'} ({item.size}) x{item.quantity}</span>
                            <span className="text-amber-400 font-body">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-white/5">
                        <span className="text-white/40 text-xs">Total</span>
                        <span className="text-amber-400 font-display text-lg">₹{order.total.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Profile */}
            {activeTab === 'profile' && (
              <div className="max-w-lg space-y-6">
                <h2 className="font-display text-xl text-white mb-4">Edit Profile</h2>
                <div className="glass rounded-xl p-6 space-y-4">
                  <div>
                    <label className="text-white/40 text-xs font-body tracking-wider block mb-1.5">Email</label>
                    <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white/50 text-sm">
                      <Mail size={14} />
                      {user.email}
                    </div>
                  </div>
                  <div>
                    <label className="text-white/40 text-xs font-body tracking-wider block mb-1.5">Full Name</label>
                    <input value={profileName} onChange={(e) => setProfileName(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-amber-500/50 transition-colors" />
                  </div>
                  <div>
                    <label className="text-white/40 text-xs font-body tracking-wider block mb-1.5">Phone</label>
                    <input value={profilePhone} onChange={(e) => setProfilePhone(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-amber-500/50 transition-colors" />
                  </div>
                  <button onClick={handleSaveProfile} disabled={saving} className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-black text-sm font-semibold rounded-full tracking-wider disabled:opacity-50">
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            )}

            {/* Addresses */}
            {activeTab === 'addresses' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-xl text-white">Addresses</h2>
                  <button onClick={handleAddAddress} className="flex items-center gap-1.5 px-4 py-2 glass rounded-lg text-amber-400 text-sm hover:border-amber-500/30 transition-colors">
                    <Plus size={14} /> Add Address
                  </button>
                </div>
                {addresses.length === 0 ? (
                  <div className="glass rounded-xl p-12 text-center">
                    <MapPin size={40} className="text-white/10 mx-auto mb-4" />
                    <p className="text-white/40 mb-4">No addresses saved</p>
                    <button onClick={handleAddAddress} className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-black text-sm font-semibold rounded-full tracking-wider">
                      Add Address
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.map((addr) => (
                      <div key={addr.id} className={`glass rounded-xl p-5 ${addr.isDefault ? 'border-amber-500/30' : ''}`}>
                        <div className="flex items-start justify-between mb-2">
                          <p className="text-white font-body text-sm">{addr.name}</p>
                          {addr.isDefault && <span className="text-[10px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full">Default</span>}
                        </div>
                        <p className="text-white/40 text-xs leading-relaxed">
                          {addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}<br />
                          {addr.city}, {addr.state} {addr.pincode}<br />
                          {addr.country}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Wishlist */}
            {activeTab === 'wishlist' && (
              <div className="space-y-4">
                <h2 className="font-display text-xl text-white mb-4">My Wishlist</h2>
                {wishlistItems.length === 0 ? (
                  <div className="glass rounded-xl p-12 text-center">
                    <Heart size={40} className="text-white/10 mx-auto mb-4" />
                    <p className="text-white/40 mb-4">Your wishlist is empty</p>
                    <Link href="/collection" className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-black text-sm font-semibold rounded-full tracking-wider">
                      Discover Fragrances
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {wishlistItems.map((item) => (
                      <Link key={item.id} href={`/product/${item.product.id}`} className="glass rounded-xl p-4 hover:border-amber-500/20 transition-all group">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-20 rounded-lg bg-amber-500/10 flex-shrink-0 overflow-hidden">
                            {item.product.images?.[0] && (
                              <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-amber-400/60 text-xs tracking-widest uppercase">{item.product.brand}</p>
                            <h4 className="text-white font-serif text-sm group-hover:text-amber-400 transition-colors truncate">{item.product.name}</h4>
                            <p className="text-amber-400 font-body text-sm mt-1">₹{item.product.price.toLocaleString('en-IN')}</p>
                          </div>
                          <ChevronRight size={14} className="text-white/20 group-hover:text-amber-400 transition-colors" />
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
