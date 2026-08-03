"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

interface ViewedProduct {
  id: string;
  slug: string;
  name: string;
  brand: string;
  price: number;
  image: string;
}

export function trackRecentlyViewed(product: { id: string; slug?: string; name: string; brand: string; price: number; images: string[] }) {
  if (typeof window === "undefined") return;
  const key = "maison-luxe-recently-viewed";
  const existing: ViewedProduct[] = JSON.parse(localStorage.getItem(key) || "[]");
  const filtered = existing.filter((p) => p.id !== product.id);
  filtered.unshift({
    id: product.id,
    slug: product.slug || product.id,
    name: product.name,
    brand: product.brand,
    price: product.price,
    image: product.images?.[0] || "",
  });
  localStorage.setItem(key, JSON.stringify(filtered.slice(0, 8)));
}

export default function RecentlyViewed() {
  const [items, setItems] = useState<ViewedProduct[]>([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("maison-luxe-recently-viewed") || "[]");
    setItems(stored);
  }, []);

  if (items.length === 0) return null;

  return (
    <section className="relative py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-gold-500 text-sm tracking-[0.3em] uppercase mb-3 font-body">Browsed Recently</p>
          <h2 className="font-display text-3xl text-gradient-gold">Continue Exploring</h2>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {items.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link href={`/product/${item.slug || item.id}`}>
                <div className="flex-shrink-0 w-48 glass rounded-xl overflow-hidden group hover:border-gold-500/30 border border-white/10 transition-all">
                  <div className="aspect-square bg-white/5 relative overflow-hidden">
                    {item.image && (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-white/40 text-[10px] font-body tracking-wider uppercase">{item.brand}</p>
                    <p className="text-white text-sm font-display truncate">{item.name}</p>
                    <p className="text-gold-500 text-sm font-body">₹{item.price.toLocaleString("en-IN")}</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
