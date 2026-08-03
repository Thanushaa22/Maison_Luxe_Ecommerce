'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { SlidersHorizontal, X, ChevronDown, ChevronUp, Search } from 'lucide-react';

const ProductCard = dynamic(() => import('@/components/ui/ProductCard'), {
  ssr: false,
  loading: () => <div className="h-80 glass rounded-xl animate-pulse" />,
});

const ScrollReveal = dynamic(() => import('@/components/ui/ScrollReveal').then(m => m.default || m), {
  ssr: false,
});

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  comparePrice?: number;
  images: string[];
  category: string;
  rating: number;
  reviewCount: number;
}

const categories = ['Floral', 'Oriental', 'Woody', 'Fresh', 'Citrus', 'Aquatic'];
const priceRanges = [
  { label: 'Under ₹5,000', min: 0, max: 5000 },
  { label: '₹5,000 – ₹10,000', min: 5000, max: 10000 },
  { label: '₹10,000 – ₹15,000', min: 10000, max: 15000 },
  { label: 'Above ₹15,000', min: 15000, max: Infinity },
];
const sortOptions = [
  { label: 'Featured', value: 'featured' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Newest', value: 'newest' },
  { label: 'Rating', value: 'rating' },
];

function CollectionContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || '';

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialCategory ? [initialCategory] : []
  );
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState('featured');
  const [searchQuery, setSearchQuery] = useState('');

  const [expandedSections, setExpandedSections] = useState({
    category: true,
    price: true,
    sort: true,
  });

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', page.toString());
      params.set('limit', '12');
      if (sortBy) params.set('sort', sortBy);
      if (selectedCategories.length > 0) params.set('categories', selectedCategories.join(','));
      if (selectedPriceRanges.length > 0) {
        const ranges = selectedPriceRanges.map(i => priceRanges[i]);
        params.set('priceMin', Math.min(...ranges.map(r => r.min)).toString());
        params.set('priceMax', Math.max(...ranges.map(r => r.max === Infinity ? 999999 : r.max)).toString());
      }
      if (searchQuery) params.set('search', searchQuery);

      const res = await fetch(`/api/products?${params.toString()}`);
      const data = await res.json();
      setProducts(data.products || []);
      setTotalPages(data.totalPages || 1);
    } catch {
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, [page, sortBy, selectedCategories, selectedPriceRanges, searchQuery]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    setPage(1);
  }, [selectedCategories, selectedPriceRanges, sortBy, searchQuery]);

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const togglePriceRange = (index: number) => {
    setSelectedPriceRanges(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedPriceRanges([]);
    setSortBy('featured');
    setSearchQuery('');
  };

  const hasActiveFilters = selectedCategories.length > 0 || selectedPriceRanges.length > 0 || searchQuery.length > 0;

  const FilterSection = ({
    title,
    sectionKey,
    children,
  }: {
    title: string;
    sectionKey: keyof typeof expandedSections;
    children: React.ReactNode;
  }) => (
    <div className="border-b border-white/5 pb-5 mb-5">
      <button
        onClick={() => toggleSection(sectionKey)}
        className="flex items-center justify-between w-full text-left mb-3"
      >
        <span className="text-sm font-body tracking-wider text-white/80 uppercase">{title}</span>
        {expandedSections[sectionKey] ? (
          <ChevronUp size={14} className="text-white/40" />
        ) : (
          <ChevronDown size={14} className="text-white/40" />
        )}
      </button>
      <AnimatePresence>
        {expandedSections[sectionKey] && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  const FilterSidebar = () => (
    <div className="space-y-1">
      {/* Search */}
      <div className="relative mb-6">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
        <input
          type="text"
          placeholder="Search fragrances..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-amber-500/50 transition-colors font-body"
        />
      </div>

      <FilterSection title="Category" sectionKey="category">
        <div className="space-y-2.5">
          {categories.map((cat) => (
            <label
              key={cat}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div
                className={`w-4 h-4 rounded border transition-all duration-200 flex items-center justify-center ${
                  selectedCategories.includes(cat)
                    ? 'bg-amber-500 border-amber-500'
                    : 'border-white/20 group-hover:border-amber-500/50'
                }`}
              >
                {selectedCategories.includes(cat) && (
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                )}
              </div>
              <span className="text-sm text-white/60 group-hover:text-white/80 transition-colors font-body">
                {cat}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Price Range" sectionKey="price">
        <div className="space-y-2.5">
          {priceRanges.map((range, index) => (
            <label
              key={range.label}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div
                className={`w-4 h-4 rounded border transition-all duration-200 flex items-center justify-center ${
                  selectedPriceRanges.includes(index)
                    ? 'bg-amber-500 border-amber-500'
                    : 'border-white/20 group-hover:border-amber-500/50'
                }`}
              >
                {selectedPriceRanges.includes(index) && (
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                )}
              </div>
              <span className="text-sm text-white/60 group-hover:text-white/80 transition-colors font-body">
                {range.label}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Sort By" sectionKey="sort">
        <div className="space-y-2.5">
          {sortOptions.map((opt) => (
            <label
              key={opt.value}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div
                className={`w-3 h-3 rounded-full border-2 transition-all duration-200 ${
                  sortBy === opt.value
                    ? 'border-amber-500 bg-amber-500'
                    : 'border-white/20 group-hover:border-amber-500/50'
                }`}
              />
              <span className="text-sm text-white/60 group-hover:text-white/80 transition-colors font-body">
                {opt.label}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {hasActiveFilters && (
        <button
          onClick={clearAllFilters}
          className="w-full py-2.5 text-sm text-amber-500/70 hover:text-amber-500 transition-colors font-body tracking-wider"
        >
          Clear All Filters
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-luxury-bg pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 text-sm font-body">
            <Link href="/" className="text-white/40 hover:text-gold-500 transition-colors">Home</Link>
            <span className="text-white/20">/</span>
            <span className="text-gold-500">Collection</span>
            {selectedCategories.length > 0 && (
              <>
                <span className="text-white/20">/</span>
                <span className="text-white/60">{selectedCategories.join(", ")}</span>
              </>
            )}
          </div>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-gradient-gold mb-4">
            The Collection
          </h1>
          <div className="w-20 h-[1px] bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto mb-6" />
          <p className="text-white/50 font-body text-sm tracking-wider">
            {products.length} {products.length === 1 ? 'fragrance' : 'fragrances'} found
          </p>
        </motion.div>

        {/* Mobile Filter Toggle */}
        <div className="lg:hidden mb-6">
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="flex items-center gap-2 px-5 py-3 glass rounded-lg text-white/70 hover:text-white transition-colors font-body text-sm"
          >
            <SlidersHorizontal size={16} />
            Filters
            {hasActiveFilters && (
              <span className="w-5 h-5 rounded-full bg-amber-500 text-black text-xs flex items-center justify-center font-semibold">
                {selectedCategories.length + selectedPriceRanges.length}
              </span>
            )}
          </button>
        </div>

        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="hidden lg:block w-64 flex-shrink-0"
          >
            <div className="sticky top-24 glass rounded-xl p-6">
              <h3 className="text-sm font-body tracking-wider text-amber-500 uppercase mb-6">
                Refine Selection
              </h3>
              <FilterSidebar />
            </div>
          </motion.aside>

          {/* Mobile Filter Drawer */}
          <AnimatePresence>
            {mobileFiltersOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/60 z-50 lg:hidden"
                  onClick={() => setMobileFiltersOpen(false)}
                />
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '-100%' }}
                  transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                  className="fixed top-0 left-0 bottom-0 w-80 bg-luxury-bg border-r border-white/10 z-50 p-6 overflow-y-auto lg:hidden"
                >
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-sm font-body tracking-wider text-amber-500 uppercase">
                      Filters
                    </h3>
                    <button
                      onClick={() => setMobileFiltersOpen(false)}
                      className="text-white/50 hover:text-white transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  <FilterSidebar />
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Product Grid */}
          <div className="flex-1 min-w-0">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="space-y-4">
                    <div className="aspect-[3/4] glass rounded-2xl animate-pulse" />
                    <div className="h-4 bg-white/5 rounded w-1/3" />
                    <div className="h-5 bg-white/5 rounded w-2/3" />
                    <div className="h-4 bg-white/5 rounded w-1/4" />
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-24"
              >
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center">
                  <Search size={32} className="text-white/20" />
                </div>
                <h3 className="text-xl font-display text-white/60 mb-3">No fragrances found</h3>
                <p className="text-white/40 font-body text-sm mb-8">
                  Try adjusting your filters or search terms
                </p>
                <button
                  onClick={clearAllFilters}
                  className="px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-body font-semibold tracking-wider uppercase text-sm rounded-full hover:shadow-lg hover:shadow-amber-500/30 transition-all"
                >
                  Clear Filters
                </button>
              </motion.div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product, index) => (
                    <ScrollReveal key={product.id} delay={index * 0.05}>
                      <ProductCard product={product} priority={index < 4} />
                    </ScrollReveal>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-12">
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="px-4 py-2 text-sm font-body text-white/50 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      Previous
                    </button>
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setPage(i + 1)}
                        className={`w-10 h-10 rounded-full text-sm font-body transition-all duration-200 ${
                          page === i + 1
                            ? 'bg-amber-500 text-black font-semibold'
                            : 'text-white/50 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="px-4 py-2 text-sm font-body text-white/50 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CollectionPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-luxury-bg flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-amber-500/70 font-body text-sm tracking-wider">Loading collection...</p>
          </div>
        </div>
      }
    >
      <CollectionContent />
    </Suspense>
  );
}
