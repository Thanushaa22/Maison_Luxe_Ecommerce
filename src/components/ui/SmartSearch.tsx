"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useStore } from "@/store/useStore";

interface SearchResult {
  id: string;
  name: string;
  brand: string;
  price: number;
  image?: string;
  category?: string;
}

export default function SmartSearch() {
  const isOpen = useStore((s) => s.ui.isSearchOpen);
  const setIsOpen = useStore((s) => s.ui.setSearchOpen);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(!isOpen);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, setIsOpen]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query.trim()) {
      setResults([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/ai/smart-search?q=${encodeURIComponent(query)}`
        );
        const data = await res.json();
        setResults(data.products ?? []);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-white/40 hover:text-white/60 hover:border-white/20 transition-all duration-300 text-sm"
      >
        <Search size={14} />
        <span className="hidden sm:inline">Search fragrances...</span>
        <kbd className="hidden sm:inline text-[10px] bg-white/10 px-1.5 py-0.5 rounded ml-2">
          ⌘K
        </kbd>
      </button>

      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-xl"
          >
            {/* Close button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>

            <div className="max-w-2xl mx-auto pt-24 px-4">
              {/* Search Input */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="relative">
                  <Search
                    size={22}
                    className="absolute left-6 top-1/2 -translate-y-1/2 text-amber-400/60"
                  />
                  <input
                    ref={inputRef}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Describe your perfect fragrance..."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-16 pr-6 py-5 text-white text-lg placeholder:text-white/30 focus:outline-none focus:border-amber-500/40 transition-colors"
                  />
                  {query && (
                    <button
                      onClick={() => setQuery("")}
                      className="absolute right-6 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors"
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>
              </motion.div>

              {/* Results */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mt-6 max-h-[60vh] overflow-y-auto space-y-2"
              >
                {loading && (
                  <div className="text-center py-12">
                    <div className="w-8 h-8 border-2 border-amber-400/30 border-t-amber-400 rounded-full animate-spin mx-auto" />
                    <p className="text-white/30 text-sm mt-4 tracking-wider">
                      Searching...
                    </p>
                  </div>
                )}

                {!loading && query && results.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-white/30 text-sm tracking-wider">
                      No fragrances found for &ldquo;{query}&rdquo;
                    </p>
                  </div>
                )}

                {!loading &&
                  results.map((product) => (
                    <Link
                      key={product.id}
                      href={`/product/${product.id}`}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-4 bg-white/5 border border-white/5 hover:border-amber-500/20 rounded-xl p-4 transition-all duration-300 group"
                    >
                      {product.image ? (
                        <div className="w-16 h-20 relative rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-20 rounded-lg bg-amber-500/10 flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-amber-400/60 text-xs tracking-widest uppercase">
                          {product.brand}
                        </p>
                        <h4 className="text-white font-serif tracking-wide group-hover:text-amber-400 transition-colors truncate">
                          {product.name}
                        </h4>
                        {product.category && (
                          <p className="text-white/20 text-xs mt-0.5">
                            {product.category}
                          </p>
                        )}
                      </div>
                      <span className="text-amber-400 font-serif text-lg flex-shrink-0">
                        ₹{product.price.toLocaleString("en-IN")}
                      </span>
                    </Link>
                  ))}

                {!loading && !query && (
                  <div className="text-center py-16">
                    <Search
                      size={40}
                      className="text-white/10 mx-auto mb-4"
                    />
                    <p className="text-white/30 text-sm tracking-wider">
                      Start typing to search our collection
                    </p>
                    <p className="text-white/15 text-xs mt-2">
                      Try &ldquo;warm evening scent&rdquo; or &ldquo;fresh
                      citrus&rdquo;
                    </p>
                  </div>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
