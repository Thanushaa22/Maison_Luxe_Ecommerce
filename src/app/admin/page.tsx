'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, ResponsiveContainer
} from 'recharts';
import {
  LayoutDashboard, Package, ShoppingCart, Users, Tag, BarChart3,
  TrendingUp, TrendingDown, DollarSign, Package as PackageIcon, AlertTriangle,
  Plus, Search, Edit, Trash2, ChevronDown, Eye,
} from 'lucide-react';

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  recentOrders: {
    id: string;
    total: number;
    status: string;
    createdAt: string;
    user?: { name: string; email: string };
    items?: { quantity: number; price: number }[];
  }[];
  monthlyRevenue: { month: string; revenue: number }[];
  bestSelling?: { id: string; name: string; totalSold: number }[];
  lowStockProducts: { id: string; name: string; stock: number }[];
}

const sidebarItems = [
  { label: 'Dashboard', icon: LayoutDashboard, key: 'dashboard' },
  { label: 'Products', icon: Package, key: 'products' },
  { label: 'Orders', icon: ShoppingCart, key: 'orders' },
  { label: 'Customers', icon: Users, key: 'customers' },
  { label: 'Coupons', icon: Tag, key: 'coupons' },
  { label: 'Analytics', icon: BarChart3, key: 'analytics' },
];

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-500/20 text-yellow-400',
  PROCESSING: 'bg-blue-500/20 text-blue-400',
  SHIPPED: 'bg-purple-500/20 text-purple-400',
  DELIVERED: 'bg-green-500/20 text-green-400',
  CANCELLED: 'bg-red-500/20 text-red-400',
};

const pieColors = ['#d4a843', '#f0d78c', '#b8941f', '#8b6914', '#ffd633', '#5c4a12'];

export default function AdminPage() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      window.location.href = '/auth';
      return;
    }
    fetch('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => {
        if (data.user?.role === 'ADMIN') {
          setIsAuthorized(true);
        } else {
          window.location.href = '/dashboard';
        }
      })
      .catch(() => { window.location.href = '/auth'; });
  }, []);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const res = await fetch('/api/admin/stats', {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!res.ok) throw new Error('Unauthorized');
        const data = await res.json();
        setStats(data.stats);
      } catch {
        setStats(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = stats
    ? [
        { label: 'Total Revenue', value: `₹${(stats.totalRevenue / 100000).toFixed(1)}L`, change: '+12.5%', up: true, icon: DollarSign },
        { label: 'Total Orders', value: stats.totalOrders.toLocaleString(), change: '+8.2%', up: true, icon: ShoppingCart },
        { label: 'Total Customers', value: stats.totalCustomers.toLocaleString(), change: '+15.3%', up: true, icon: Users },
        { label: 'Total Products', value: stats.totalProducts.toString(), change: '+3', up: true, icon: PackageIcon },
      ]
    : [];

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass rounded-xl p-5"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <stat.icon size={18} className="text-amber-500" />
              </div>
              <div className={`flex items-center gap-1 text-xs font-body ${stat.up ? 'text-green-400' : 'text-red-400'}`}>
                {stat.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {stat.change}
              </div>
            </div>
            <p className="text-2xl font-display text-amber-500">{stat.value}</p>
            <p className="text-white/40 text-xs font-body tracking-wider mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Revenue Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass rounded-xl p-6"
      >
        <h3 className="font-display text-lg text-white mb-6">Revenue Overview</h3>
        <div className="h-64">
          {stats?.monthlyRevenue?.length > 0 && (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.monthlyRevenue}>
                <defs>
                  <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#d4a843" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#d4a843" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" stroke="rgba(255,255,255,0.3)" fontSize={12} />
                <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} tickFormatter={(v) => `₹${v / 1000}K`} />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(10,10,10,0.9)',
                    border: '1px solid rgba(212,168,67,0.2)',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                  formatter={(value: number) => [`₹${value.toLocaleString('en-IN')}`, 'Revenue']}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#d4a843"
                  strokeWidth={2}
                  fill="url(#goldGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 glass rounded-xl p-6"
        >
          <h3 className="font-display text-lg text-white mb-6">Recent Orders</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left text-xs text-white/40 font-body tracking-wider pb-3 uppercase">Order ID</th>
                  <th className="text-left text-xs text-white/40 font-body tracking-wider pb-3 uppercase">Customer</th>
                  <th className="text-left text-xs text-white/40 font-body tracking-wider pb-3 uppercase">Total</th>
                  <th className="text-left text-xs text-white/40 font-body tracking-wider pb-3 uppercase">Status</th>
                  <th className="text-left text-xs text-white/40 font-body tracking-wider pb-3 uppercase">Date</th>
                </tr>
              </thead>
              <tbody>
                {stats?.recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 text-sm font-body text-amber-500">{order.id}</td>
                    <td className="py-3 text-sm font-body text-white/70">{order.user?.name || 'Unknown'}</td>
                    <td className="py-3 text-sm font-body text-white/70">₹{order.total.toLocaleString('en-IN')}</td>
                    <td className="py-3">
                      <span className={`text-xs font-body px-2.5 py-1 rounded-full ${statusColors[order.status] || 'bg-white/10 text-white/50'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 text-sm font-body text-white/50">{new Date(order.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Low Stock */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass rounded-xl p-6"
        >
          <h3 className="font-display text-lg text-white mb-6 flex items-center gap-2">
            <AlertTriangle size={16} className="text-amber-500" />
            Low Stock Alerts
          </h3>
          <div className="space-y-3">
            {stats?.lowStockProducts.map((product) => (
              <div key={product.id} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02]">
                <div>
                  <p className="text-sm font-body text-white/80">{product.name}</p>
                  <p className="text-xs font-body text-red-400">{product.stock} left in stock</p>
                </div>
                <button className="text-white/30 hover:text-amber-500 transition-colors">
                  <Edit size={14} />
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );

  const renderProducts = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-xl text-white">Products</h3>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-body font-semibold tracking-wider uppercase text-xs rounded-full hover:shadow-lg hover:shadow-amber-500/30 transition-all">
          <Plus size={14} />
          Add Product
        </button>
      </div>
      <div className="glass rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left text-xs text-white/40 font-body tracking-wider p-4 uppercase">Product</th>
                <th className="text-left text-xs text-white/40 font-body tracking-wider p-4 uppercase">Brand</th>
                <th className="text-left text-xs text-white/40 font-body tracking-wider p-4 uppercase">Price</th>
                <th className="text-left text-xs text-white/40 font-body tracking-wider p-4 uppercase">Stock</th>
                <th className="text-left text-xs text-white/40 font-body tracking-wider p-4 uppercase">Status</th>
                <th className="text-right text-xs text-white/40 font-body tracking-wider p-4 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Noir Absolute', brand: 'MAISON LUXE', price: 12500, stock: 3, status: 'Low Stock' },
                { name: 'Velvet Oud', brand: 'MAISON LUXE', price: 18900, stock: 12, status: 'In Stock' },
                { name: 'Rose Elixir', brand: 'MAISON LUXE', price: 8500, stock: 2, status: 'Low Stock' },
                { name: 'Golden Amber', brand: 'MAISON LUXE', price: 15200, stock: 28, status: 'In Stock' },
                { name: 'Midnight Jasmine', brand: 'MAISON LUXE', price: 9800, stock: 15, status: 'In Stock' },
              ].map((product, i) => (
                <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500/10 to-amber-700/5 flex items-center justify-center flex-shrink-0">
                        <span className="text-amber-500/40 font-display text-xs">{product.name.charAt(0)}</span>
                      </div>
                      <span className="text-sm font-body text-white/80">{product.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm font-body text-white/50">{product.brand}</td>
                  <td className="p-4 text-sm font-body text-amber-500">₹{product.price.toLocaleString('en-IN')}</td>
                  <td className="p-4 text-sm font-body text-white/70">{product.stock}</td>
                  <td className="p-4">
                    <span className={`text-xs font-body px-2.5 py-1 rounded-full ${
                      product.stock <= 5 ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
                    }`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-white/30 hover:text-amber-500 transition-colors rounded-lg hover:bg-white/5">
                        <Edit size={14} />
                      </button>
                      <button className="p-2 text-white/30 hover:text-red-400 transition-colors rounded-lg hover:bg-white/5">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h3 className="font-display text-xl text-white">Orders</h3>
        <div className="flex gap-2">
          {['All', 'Pending', 'Processing', 'Shipped', 'Delivered'].map((tab) => (
            <button
              key={tab}
              className="px-4 py-2 text-xs font-body tracking-wider rounded-full border border-white/10 text-white/50 hover:border-amber-500/30 hover:text-white/80 transition-all first:border-amber-500/30 first:text-amber-500 first:bg-amber-500/10"
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
      <div className="glass rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left text-xs text-white/40 font-body tracking-wider p-4 uppercase">Order ID</th>
                <th className="text-left text-xs text-white/40 font-body tracking-wider p-4 uppercase">Customer</th>
                <th className="text-left text-xs text-white/40 font-body tracking-wider p-4 uppercase">Total</th>
                <th className="text-left text-xs text-white/40 font-body tracking-wider p-4 uppercase">Status</th>
                <th className="text-left text-xs text-white/40 font-body tracking-wider p-4 uppercase">Date</th>
                <th className="text-right text-xs text-white/40 font-body tracking-wider p-4 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {stats?.recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="p-4 text-sm font-body text-amber-500">{order.id}</td>
                  <td className="p-4 text-sm font-body text-white/70">{order.user?.name || 'Unknown'}</td>
                  <td className="p-4 text-sm font-body text-white/70">₹{order.total.toLocaleString('en-IN')}</td>
                  <td className="p-4">
                    <span className={`text-xs font-body px-2.5 py-1 rounded-full ${statusColors[order.status] || 'bg-white/10 text-white/50'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4 text-sm font-body text-white/50">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-white/30 hover:text-amber-500 transition-colors rounded-lg hover:bg-white/5">
                        <Eye size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderCustomers = () => (
    <div className="space-y-6">
      <h3 className="font-display text-xl text-white">Customers</h3>
      <div className="glass rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left text-xs text-white/40 font-body tracking-wider p-4 uppercase">Customer</th>
                <th className="text-left text-xs text-white/40 font-body tracking-wider p-4 uppercase">Email</th>
                <th className="text-left text-xs text-white/40 font-body tracking-wider p-4 uppercase">Orders</th>
                <th className="text-left text-xs text-white/40 font-body tracking-wider p-4 uppercase">Total Spent</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Aarav Sharma', email: 'aarav@email.com', orders: 12, spent: 125000 },
                { name: 'Priya Patel', email: 'priya@email.com', orders: 8, spent: 89000 },
                { name: 'Rahul Mehta', email: 'rahul@email.com', orders: 15, spent: 210000 },
                { name: 'Sneha Gupta', email: 'sneha@email.com', orders: 5, spent: 45000 },
                { name: 'Vikram Singh', email: 'vikram@email.com', orders: 22, spent: 380000 },
              ].map((customer, i) => (
                <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-500/20 to-amber-700/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-amber-500/60 font-display text-sm">{customer.name.charAt(0)}</span>
                      </div>
                      <span className="text-sm font-body text-white/80">{customer.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm font-body text-white/50">{customer.email}</td>
                  <td className="p-4 text-sm font-body text-white/70">{customer.orders}</td>
                  <td className="p-4 text-sm font-body text-amber-500">₹{customer.spent.toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderCoupons = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-xl text-white">Coupons</h3>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-body font-semibold tracking-wider uppercase text-xs rounded-full hover:shadow-lg hover:shadow-amber-500/30 transition-all">
          <Plus size={14} />
          Add Coupon
        </button>
      </div>
      <div className="glass rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left text-xs text-white/40 font-body tracking-wider p-4 uppercase">Code</th>
                <th className="text-left text-xs text-white/40 font-body tracking-wider p-4 uppercase">Discount</th>
                <th className="text-left text-xs text-white/40 font-body tracking-wider p-4 uppercase">Validity</th>
                <th className="text-left text-xs text-white/40 font-body tracking-wider p-4 uppercase">Usage</th>
                <th className="text-right text-xs text-white/40 font-body tracking-wider p-4 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {[
                { code: 'LUXE10', discount: '10%', validity: 'Until Aug 31', usage: '145 / 500' },
                { code: 'WELCOME20', discount: '20%', validity: 'Until Sep 15', usage: '89 / 200' },
                { code: 'VIP50', discount: '₹500 off', validity: 'Until Dec 31', usage: '34 / 100' },
              ].map((coupon, i) => (
                <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="p-4">
                    <span className="text-sm font-body text-amber-500 font-semibold tracking-wider">{coupon.code}</span>
                  </td>
                  <td className="p-4 text-sm font-body text-white/70">{coupon.discount}</td>
                  <td className="p-4 text-sm font-body text-white/50">{coupon.validity}</td>
                  <td className="p-4 text-sm font-body text-white/70">{coupon.usage}</td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-white/30 hover:text-amber-500 transition-colors rounded-lg hover:bg-white/5">
                        <Edit size={14} />
                      </button>
                      <button className="p-2 text-white/30 hover:text-red-400 transition-colors rounded-lg hover:bg-white/5">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <h3 className="font-display text-xl text-white">Analytics</h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="glass rounded-xl p-6">
          <h4 className="font-display text-lg text-white mb-4">Revenue Over Time</h4>
          <div className="h-64">
            {stats?.monthlyRevenue?.length > 0 && (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.monthlyRevenue}>
                  <defs>
                    <linearGradient id="goldGradient2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#d4a843" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#d4a843" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" stroke="rgba(255,255,255,0.3)" fontSize={12} />
                  <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} tickFormatter={(v) => `₹${v / 1000}K`} />
                  <Tooltip
                    contentStyle={{
                      background: 'rgba(10,10,10,0.9)',
                      border: '1px solid rgba(212,168,67,0.2)',
                      borderRadius: '8px',
                      color: '#fff',
                    }}
                    formatter={(value: number) => [`₹${value.toLocaleString('en-IN')}`, 'Revenue']}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#d4a843" strokeWidth={2} fill="url(#goldGradient2)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Category Distribution */}
        <div className="glass rounded-xl p-6">
          <h4 className="font-display text-lg text-white mb-4">Category Distribution</h4>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Floral', value: 35 },
                    { name: 'Oriental', value: 25 },
                    { name: 'Woody', value: 20 },
                    { name: 'Fresh', value: 12 },
                    { name: 'Citrus', value: 5 },
                    { name: 'Aquatic', value: 3 },
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieColors.map((color, index) => (
                    <Cell key={index} fill={color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: 'rgba(10,10,10,0.9)',
                    border: '1px solid rgba(212,168,67,0.2)',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-3 gap-3 mt-4">
            {[
              { label: 'Floral', value: '35%', color: '#d4a843' },
              { label: 'Oriental', value: '25%', color: '#f0d78c' },
              { label: 'Woody', value: '20%', color: '#b8941f' },
              { label: 'Fresh', value: '12%', color: '#8b6914' },
              { label: 'Citrus', value: '5%', color: '#ffd633' },
              { label: 'Aquatic', value: '3%', color: '#5c4a12' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-xs font-body text-white/50">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Selling Products */}
      <div className="glass rounded-xl p-6">
        <h4 className="font-display text-lg text-white mb-4">Top Selling Products</h4>
        <div className="space-y-3">
          {[
            { name: 'Noir Absolute', sold: 89, revenue: 1112500 },
            { name: 'Velvet Oud', sold: 72, revenue: 1360800 },
            { name: 'Rose Elixir', sold: 65, revenue: 552500 },
            { name: 'Golden Amber', sold: 58, revenue: 881600 },
            { name: 'Midnight Jasmine', sold: 45, revenue: 441000 },
          ].map((product, i) => (
            <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-white/[0.02]">
              <span className="text-amber-500/40 font-display text-lg w-8">#{i + 1}</span>
              <div className="flex-1">
                <p className="text-sm font-body text-white/80">{product.name}</p>
                <p className="text-xs font-body text-white/40">{product.sold} units sold</p>
              </div>
              <p className="text-sm font-body text-amber-500">₹{product.revenue.toLocaleString('en-IN')}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const sections: Record<string, () => React.ReactNode> = {
    dashboard: renderDashboard,
    products: renderProducts,
    orders: renderOrders,
    customers: renderCustomers,
    coupons: renderCoupons,
    analytics: renderAnalytics,
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-luxury-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-amber-500/70 font-body text-sm tracking-wider">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-luxury-bg pt-20">
      <div className="flex">
        {/* Mobile Sidebar Toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden fixed top-24 left-4 z-50 p-2 glass rounded-lg text-white/70"
        >
          <LayoutDashboard size={18} />
        </button>

        {/* Sidebar */}
        <AnimatePresence>
          {(sidebarOpen || true) && (
            <motion.aside
              initial={{ x: -256 }}
              animate={{ x: 0 }}
              className={`fixed lg:sticky top-20 left-0 bottom-0 w-64 glass-dark border-r border-white/5 z-40 p-6 pt-8 overflow-y-auto ${
                sidebarOpen ? 'block' : 'hidden lg:block'
              }`}
            >
              <div className="mb-8">
                <h2 className="font-display text-lg text-gradient-gold">Admin Panel</h2>
                <p className="text-white/30 text-xs font-body tracking-wider mt-1">MAISON LUXE</p>
              </div>
              <nav className="space-y-1">
                {sidebarItems.map((item) => (
                  <button
                    key={item.key}
                    onClick={() => {
                      setActiveSection(item.key);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-body tracking-wider transition-all duration-200 ${
                      activeSection === item.key
                        ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                        : 'text-white/40 hover:text-white/70 hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    <item.icon size={16} />
                    {item.label}
                  </button>
                ))}
              </nav>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Backdrop for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8 min-h-[calc(100vh-5rem)]">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-12 h-12 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {sections[activeSection]?.()}
              </motion.div>
            </AnimatePresence>
          )}
        </main>
      </div>
    </div>
  );
}
