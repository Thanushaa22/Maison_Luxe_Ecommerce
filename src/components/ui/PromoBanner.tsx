"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Truck } from "lucide-react";

export default function PromoBanner() {
  const [visible, setVisible] = useState(true);
  const [timeLeft, setTimeLeft] = useState({ h: 23, m: 59, s: 59 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { h, m, s } = prev;
        s--;
        if (s < 0) { s = 59; m--; }
        if (m < 0) { m = 59; h--; }
        if (h < 0) { h = 23; m = 59; s = 59; }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!visible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -40 }}
        animate={{ y: 0 }}
        exit={{ y: -40 }}
        className="relative bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-black text-center py-2 px-4 text-xs font-body tracking-wider z-[60]"
      >
        <div className="flex items-center justify-center gap-3">
          <Truck size={14} />
          <span className="font-semibold">FREE SHIPPING</span>
          <span>on orders above ₹10,000</span>
          <span className="hidden sm:inline">— Ends in</span>
          <span className="hidden sm:inline font-mono font-bold">
            {String(timeLeft.h).padStart(2, "0")}:{String(timeLeft.m).padStart(2, "0")}:{String(timeLeft.s).padStart(2, "0")}
          </span>
        </div>
        <button
          onClick={() => setVisible(false)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-black/60 hover:text-black transition-colors"
        >
          <X size={14} />
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
