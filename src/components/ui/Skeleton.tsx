"use client";

import { motion } from "framer-motion";

export function ProductCardSkeleton() {
  return (
    <div className="glass rounded-2xl overflow-hidden animate-pulse">
      <div className="aspect-[3/4] bg-white/5" />
      <div className="p-5 space-y-3">
        <div className="h-3 bg-white/5 rounded w-1/3" />
        <div className="h-5 bg-white/5 rounded w-2/3" />
        <div className="h-4 bg-white/5 rounded w-1/2" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(count)].map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <div className="h-screen bg-luxury-bg flex items-center justify-center">
      <div className="text-center space-y-6 px-4">
        <motion.div
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="h-4 bg-white/5 rounded w-48 mx-auto"
        />
        <motion.div
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
          className="h-16 bg-white/5 rounded w-96 mx-auto max-w-full"
        />
        <motion.div
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.4 }}
          className="h-6 bg-white/5 rounded w-64 mx-auto"
        />
      </div>
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div className="min-h-screen bg-luxury-bg pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="aspect-square glass rounded-2xl animate-pulse bg-white/5" />
          <div className="space-y-6">
            <div className="h-4 bg-white/5 rounded w-1/4 animate-pulse" />
            <div className="h-10 bg-white/5 rounded w-3/4 animate-pulse" />
            <div className="h-6 bg-white/5 rounded w-1/3 animate-pulse" />
            <div className="h-8 bg-white/5 rounded w-1/4 animate-pulse" />
            <div className="h-20 bg-white/5 rounded animate-pulse" />
            <div className="grid grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-24 bg-white/5 rounded-xl animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
