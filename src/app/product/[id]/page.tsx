'use client';

import { useState, useEffect, use } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useStore } from '@/store/useStore';
import { trackRecentlyViewed } from '@/components/ui/RecentlyViewed';
import { useToast } from '@/components/ui/Toast';

const ProductScene = dynamic(() => import('@/components/3d/ProductScene').then(mod => mod.default || mod), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-white/5 rounded-xl flex items-center justify-center">
      <div className="w-12 h-12 border-2 border-gold-500/30 border-t-gold-500 rounded-full animate-spin" />
    </div>
  ),
});

interface Review {
  id: string;
  user?: { name: string; email: string; avatar?: string };
  rating: number;
  comment: string;
  createdAt: string;
  helpful?: number;
  verified?: boolean;
}

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  comparePrice?: number;
  images: string[];
  video?: string;
  category: string;
  rating: number;
  reviewCount: number;
  description: string;
  longDescription?: string;
  sizes: string[];
  notes: {
    top: string[];
    middle: string[];
    base: string[];
  };
  details: {
    volume?: string;
    concentration?: string;
    longevity?: string;
    sillage?: string;
    season?: string;
    occasion?: string;
  };
  reviews?: Review[];
  slug: string;
  stock: number;
}

const tabs = ['Reviews', 'Notes', 'Details', 'Video'];

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('Reviews');
  const [isAddingToBag, setIsAddingToBag] = useState(false);
  const [addedToBag, setAddedToBag] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 0, comment: '' });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);
  const [notifyEmail, setNotifyEmail] = useState('');
  const [isNotifying, setIsNotifying] = useState(false);
  const [notified, setNotified] = useState(false);
  const cart = useStore((state) => state.cart);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${resolvedParams.id}`);
        const data = await res.json();
        const prod = data.product || data;
        setProduct(prod);

        const relRes = await fetch(`/api/products?category=${prod.category}&limit=4`);
        const relData = await relRes.json();
        setRelatedProducts(relData.products?.filter((p: Product) => p.id !== prod.id).slice(0, 4) || []);
        trackRecentlyViewed(prod);
      } catch {
        setProduct(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [resolvedParams.id]);

  const handleAddToBag = async () => {
    if (!product) return;
    setIsAddingToBag(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    cart.addItem(product as any, quantity, product.sizes[selectedSize]);
    setIsAddingToBag(false);
    setAddedToBag(true);
    showToast(`${product.name} added to bag`, "success", "cart");
    setTimeout(() => setAddedToBag(false), 3000);
  };

  const handleSubmitReview = async () => {
    if (!product || reviewForm.rating === 0 || reviewForm.comment.trim() === '') return;
    setIsSubmittingReview(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    const newReview: Review = {
      id: `review-${Date.now()}`,
      user: { name: 'You', email: 'user@example.com' },
      rating: reviewForm.rating,
      comment: reviewForm.comment,
      createdAt: new Date().toISOString(),
      helpful: 0,
      verified: true,
    };
    setProduct({
      ...product,
      reviews: [newReview, ...(product.reviews || [])],
      reviewCount: product.reviewCount + 1,
    });
    setReviewForm({ rating: 0, comment: '' });
    setIsSubmittingReview(false);
  };

  const getSizeMultiplier = (size: string) => {
    const ml = parseInt(size);
    if (ml <= 30) return 0.6;
    if (ml <= 50) return 1;
    return 1.8;
  };

  const getPriceForSize = (size: string) => {
    if (!product) return 0;
    return Math.round(product.price * getSizeMultiplier(size));
  };

  const getPricePerMl = (size: string) => {
    const ml = parseInt(size);
    const price = getPriceForSize(size);
    return ml > 0 ? Math.round(price / ml) : 0;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-luxury-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-2 border-gold-500/30 border-t-gold-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gold-500/70 font-body text-sm tracking-wider">Loading fragrance...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-luxury-bg flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-display text-3xl text-white mb-4">Product Not Found</h2>
          <Link href="/showroom">
            <button className="btn-luxury px-8 py-4 bg-gradient-gold text-black font-body font-semibold tracking-wider uppercase text-sm rounded-none">
              Return to Showroom
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-luxury-bg pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 text-sm font-body">
            <Link href="/" className="text-white/40 hover:text-gold-500 transition-colors">Home</Link>
            <span className="text-white/20">/</span>
            <Link href="/showroom" className="text-white/40 hover:text-gold-500 transition-colors">Showroom</Link>
            <span className="text-white/20">/</span>
            <span className="text-gold-500">{product.name}</span>
          </div>
        </motion.div>

        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 mb-24">
          {/* Left: Product Image / 3D Scene */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <div className="sticky top-24">
              {/* View Toggle */}
              <div className="flex gap-2 mb-3">
                <button
                  onClick={() => setSelectedImage(-1)}
                  className={`px-4 py-1.5 text-xs font-body tracking-wider rounded-lg transition-all ${
                    selectedImage === -1 ? 'bg-gold-500/20 text-gold-500 border border-gold-500/30' : 'text-white/40 hover:text-white/60 border border-white/10'
                  }`}
                >
                  3D View
                </button>
                <button
                  onClick={() => setSelectedImage(0)}
                  className={`px-4 py-1.5 text-xs font-body tracking-wider rounded-lg transition-all ${
                    selectedImage >= 0 ? 'bg-gold-500/20 text-gold-500 border border-gold-500/30' : 'text-white/40 hover:text-white/60 border border-white/10'
                  }`}
                >
                  Photo
                </button>
              </div>

              {/* Main Display */}
              <div className="relative aspect-square rounded-2xl overflow-hidden glass">
                {selectedImage === -1 ? (
                  <ProductScene productId={product.id} />
                ) : (
                  <>
                    <img
                      src={product.images[selectedImage] || product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => setLightboxOpen(true)}
                      className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-black/60 transition-all"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                      </svg>
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnail Images */}
              {product.images.length > 1 && (
                <div className="flex gap-3 mt-4">
                  {product.images.slice(0, 4).map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`w-20 h-20 rounded-lg border overflow-hidden transition-all duration-300 ${
                        selectedImage === index
                          ? 'border-gold-500/50 bg-gold-500/10'
                          : 'border-white/10 bg-white/5 hover:border-gold-500/30'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} view ${index + 1}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Right: Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col"
          >
            {/* Brand */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-gold-500 text-sm font-body tracking-[0.2em] uppercase mb-3"
            >
              {product.brand}
            </motion.p>

            {/* Name */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="font-display text-4xl md:text-5xl text-white mb-4 leading-tight"
            >
              {product.name}
            </motion.h1>

            {/* Rating */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex items-center gap-3 mb-6"
            >
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={`text-lg ${i < Math.floor(product.rating) ? 'text-gold-500' : 'text-white/20'}`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="text-white/50 text-sm font-body">
                {product.rating} ({product.reviewCount} reviews)
              </span>
            </motion.div>

            {/* Price */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex items-baseline gap-4 mb-8"
            >
              <span className="text-4xl text-gradient-gold font-display">
                ₹{getPriceForSize(product.sizes[selectedSize]).toLocaleString('en-IN')}
              </span>
              {product.comparePrice && (
                <span className="text-xl text-white/30 line-through font-body">
                  ₹{Math.round(product.comparePrice * getSizeMultiplier(product.sizes[selectedSize])).toLocaleString('en-IN')}
                </span>
              )}
              <span className="text-white/30 text-sm font-body">
                {product.sizes[selectedSize]}
              </span>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-white/60 font-body leading-relaxed mb-8"
            >
              {product.description}
            </motion.p>

            {/* Notes Preview */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="glass rounded-xl p-5 mb-8"
            >
              <h3 className="text-sm font-body tracking-wider text-gold-500 uppercase mb-4">Fragrance Notes</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-white/40 font-body uppercase tracking-wider mb-1">Top</p>
                  <p className="text-white/70 text-sm font-body">
                    {product.notes?.top?.slice(0, 2).join(', ') || '—'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-white/40 font-body uppercase tracking-wider mb-1">Heart</p>
                  <p className="text-white/70 text-sm font-body">
                    {product.notes?.middle?.slice(0, 2).join(', ') || '—'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-white/40 font-body uppercase tracking-wider mb-1">Base</p>
                  <p className="text-white/70 text-sm font-body">
                    {product.notes?.base?.slice(0, 2).join(', ') || '—'}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Size Selector */}
            {product.sizes && product.sizes.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="mb-8"
              >
                <h3 className="text-sm font-body tracking-wider text-white/60 uppercase mb-4">Select Size</h3>
                <div className="grid grid-cols-3 gap-3">
                  {product.sizes.map((size, index) => {
                    const price = getPriceForSize(size);
                    const pricePerMl = getPricePerMl(size);
                    const isSelected = selectedSize === index;
                    const ml = parseInt(size);
                    return (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(index)}
                        className={`relative p-4 border rounded-xl transition-all duration-300 text-left ${
                          isSelected
                            ? 'border-gold-500 bg-gold-500/10 shadow-lg shadow-gold-500/10'
                            : 'border-white/10 bg-white/5 hover:border-gold-500/30 hover:bg-white/10'
                        }`}
                      >
                        {isSelected && (
                          <motion.div
                            layoutId="sizeIndicator"
                            className="absolute top-3 right-3 w-5 h-5 rounded-full bg-gold-500 flex items-center justify-center"
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3">
                              <path d="M20 6L9 17l-5-5" />
                            </svg>
                          </motion.div>
                        )}
                        <div className="flex items-baseline gap-1 mb-1">
                          <span className={`font-display text-xl ${isSelected ? 'text-gold-500' : 'text-white'}`}>
                            {ml}
                          </span>
                          <span className={`text-sm ${isSelected ? 'text-gold-500/70' : 'text-white/40'}`}>ml</span>
                        </div>
                        <p className={`font-body text-sm mb-1 ${isSelected ? 'text-gold-500' : 'text-white/70'}`}>
                          ₹{price.toLocaleString('en-IN')}
                        </p>
                        <p className={`text-xs ${isSelected ? 'text-gold-500/60' : 'text-white/30'}`}>
                          ₹{pricePerMl}/ml
                        </p>
                      </button>
                    );
                  })}
                </div>
                <p className="text-white/30 text-xs font-body mt-3">
                  {selectedSize === 0 ? 'Most affordable' : selectedSize === product.sizes.length - 1 ? 'Best value per ml' : 'Popular choice'}
                </p>
              </motion.div>
            )}

            {/* Quantity */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
              className="mb-8"
            >
              <h3 className="text-sm font-body tracking-wider text-white/60 uppercase mb-4">Quantity</h3>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 border border-white/10 flex items-center justify-center text-white/60 hover:border-gold-500/30 hover:text-gold-500 transition-all"
                >
                  −
                </button>
                <span className="w-12 text-center text-white font-body">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-12 h-12 border border-white/10 flex items-center justify-center text-white/60 hover:border-gold-500/30 hover:text-gold-500 transition-all"
                >
                  +
                </button>
              </div>
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="space-y-4 mt-auto"
            >
              <button
                onClick={handleAddToBag}
                disabled={isAddingToBag}
                className="w-full btn-luxury py-5 bg-gradient-gold text-black font-body font-semibold tracking-wider uppercase text-sm rounded-none hover:glow-gold transition-all duration-300 disabled:opacity-50"
              >
                {isAddingToBag ? (
                  <span className="flex items-center justify-center gap-3">
                    <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    Adding...
                  </span>
                ) : addedToBag ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    Added to Bag
                  </span>
                ) : (
                  'Add to Bag'
                )}
              </button>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({ title: product.name, text: `Check out ${product.name} on MAISON LUXE`, url: window.location.href });
                    } else {
                      navigator.clipboard.writeText(window.location.href);
                    }
                  }}
                  className="py-4 border border-gold-500/30 text-gold-500 font-body font-semibold tracking-wider uppercase text-sm rounded-none hover:bg-gold-500/10 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                  </svg>
                  Share
                </button>
                <button className="py-4 border border-gold-500/30 text-gold-500 font-body font-semibold tracking-wider uppercase text-sm rounded-none hover:bg-gold-500/10 transition-all duration-300 flex items-center justify-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                  Wishlist
                </button>
              </div>

              {/* Back in Stock Notification */}
              {product.stock <= 0 && (
                <div className="glass rounded-xl p-4 mt-4">
                  <p className="text-white/60 font-body text-sm mb-3">This item is currently out of stock.</p>
                  {notified ? (
                    <p className="text-green-400 font-body text-sm">You will be notified when it&apos;s back.</p>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="email"
                        value={notifyEmail}
                        onChange={(e) => setNotifyEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="flex-1 px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-white text-sm font-body placeholder:text-white/30 focus:outline-none focus:border-gold-500/50"
                      />
                      <button
                        onClick={() => { if (notifyEmail) { setIsNotifying(true); setTimeout(() => { setIsNotifying(false); setNotified(true); }, 1000); } }}
                        disabled={isNotifying || !notifyEmail}
                        className="px-4 py-2 bg-gold-500 text-black text-sm font-body font-semibold rounded-lg hover:bg-gold-400 transition-colors disabled:opacity-50"
                      >
                        {isNotifying ? '...' : 'Notify'}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        </div>

        {/* Tabs Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mb-24"
        >
          {/* Tab Headers */}
          <div className="flex gap-8 border-b border-white/10 mb-8">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-sm font-body tracking-wider uppercase transition-all relative ${
                  activeTab === tab ? 'text-gold-500' : 'text-white/40 hover:text-white/60'
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-gold-500"
                  />
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {activeTab === 'Reviews' && (
              <motion.div
                key="reviews"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {/* Review Summary */}
                <div className="glass rounded-xl p-6 mb-8">
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
                    <div className="text-center">
                      <p className="font-display text-5xl text-gold-500 mb-2">{product.rating}</p>
                      <div className="flex gap-1 justify-center mb-1">
                        {[...Array(5)].map((_, i) => (
                          <span key={`summary-star-${i}`} className={`text-sm ${i < Math.floor(product.rating) ? 'text-gold-500' : 'text-white/20'}`}>★</span>
                        ))}
                      </div>
                      <p className="text-white/40 text-sm font-body">{product.reviewCount} reviews</p>
                    </div>
                    <div className="flex-1 w-full">
                      {[5, 4, 3, 2, 1].map((stars) => {
                        const count = product.reviews?.filter(r => r.rating === stars).length || 0;
                        const pct = product.reviewCount > 0 ? (count / product.reviewCount) * 100 : 0;
                        return (
                          <div key={stars} className="flex items-center gap-3 mb-1">
                            <span className="text-white/40 text-xs font-body w-8">{stars} ★</span>
                            <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                              <div className="h-full bg-gold-500 rounded-full" style={{ width: `${pct}%` }} />
                            </div>
                            <span className="text-white/30 text-xs font-body w-8 text-right">{count}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Write a Review */}
                <div className="glass-gold rounded-xl p-6 mb-8">
                  <h3 className="font-display text-lg text-gold-500 mb-4">Share Your Experience</h3>
                  <div className="mb-4">
                    <p className="text-white/60 text-sm font-body mb-2">Your Rating</p>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                          className="transition-transform hover:scale-110"
                        >
                          <span className={`text-2xl ${(hoverRating || reviewForm.rating) >= star ? 'text-gold-500' : 'text-white/20'}`}>★</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <textarea
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                    placeholder="Tell us about your experience with this fragrance..."
                    className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg text-white font-body placeholder:text-white/30 focus:outline-none focus:border-gold-500/50 transition-colors resize-none h-24"
                  />
                  <button
                    onClick={handleSubmitReview}
                    disabled={isSubmittingReview || reviewForm.rating === 0 || reviewForm.comment.trim() === ''}
                    className="mt-4 px-6 py-3 bg-gradient-gold text-black font-body font-semibold tracking-wider uppercase text-sm rounded-lg hover:shadow-lg hover:shadow-amber-500/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmittingReview ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                        Submitting...
                      </span>
                    ) : 'Submit Review'}
                  </button>
                </div>

                {/* Reviews List */}
                {product.reviews && product.reviews.length > 0 ? (
                  <div className="space-y-4">
                    {product.reviews.map((review) => (
                      <motion.div
                        key={review.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass rounded-xl p-6"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500/30 to-amber-700/10 border border-amber-500/20 flex items-center justify-center">
                              <span className="font-display text-sm text-amber-500">
                                {(review.user?.name || 'A')[0]}
                              </span>
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="text-white font-body text-sm">{review.user?.name || 'Anonymous'}</p>
                                {review.verified && (
                                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 font-body">
                                    Verified
                                  </span>
                                )}
                              </div>
                              <p className="text-white/30 text-xs font-body">
                                {new Date(review.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <span key={`star-${review.id}-${i}`} className={`text-sm ${i < review.rating ? 'text-gold-500' : 'text-white/15'}`}>★</span>
                            ))}
                          </div>
                        </div>
                        <p className="text-white/60 font-body leading-relaxed text-sm">{review.comment}</p>
                        {review.helpful !== undefined && (
                          <div className="mt-4 pt-3 border-t border-white/5 flex items-center gap-4">
                            <button className="text-white/30 hover:text-gold-500 text-xs font-body transition-colors flex items-center gap-1">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                              </svg>
                              Helpful ({review.helpful})
                            </button>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 glass rounded-2xl">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/30">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                      </svg>
                    </div>
                    <p className="text-white/40 font-body">No reviews yet. Be the first to share your experience.</p>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'Notes' && (
              <motion.div
                key="notes"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="glass-gold rounded-xl p-8">
                    <div className="w-12 h-12 rounded-full bg-gold-500/10 flex items-center justify-center mb-4">
                      <span className="font-display text-sm text-gold-500/70">I</span>
                    </div>
                    <h3 className="font-display text-xl text-gold-500 mb-4">Top Notes</h3>
                    <p className="text-xs text-white/40 font-body uppercase tracking-wider mb-3">First impression — 15 minutes</p>
                    <div className="space-y-2">
                      {product.notes?.top?.map((note) => (
                        <p key={note} className="text-white/70 font-body">{note}</p>
                      )) || <p className="text-white/40 font-body">—</p>}
                    </div>
                  </div>

                  <div className="glass-gold rounded-xl p-8">
                    <div className="w-12 h-12 rounded-full bg-gold-500/10 flex items-center justify-center mb-4">
                      <span className="font-display text-sm text-gold-500/70">II</span>
                    </div>
                    <h3 className="font-display text-xl text-gold-500 mb-4">Heart Notes</h3>
                    <p className="text-xs text-white/40 font-body uppercase tracking-wider mb-3">The core — 30 minutes to 4 hours</p>
                    <div className="space-y-2">
                      {product.notes?.middle?.map((note) => (
                        <p key={note} className="text-white/70 font-body">{note}</p>
                      )) || <p className="text-white/40 font-body">—</p>}
                    </div>
                  </div>

                  <div className="glass-gold rounded-xl p-8">
                    <div className="w-12 h-12 rounded-full bg-gold-500/10 flex items-center justify-center mb-4">
                      <span className="font-display text-sm text-gold-500/70">III</span>
                    </div>
                    <h3 className="font-display text-xl text-gold-500 mb-4">Base Notes</h3>
                    <p className="text-xs text-white/40 font-body uppercase tracking-wider mb-3">The foundation — 4+ hours</p>
                    <div className="space-y-2">
                      {product.notes?.base?.map((note) => (
                        <p key={note} className="text-white/70 font-body">{note}</p>
                      )) || <p className="text-white/40 font-body">—</p>}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'Details' && (
              <motion.div
                key="details"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="glass rounded-xl overflow-hidden">
                  <table className="w-full">
                    <tbody>
                      {product.details?.volume && (
                        <tr className="border-b border-white/5">
                          <td className="px-6 py-4 text-sm font-body text-white/40 w-1/3">Volume</td>
                          <td className="px-6 py-4 text-sm font-body text-white/80">{product.details.volume}</td>
                        </tr>
                      )}
                      {product.details?.concentration && (
                        <tr className="border-b border-white/5">
                          <td className="px-6 py-4 text-sm font-body text-white/40">Concentration</td>
                          <td className="px-6 py-4 text-sm font-body text-white/80">{product.details.concentration}</td>
                        </tr>
                      )}
                      {product.details?.longevity && (
                        <tr className="border-b border-white/5">
                          <td className="px-6 py-4 text-sm font-body text-white/40">Longevity</td>
                          <td className="px-6 py-4 text-sm font-body text-white/80">{product.details.longevity}</td>
                        </tr>
                      )}
                      {product.details?.sillage && (
                        <tr className="border-b border-white/5">
                          <td className="px-6 py-4 text-sm font-body text-white/40">Sillage</td>
                          <td className="px-6 py-4 text-sm font-body text-white/80">{product.details.sillage}</td>
                        </tr>
                      )}
                      {product.details?.season && (
                        <tr className="border-b border-white/5">
                          <td className="px-6 py-4 text-sm font-body text-white/40">Best Season</td>
                          <td className="px-6 py-4 text-sm font-body text-white/80">{product.details.season}</td>
                        </tr>
                      )}
                      {product.details?.occasion && (
                        <tr>
                          <td className="px-6 py-4 text-sm font-body text-white/40">Occasion</td>
                          <td className="px-6 py-4 text-sm font-body text-white/80">{product.details.occasion}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activeTab === 'Video' && (
              <motion.div
                key="video"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {product.video ? (
                  <div className="rounded-2xl overflow-hidden glass">
                    <video
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="w-full aspect-video object-cover"
                    >
                      <source src={product.video} type="video/mp4" />
                    </video>
                  </div>
                ) : (
                  <div className="text-center py-16 glass rounded-2xl">
                    <p className="text-white/40 font-body">No video available for this fragrance yet.</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <div className="text-center mb-12">
              <p className="text-gold-500 text-sm tracking-[0.3em] uppercase mb-4 font-body">
                You May Also Love
              </p>
              <h2 className="font-display text-3xl text-gradient-gold">Related Fragrances</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relProduct, index) => (
                <motion.div
                  key={relProduct.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                >
                  <Link href={`/product/${relProduct.id}`}>
                    <div className="glass rounded-xl overflow-hidden group cursor-pointer transition-all duration-300 hover:glow-gold">
                      <div className="aspect-square bg-white/5 relative overflow-hidden">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-16 h-24 bg-gradient-to-b from-amber-400/20 to-amber-700/10 rounded-t-full rounded-b-sm border border-amber-500/20 group-hover:opacity-40 transition-opacity opacity-20" />
                        </div>
                        {relProduct.images?.[0] && (
                          <img
                            src={relProduct.images[0]}
                            alt={relProduct.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        )}
                      </div>
                      <div className="p-5">
                        <p className="text-gold-500/70 text-xs font-body tracking-wider uppercase mb-1">
                          {relProduct.brand}
                        </p>
                        <p className="text-white font-display text-lg mb-2 group-hover:text-gold-500 transition-colors">
                          {relProduct.name}
                        </p>
                        <p className="text-gradient-gold font-body font-semibold">
                          ₹{relProduct.price.toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Image Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4"
            onClick={() => setLightboxOpen(false)}
          >
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={product.images[selectedImage >= 0 ? selectedImage : 0]}
              alt={product.name}
              className="max-w-full max-h-[85vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
            {product.images.length > 1 && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={(e) => { e.stopPropagation(); setSelectedImage(i); }}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      (selectedImage >= 0 ? selectedImage : 0) === i ? 'border-gold-500' : 'border-white/20'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
