'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Heart } from 'lucide-react';
import { useStore } from '@/store/useStore';

const ProductCard = dynamic(() => import('@/components/ui/ProductCard'), {
  ssr: false,
  loading: () => <div className="h-80 glass rounded-xl animate-pulse" />,
});

const ScrollReveal = dynamic(() => import('@/components/ui/ScrollReveal').then(m => m.default || m), {
  ssr: false,
});

export default function WishlistPage() {
  const items = useStore((s) => s.wishlist.items);

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
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="w-28 h-28 mx-auto mb-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center"
            >
              <Heart size={40} className="text-white/20" />
            </motion.div>
            <h1 className="font-display text-3xl md:text-4xl text-white/80 mb-4">
              Your wishlist is empty
            </h1>
            <p className="text-white/40 font-body text-sm tracking-wider mb-10 max-w-md mx-auto">
              Save your favorite fragrances here and never lose sight of the scents you love
            </p>
            <Link href="/collection">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="px-10 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-body font-semibold tracking-wider uppercase text-sm rounded-full hover:shadow-lg hover:shadow-amber-500/30 transition-all"
              >
                Discover Fragrances
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
            Your Wishlist
          </h1>
          <div className="w-16 h-[1px] bg-gradient-to-r from-amber-500 to-transparent mb-4" />
          <p className="text-white/40 font-body text-sm tracking-wider">
            {items.length} {items.length === 1 ? 'fragrance' : 'fragrances'} saved
          </p>
        </motion.div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item, index) => (
            <ScrollReveal key={item.id} delay={index * 0.05}>
              <ProductCard product={item.product} />
            </ScrollReveal>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center mt-16"
        >
          <Link href="/collection">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="px-10 py-4 border border-amber-500/30 text-amber-500 font-body font-semibold tracking-wider uppercase text-sm rounded-full hover:bg-amber-500/10 transition-all"
            >
              Continue Exploring
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
