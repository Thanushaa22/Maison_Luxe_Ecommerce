'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Package, Truck, CheckCircle, Clock, ChevronRight } from 'lucide-react';

interface Order {
  id: string;
  total: number;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  createdAt: string;
  items?: { name: string; quantity: number; size: string; price: number }[];
}

const statusConfig = {
  PENDING: { color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/20', icon: Clock, label: 'Pending' },
  PROCESSING: { color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20', icon: Package, label: 'Processing' },
  SHIPPED: { color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/20', icon: Truck, label: 'Shipped' },
  DELIVERED: { color: 'text-green-400', bg: 'bg-green-400/10', border: 'border-green-400/20', icon: CheckCircle, label: 'Delivered' },
  CANCELLED: { color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/20', icon: Package, label: 'Cancelled' },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const res = await fetch('/api/orders', {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setOrders(data.orders || []);
      } catch {
        setOrders([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-luxury-bg pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="font-display text-4xl md:text-5xl text-gradient-gold mb-4">My Orders</h1>
          <div className="w-20 h-[1px] bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto" />
        </motion.div>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="glass rounded-xl p-6 animate-pulse">
                <div className="h-6 bg-white/5 rounded w-1/4 mb-4" />
                <div className="h-4 bg-white/5 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center">
              <Package size={32} className="text-white/20" />
            </div>
            <h3 className="text-xl font-display text-white/60 mb-3">No orders yet</h3>
            <p className="text-white/40 font-body text-sm mb-8">Start shopping to see your orders here</p>
            <Link href="/collection">
              <button className="px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-body font-semibold tracking-wider uppercase text-sm rounded-full hover:shadow-lg hover:shadow-amber-500/30 transition-all">
                Browse Collection
              </button>
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, index) => {
              const config = statusConfig[order.status];
              const StatusIcon = config.icon;
              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="glass rounded-xl overflow-hidden hover:border-amber-500/20 transition-all duration-300"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-white font-display text-lg">{order.id}</p>
                        <p className="text-white/40 text-sm font-body">
                          {new Date(order.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                      </div>
                      <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${config.bg} border ${config.border}`}>
                        <StatusIcon size={14} className={config.color} />
                        <span className={`text-xs font-body tracking-wider ${config.color}`}>{config.label}</span>
                      </div>
                    </div>

                    {order.items && (
                      <div className="space-y-2 mb-4">
                        {order.items.map((item, i) => (
                          <div key={i} className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500/10 to-amber-700/5 border border-amber-500/10 flex items-center justify-center">
                                <span className="text-amber-500/40 font-display text-xs">{item.name.charAt(0)}</span>
                              </div>
                              <div>
                                <p className="text-white/80 font-body">{item.name}</p>
                                <p className="text-white/40 text-xs font-body">{item.size} x {item.quantity}</p>
                              </div>
                            </div>
                            <p className="text-white/60 font-body">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                      <p className="text-white/50 text-sm font-body">Total</p>
                      <p className="text-amber-400 font-display text-xl">₹{order.total.toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
