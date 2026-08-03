'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, Loader2, Eye, EyeOff } from 'lucide-react';
import { useStore } from '@/store/useStore';

export default function AuthPage() {
  const router = useRouter();
  const user = useStore((s) => s.user.user);
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Login form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  if (user) {
    return (
      <div className="min-h-screen bg-luxury-bg pt-24 pb-16 px-4">
        <div className="max-w-md mx-auto text-center py-24">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
            <User size={32} className="text-amber-500" />
          </div>
          <h1 className="font-display text-2xl text-white mb-2">Welcome back, {user.name}</h1>
          <p className="text-white/40 font-body text-sm mb-8">{user.email}</p>
          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-body font-semibold tracking-wider uppercase text-sm rounded-full hover:shadow-lg hover:shadow-amber-500/30 transition-all"
            >
              Go to Homepage
            </motion.button>
          </Link>
        </div>
      </div>
    );
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      localStorage.setItem('auth_token', data.token);
      useStore.setState({ user: data.user });
      router.push('/');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (regPassword !== regConfirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: regName, email: regEmail, password: regPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');
      localStorage.setItem('auth_token', data.token);
      useStore.setState({ user: data.user });
      router.push('/');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white text-sm placeholder:text-white/30 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/50 font-body hover:border-white/20';

  return (
    <div className="min-h-screen bg-luxury-bg flex">
      {/* Left: Decorative Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900/30 via-luxury-bg to-luxury-bg" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(212,168,67,0.1),transparent_70%)]" />

        {/* Floating decorative elements */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 border border-amber-500/10 rounded-full" />
        <div className="absolute bottom-1/3 right-1/4 w-48 h-48 border border-amber-500/5 rounded-full" />
        <div className="absolute top-1/2 left-1/3 w-24 h-24 border border-amber-500/8 rounded-full" />

        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative z-10 text-center px-12"
        >
          <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
            <span className="font-display text-xl text-amber-500/70">ML</span>
          </div>
          <h2 className="font-display text-4xl text-gradient-gold mb-4">MAISON LUXE</h2>
          <p className="text-white/40 font-body text-sm tracking-wider leading-relaxed max-w-sm mx-auto">
            Discover the world&apos;s finest luxury perfumes, crafted for the discerning connoisseur
          </p>
        </motion.div>
      </div>

      {/* Right: Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <Link href="/">
              <span className="font-display text-2xl text-gradient-gold">MAISON LUXE</span>
            </Link>
          </div>

          <h1 className="font-display text-3xl text-white mb-2">
            {activeTab === 'login' ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-white/40 font-body text-sm mb-8">
            {activeTab === 'login'
              ? 'Sign in to access your collection'
              : 'Join the world of luxury fragrance'}
          </p>

          {/* Tabs */}
          <div className="flex mb-8 bg-white/5 rounded-full p-1">
            {(['login', 'register'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setError('');
                }}
                className={`flex-1 py-3 text-sm tracking-widest rounded-full transition-all duration-300 font-body ${
                  activeTab === tab
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black font-semibold'
                    : 'text-white/50 hover:text-white/80'
                }`}
              >
                {tab === 'login' ? 'SIGN IN' : 'REGISTER'}
              </button>
            ))}
          </div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl mb-6 font-body"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {activeTab === 'login' ? (
              <motion.form
                key="login"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                onSubmit={handleLogin}
                className="space-y-4"
              >
                <div>
                  <label className="block text-white/60 text-xs tracking-widest uppercase mb-2 font-body">
                    Email
                  </label>
                  <div className="relative">
                    <Mail size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                    <input
                      type="email"
                      placeholder="your@email.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className={`${inputClass} pl-11`}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-white/60 text-xs tracking-widest uppercase mb-2 font-body">
                    Password
                  </label>
                  <div className="relative">
                    <Lock size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className={`${inputClass} pl-11 pr-11`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                    >
                      {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="text-amber-400/60 text-xs hover:text-amber-400 transition-colors tracking-wider font-body"
                  >
                    Forgot password?
                  </button>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-semibold py-4 rounded-full tracking-widest text-sm transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/30 disabled:opacity-50 flex items-center justify-center gap-2 font-body"
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    'SIGN IN'
                  )}
                </motion.button>
              </motion.form>
            ) : (
              <motion.form
                key="register"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                onSubmit={handleRegister}
                className="space-y-4"
              >
                <div>
                  <label className="block text-white/60 text-xs tracking-widest uppercase mb-2 font-body">
                    Full Name
                  </label>
                  <div className="relative">
                    <User size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      className={`${inputClass} pl-11`}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-white/60 text-xs tracking-widest uppercase mb-2 font-body">
                    Email
                  </label>
                  <div className="relative">
                    <Mail size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                    <input
                      type="email"
                      placeholder="your@email.com"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className={`${inputClass} pl-11`}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-white/60 text-xs tracking-widest uppercase mb-2 font-body">
                    Password
                  </label>
                  <div className="relative">
                    <Lock size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className={`${inputClass} pl-11 pr-11`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                    >
                      {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-white/60 text-xs tracking-widest uppercase mb-2 font-body">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      className={`${inputClass} pl-11`}
                    />
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-semibold py-4 rounded-full tracking-widest text-sm transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/30 disabled:opacity-50 flex items-center justify-center gap-2 font-body"
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    'CREATE ACCOUNT'
                  )}
                </motion.button>
              </motion.form>
            )}
          </AnimatePresence>

          <p className="text-white/20 text-xs text-center mt-6 tracking-wider font-body">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>

          {/* Back to Home */}
          <div className="text-center mt-8">
            <Link href="/" className="text-white/30 hover:text-amber-500 transition-colors text-sm font-body">
              ← Back to Home
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
