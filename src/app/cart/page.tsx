'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Minus, Plus, X, ShoppingBag, ArrowRight, Trash2 } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotal, getItemCount } = useCartStore();
  const [removingId, setRemovingId] = useState<string | null>(null);
  const total = getTotal();
  const itemCount = getItemCount();
  const freeShippingThreshold = 10000;
  const shippingCost = total >= freeShippingThreshold ? 0 : 500;

  const handleRemove = (productId: string) => {
    setRemovingId(productId);
    setTimeout(() => {
      removeItem(productId);
      setRemovingId(null);
    }, 300);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-luxury-bg pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-24"
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="w-28 h-28 mx-auto mb-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center"
            >
              <ShoppingBag size={40} className="text-white/20" />
            </motion.div>
            <h1 className="font-display text-3xl md:text-4xl text-white/80 mb-4">
              Your bag is awaiting its first treasure
            </h1>
            <p className="text-white/40 font-body text-sm tracking-wider mb-10 max-w-md mx-auto">
              Discover our curated collection of luxury fragrances and find your signature scent
            </p>
            <Link href="/collection">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="px-10 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-body font-semibold tracking-wider uppercase text-sm rounded-full hover:shadow-lg hover:shadow-amber-500/30 transition-all"
              >
                Start Shopping
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-luxury-bg pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="font-display text-4xl md:text-5xl text-gradient-gold mb-2">
            Shopping Bag
          </h1>
          <div className="w-16 h-[1px] bg-gradient-to-r from-amber-500 to-transparent mb-4" />
          <p className="text-white/40 font-body text-sm tracking-wider">
            {itemCount} {itemCount === 1 ? 'item' : 'items'} in your bag
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="flex-1">
            <AnimatePresence>
              {items.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: removingId === item.productId ? 0 : 1, y: removingId === item.productId ? -20 : 0 }}
                  exit={{ opacity: 0, x: -100, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="glass rounded-xl p-5 mb-4"
                >
                  <div className="flex gap-5">
                    {/* Product Image Placeholder */}
                    <div className="w-24 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-gradient-to-br from-amber-500/10 to-amber-700/5 border border-amber-500/10 flex items-center justify-center">
                      <span className="text-amber-500/40 font-display text-2xl">
                        {item.product.brand.charAt(0)}
                      </span>
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-amber-500/70 text-xs font-body tracking-wider uppercase mb-1">
                            {item.product.brand}
                          </p>
                          <h3 className="text-white font-display text-lg truncate">
                            {item.product.name}
                          </h3>
                          <p className="text-white/40 text-sm font-body mt-1">
                            Size: {item.size}
                          </p>
                        </div>
                        <button
                          onClick={() => handleRemove(item.productId)}
                          className="text-white/30 hover:text-red-400 transition-colors p-1 flex-shrink-0"
                        >
                          <X size={16} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-0 border border-white/10 rounded-full overflow-hidden">
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            className="w-9 h-9 flex items-center justify-center text-white/50 hover:text-amber-500 hover:bg-amber-500/10 transition-all"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-10 text-center text-white text-sm font-body">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            className="w-9 h-9 flex items-center justify-center text-white/50 hover:text-amber-500 hover:bg-amber-500/10 transition-all"
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <p className="text-amber-400 font-display text-lg">
                            ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                          </p>
                          {item.quantity > 1 && (
                            <p className="text-white/30 text-xs font-body">
                              ₹{item.product.price.toLocaleString('en-IN')} each
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Continue Shopping */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-6"
            >
              <Link
                href="/collection"
                className="inline-flex items-center gap-2 text-white/40 hover:text-amber-500 transition-colors text-sm font-body"
              >
                <ArrowRight size={14} className="rotate-180" />
                Continue Shopping
              </Link>
            </motion.div>
          </div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:w-96"
          >
            <div className="sticky top-24 glass rounded-xl p-6">
              <h2 className="font-display text-xl text-white mb-6">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm font-body">
                  <span className="text-white/50">Subtotal</span>
                  <span className="text-white/80">₹{total.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm font-body">
                  <span className="text-white/50">Shipping</span>
                  <span className={shippingCost === 0 ? 'text-green-400' : 'text-white/80'}>
                    {shippingCost === 0 ? 'Complimentary' : `₹${shippingCost}`}
                  </span>
                </div>
                {shippingCost > 0 && (
                  <p className="text-amber-500/60 text-xs font-body">
                    Add ₹{(freeShippingThreshold - total).toLocaleString('en-IN')} more for complimentary shipping
                  </p>
                )}
              </div>

              <div className="border-t border-white/10 pt-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-white font-body tracking-wider">Total</span>
                  <span className="text-amber-400 font-display text-2xl">
                    ₹{(total + shippingCost).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <Link href="/checkout">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-body font-semibold tracking-wider uppercase text-sm rounded-full hover:shadow-lg hover:shadow-amber-500/30 transition-all"
                >
                  Proceed to Checkout
                </motion.button>
              </Link>

              <div className="mt-6 pt-4 border-t border-white/5">
                <div className="flex items-center justify-center gap-4 text-white/20">
                  <svg width="32" height="20" viewBox="0 0 32 20" fill="none">
                    <rect width="32" height="20" rx="3" fill="currentColor" opacity="0.2" />
                    <text x="16" y="13" textAnchor="middle" fill="currentColor" fontSize="8" fontWeight="bold">VISA</text>
                  </svg>
                  <svg width="32" height="20" viewBox="0 0 32 20" fill="none">
                    <rect width="32" height="20" rx="3" fill="currentColor" opacity="0.2" />
                    <circle cx="12" cy="10" r="5" fill="#EB001B" opacity="0.6" />
                    <circle cx="20" cy="10" r="5" fill="#F79E1B" opacity="0.6" />
                  </svg>
                  <svg width="32" height="20" viewBox="0 0 32 20" fill="none">
                    <rect width="32" height="20" rx="3" fill="currentColor" opacity="0.2" />
                    <text x="16" y="13" textAnchor="middle" fill="currentColor" fontSize="7" fontWeight="bold">AMEX</text>
                  </svg>
                </div>
                <p className="text-white/20 text-xs text-center mt-3 font-body">
                  Secure checkout powered by Stripe
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
