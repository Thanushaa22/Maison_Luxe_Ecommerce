"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[300] bg-black flex flex-col items-center justify-center"
        >
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative mb-12"
          >
            <svg width="60" height="100" viewBox="0 0 60 100" fill="none" className="opacity-30">
              <rect x="15" y="0" width="30" height="8" rx="2" fill="url(#gold)" />
              <rect x="22" y="8" width="16" height="12" fill="url(#gold)" />
              <rect x="5" y="20" width="50" height="75" rx="4" fill="url(#gold)" />
              <rect x="10" y="25" width="40" height="65" rx="2" fill="url(#gold)" opacity="0.5" />
              <defs>
                <linearGradient id="gold" x1="0" y1="0" x2="60" y2="100">
                  <stop stopColor="#D4AF37" />
                  <stop offset="1" stopColor="#B8860B" />
                </linearGradient>
              </defs>
            </svg>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-3xl md:text-4xl font-serif tracking-[0.4em] text-white mb-2">MAISON</h1>
            <h1 className="text-3xl md:text-4xl font-serif tracking-[0.4em] text-amber-400 font-light">LUXE</h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="absolute bottom-20 left-1/2 -translate-x-1/2 w-48"
          >
            <div className="h-px bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 2, ease: "easeInOut" }}
                className="h-full bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600"
              />
            </div>
          </motion.div>

          {Array.from({ length: 6 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: Math.random() * 200 - 100, y: Math.random() * 200 - 100 }}
              animate={{ opacity: [0, 0.6, 0], y: [0, -80] }}
              transition={{ duration: 2 + Math.random() * 2, delay: Math.random() * 1.5, repeat: Infinity, ease: "easeOut" }}
              className="absolute top-1/2 left-1/2 w-1 h-1 rounded-full bg-amber-400"
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
