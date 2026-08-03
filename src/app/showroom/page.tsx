'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  comparePrice?: number | null;
  images: string[];
  category: string;
  rating: number;
  reviewCount: number;
  description: string;
  slug: string;
  stock: number;
  sizes: string[];
  notes: { top: string[]; middle: string[]; base: string[] };
}

function PerfumeCard3D({ product, index, onSelect }: { product: Product; index: number; onSelect: (p: Product) => void }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [8, -8]);
  const rotateY = useTransform(x, [-100, 100], [-8, 8]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) / 8);
    y.set((e.clientY - centerY) / 8);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 60, rotateY: -15 }}
      animate={{ opacity: 1, y: 0, rotateY: 0 }}
      transition={{ delay: 0.15 * index, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="flex-shrink-0 w-[220px] group cursor-pointer"
      onClick={() => onSelect(product)}
    >
      <motion.div
        style={{ rotateX, rotateY, perspective: 800 }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        whileHover={{ y: -12, scale: 1.02 }}
        transition={{ duration: 0.3 }}
        className="relative"
      >
        {/* Glow backdrop */}
        <div className="absolute -inset-4 bg-gradient-to-b from-amber-500/10 via-transparent to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-2xl" />

        {/* Card */}
        <div className="relative glass rounded-2xl overflow-hidden border border-white/5 group-hover:border-amber-500/20 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-amber-500/10">
          {/* Image container with 3D perspective */}
          <div className="relative h-64 overflow-hidden bg-gradient-to-br from-white/5 to-transparent">
            <div className="absolute inset-0 flex items-center justify-center">
              <img
                src={product.images?.[0]}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                style={{
                  transform: 'perspective(600px) rotateY(-2deg) rotateX(1deg)',
                  transformStyle: 'preserve-3d',
                }}
              />
            </div>

            {/* Reflection effect */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            {/* Floating badge */}
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-3 left-3 bg-black/40 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full"
            >
              <span className="text-amber-400 text-[10px] font-body tracking-wider uppercase">{product.category}</span>
            </motion.div>
          </div>

          {/* Info */}
          <div className="p-4">
            <p className="text-amber-400/70 text-[10px] font-body tracking-[0.2em] uppercase mb-1">
              {product.brand}
            </p>
            <h3 className="text-white font-serif text-sm tracking-wide mb-2 line-clamp-1">
              {product.name}
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-amber-400 font-serif text-sm font-semibold">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.comparePrice && (
                <span className="text-white/20 text-xs line-through">
                  ₹{product.comparePrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1 mt-2">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={`text-[10px] ${i < Math.floor(product.rating) ? 'text-amber-400' : 'text-white/15'}`}>★</span>
              ))}
              <span className="text-white/30 text-[10px] ml-1">({product.reviewCount})</span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function FloatingPerfume({ product, index }: { product: Product; index: number }) {
  return (
    <motion.div
      animate={{
        y: [0, -15, 0],
        rotateY: [0, 5, -5, 0],
      }}
      transition={{
        duration: 4 + index * 0.5,
        repeat: Infinity,
        ease: 'easeInOut',
        delay: index * 0.3,
      }}
      className="relative"
      style={{ perspective: 600 }}
    >
      <div className="relative w-32 h-44 group">
        <img
          src={product.images?.[0]}
          alt={product.name}
          className="w-full h-full object-cover rounded-xl shadow-2xl shadow-black/40 border border-white/10 transition-all duration-500 group-hover:shadow-amber-500/20 group-hover:border-amber-500/20"
          style={{
            transform: `perspective(400px) rotateY(${-8 + index * 3}deg) rotateX(2deg)`,
          }}
        />
        {/* Glow */}
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-24 h-8 bg-amber-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
    </motion.div>
  );
}

export default function ShowroomPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showPanel, setShowPanel] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products?limit=12');
        const data = await res.json();
        setProducts(data.products || []);
      } catch { setProducts([]); }
      setTimeout(() => setIsLoaded(true), 800);
    };
    fetchProducts();
  }, []);

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    setShowPanel(true);
  };

  return (
    <div className="min-h-screen bg-luxury-bg overflow-hidden">
      {/* Video Background */}
      <div className="fixed inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="w-full h-full object-cover opacity-30"
        >
          <source src="/images/products/hero-perfume.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-luxury-bg/80 via-luxury-bg/60 to-luxury-bg" />
      </div>

      {/* Loading State */}
      <AnimatePresence>
        {!isLoaded && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="fixed inset-0 z-50 bg-luxury-bg flex items-center justify-center"
          >
            <div className="text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                className="w-20 h-20 border-2 border-amber-500/30 border-t-amber-500 rounded-full mx-auto mb-6"
              />
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="font-display text-3xl text-gradient-gold mb-3"
              >
                Entering the Showroom
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-amber-500/50 font-body text-sm tracking-wider"
              >
                Preparing your immersive experience
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : -20 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative z-30 p-6"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/">
            <button className="glass px-6 py-3 text-white/80 hover:text-amber-400 transition-colors font-body text-sm tracking-wider flex items-center gap-3 rounded-full">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Back
            </button>
          </Link>
          <div className="glass px-8 py-3 rounded-full">
            <h1 className="font-display text-xl text-gradient-gold tracking-wider">The Showroom</h1>
          </div>
          <div className="glass px-6 py-3 rounded-full">
            <p className="text-white/40 text-xs font-body tracking-wider">Click to explore</p>
          </div>
        </div>
      </motion.div>

      {/* Hero Section - Floating Perfumes */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="relative z-10 py-12"
      >
        <div className="max-w-7xl mx-auto px-6">
          {/* Center stage - Featured perfume */}
          <div className="flex justify-center items-end gap-6 md:gap-10 mb-8">
            {products.slice(0, 5).map((product, index) => (
              <div key={product.id} className={index === 2 ? 'md:-mt-8' : ''}>
                <FloatingPerfume product={product} index={index} />
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-amber-500/30 to-transparent mb-12" />

          {/* Section title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="text-center mb-10"
          >
            <h2 className="font-display text-3xl md:text-4xl text-gradient-gold mb-3">The Collection</h2>
            <p className="text-white/40 font-body text-sm tracking-wider">Curated luxury — hover to feel the depth</p>
          </motion.div>

          {/* 3D Card Grid */}
          <div className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide px-4 justify-center flex-wrap lg:flex-nowrap">
            {products.map((product, index) => (
              <PerfumeCard3D
                key={product.id}
                product={product}
                index={index}
                onSelect={handleProductSelect}
              />
            ))}
          </div>
        </div>
      </motion.div>

      {/* Product Info Panel */}
      <AnimatePresence>
        {showPanel && selectedProduct && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              onClick={() => setShowPanel(false)}
            />
            <motion.div
              initial={{ opacity: 0, x: 100, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.95 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-md"
            >
              <div className="h-full bg-luxury-bg/95 backdrop-blur-2xl border-l border-white/5 p-8 flex flex-col">
                {/* Close */}
                <button
                  onClick={() => setShowPanel(false)}
                  className="absolute top-6 right-6 w-10 h-10 glass rounded-full flex items-center justify-center text-white/50 hover:text-amber-400 transition-colors"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>

                {/* Image */}
                <div className="relative h-72 mb-8 rounded-2xl overflow-hidden">
                  <img
                    src={selectedProduct.images?.[0]}
                    alt={selectedProduct.name}
                    className="w-full h-full object-cover"
                    style={{ transform: 'perspective(500px) rotateY(-3deg)' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-luxury-bg via-transparent to-transparent" />
                </div>

                {/* Info */}
                <div className="flex-1 overflow-y-auto">
                  <p className="text-amber-400/70 text-xs font-body tracking-[0.2em] uppercase mb-2">
                    {selectedProduct.brand}
                  </p>
                  <h2 className="font-display text-3xl text-white mb-3">{selectedProduct.name}</h2>

                  <div className="flex items-center gap-2 mb-5">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={`text-sm ${i < Math.floor(selectedProduct.rating) ? 'text-amber-400' : 'text-white/15'}`}>★</span>
                      ))}
                    </div>
                    <span className="text-white/40 text-sm font-body">({selectedProduct.rating})</span>
                  </div>

                  <div className="flex items-baseline gap-3 mb-6">
                    <span className="text-3xl text-gradient-gold font-display">₹{selectedProduct.price.toLocaleString('en-IN')}</span>
                    {selectedProduct.comparePrice && (
                      <span className="text-white/20 text-lg line-through">₹{selectedProduct.comparePrice.toLocaleString('en-IN')}</span>
                    )}
                  </div>

                  <p className="text-white/50 font-body text-sm leading-relaxed mb-8">{selectedProduct.description}</p>

                  {/* Notes */}
                  <div className="space-y-3 mb-8">
                    {[
                      { label: 'Top Notes', notes: selectedProduct.notes?.top },
                      { label: 'Heart Notes', notes: selectedProduct.notes?.middle },
                      { label: 'Base Notes', notes: selectedProduct.notes?.base },
                    ].map(({ label, notes }) => (
                      <div key={label} className="glass rounded-xl p-4">
                        <p className="text-amber-400/60 text-[10px] tracking-wider uppercase mb-1.5 font-body">{label}</p>
                        <p className="text-white/70 text-sm font-body">{notes?.join(', ') || '—'}</p>
                      </div>
                    ))}
                  </div>

                  {/* Sizes */}
                  <div className="flex gap-3 mb-8">
                    {selectedProduct.sizes.map((size) => (
                      <button key={size} className="px-5 py-2.5 border border-white/10 text-white/60 text-sm font-body hover:border-amber-500/30 hover:text-amber-400 transition-all rounded-lg">
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-3 pt-4 border-t border-white/5">
                  <Link href={`/product/${selectedProduct.id}`}>
                    <button className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-body font-semibold tracking-wider uppercase text-sm rounded-xl hover:shadow-lg hover:shadow-amber-500/30 transition-all duration-300">
                      View Full Details
                    </button>
                  </Link>
                  <button className="w-full py-4 border border-amber-500/30 text-amber-400 font-body font-semibold tracking-wider uppercase text-sm rounded-xl hover:bg-amber-500/10 transition-all duration-300">
                    Add to Bag
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
