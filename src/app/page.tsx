'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Product } from '@/types';
import RecentlyViewed from '@/components/ui/RecentlyViewed';

const Scene = dynamic(() => import('@/components/3d/Scene').then(mod => mod.default || mod), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 bg-luxury-bg" />
  ),
});

const ScrollReveal = dynamic(() => import('@/components/ui/ScrollReveal').then(mod => mod.default || mod), {
  ssr: false,
});

const ProductGrid = dynamic(() => import('@/components/ui/ProductGrid').then(mod => mod.default || mod), {
  ssr: false,
  loading: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-80 glass rounded-xl animate-pulse" />
      ))}
    </div>
  ),
});

const categories = [
  { name: 'Floral', gradient: 'from-pink-500/20 to-rose-500/20', count: 24, icon: 'I' },
  { name: 'Oriental', gradient: 'from-amber-500/20 to-orange-500/20', count: 18, icon: 'II' },
  { name: 'Woody', gradient: 'from-emerald-700/20 to-amber-800/20', count: 15, icon: 'III' },
  { name: 'Fresh', gradient: 'from-cyan-400/20 to-blue-400/20', count: 21, icon: 'IV' },
  { name: 'Citrus', gradient: 'from-yellow-400/20 to-lime-400/20', count: 12, icon: 'V' },
  { name: 'Aquatic', gradient: 'from-blue-500/20 to-teal-400/20', count: 9, icon: 'VI' },
];

const testimonials = [
  {
    name: 'Victoria Sterling',
    title: 'Fragrance Connoisseur',
    text: 'MAISON LUXE has redefined my understanding of luxury fragrance. Each scent tells a story that transcends the ordinary.',
    rating: 5,
  },
  {
    name: 'Alexander Reed',
    title: 'Art Director',
    text: 'The attention to detail in every bottle is unmatched. This is not just perfume — it is wearable art of the highest caliber.',
    rating: 5,
  },
  {
    name: 'Isabelle Moreau',
    title: 'Fashion Editor',
    text: 'I have tried hundreds of niche fragrances. MAISON LUXE stands alone in its ability to evoke emotion and memory.',
    rating: 5,
  },
];

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);
  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, -50]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products?featured=true&limit=8');
        const data = await res.json();
        setProducts(data.products || []);
      } catch {
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="bg-luxury-bg text-white">
      {/* Hero Section */}
      <motion.section
        style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
        className="relative h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Video Background */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="w-full h-full object-cover"
          >
            <source src="/images/products/hero-perfume.mp4" type="video/mp4" />
          </video>
        </div>

        {/* Gradient Overlays */}
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/50 via-black/20 to-luxury-bg" />
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/40 via-transparent to-black/40" />
        <div className="absolute inset-0 z-10 bg-luxury-bg/30" />

        {/* Hero Content */}
        <div className="relative z-20 text-center px-4 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.p
              initial={{ opacity: 0, letterSpacing: '0.3em' }}
              animate={{ opacity: 1, letterSpacing: '0.5em' }}
              transition={{ duration: 1.5, delay: 0.8 }}
              className="text-amber-400 text-sm font-body tracking-[0.5em] uppercase mb-6"
            >
              Established 2024
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1 }}
              className="font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-tight mb-8"
            >
              <span className="text-gradient-gold">Discover the Art</span>
              <br />
              <span className="text-white/90">of Luxury Fragrance</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.3 }}
              className="text-white/60 text-lg md:text-xl font-body max-w-2xl mx-auto mb-12 leading-relaxed"
            >
              Experience perfumes like never before. Handcrafted by master perfumers
              using the world&apos;s rarest ingredients.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link href="/showroom">
                <button className="btn-luxury px-10 py-4 bg-gradient-gold text-black font-body font-semibold tracking-wider uppercase text-sm rounded-none hover:glow-gold transition-all duration-300">
                  Explore Collection
                </button>
              </Link>
              <Link href="#featured">
                <button className="btn-luxury px-10 py-4 border border-gold-500/30 text-gold-500 font-body font-semibold tracking-wider uppercase text-sm rounded-none hover:bg-gold-500/10 transition-all duration-300">
                  Shop Now
                </button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 1 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2"
          >
            <div className="flex flex-col items-center gap-2 text-gold-500/50">
              <span className="text-xs font-body tracking-widest uppercase">Scroll</span>
              <div className="animate-scroll-bounce">
                <svg width="20" height="30" viewBox="0 0 20 30" fill="none">
                  <rect x="1" y="1" width="18" height="28" rx="9" stroke="currentColor" strokeWidth="1" />
                  <motion.circle
                    cx="10"
                    cy="10"
                    r="3"
                    fill="currentColor"
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                  />
                </svg>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
          {[
            { l: 90.6, t: 7.6, d: 5.2, dl: 0.3 }, { l: 47.7, t: 46.0, d: 4.8, dl: 1.1 },
            { l: 18.8, t: 66.3, d: 6.1, dl: 2.0 }, { l: 12.5, t: 83.6, d: 3.9, dl: 0.7 },
            { l: 88.9, t: 62.0, d: 5.5, dl: 1.5 }, { l: 3.4, t: 48.2, d: 4.3, dl: 0.9 },
            { l: 3.8, t: 32.0, d: 6.7, dl: 2.3 }, { l: 28.0, t: 84.7, d: 3.5, dl: 0.2 },
            { l: 92.8, t: 6.1, d: 5.8, dl: 1.8 }, { l: 71.6, t: 37.1, d: 4.1, dl: 2.5 },
            { l: 33.8, t: 79.8, d: 6.3, dl: 0.5 }, { l: 31.6, t: 7.1, d: 3.8, dl: 1.3 },
            { l: 7.0, t: 16.2, d: 5.0, dl: 2.1 }, { l: 20.1, t: 50.8, d: 4.6, dl: 0.8 },
            { l: 47.3, t: 22.1, d: 5.4, dl: 1.7 }, { l: 18.8, t: 14.5, d: 3.6, dl: 2.8 },
            { l: 39.2, t: 82.7, d: 6.0, dl: 0.4 }, { l: 32.8, t: 76.1, d: 4.4, dl: 1.9 },
            { l: 66.2, t: 80.9, d: 5.7, dl: 0.6 }, { l: 57.2, t: 81.3, d: 3.7, dl: 2.4 },
          ].map((p, i) => (
            <motion.div
              key={`particle-${i}`}
              className="absolute w-1 h-1 bg-gold-500/30 rounded-full"
              style={{ left: `${p.l}%`, top: `${p.t}%` }}
              animate={{ y: [0, -30, 0], opacity: [0.2, 0.8, 0.2], scale: [1, 1.5, 1] }}
              transition={{ duration: p.d, repeat: Infinity, delay: p.dl, ease: 'easeInOut' }}
            />
          ))}
        </div>
      </motion.section>

      {/* Featured Products Section */}
      <section id="featured" className="relative py-32 px-4">
        <div className="noise absolute inset-0" />
        <div className="max-w-7xl mx-auto relative z-10">
          <ScrollReveal>
            <div className="text-center mb-20">
              <motion.p className="text-gold-500 text-sm tracking-[0.3em] uppercase mb-4 font-body">
                Curated Selection
              </motion.p>
              <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-gradient-gold mb-6">
                Our Signature Collection
              </h2>
              <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto" />
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-80 glass rounded-xl animate-pulse" />
                ))}
              </div>
            ) : (
              <ProductGrid products={products} />
            )}
          </ScrollReveal>

          <ScrollReveal delay={0.3}>
            <div className="text-center mt-16">
              <Link href="/showroom">
                <button className="btn-luxury px-12 py-4 border border-gold-500/30 text-gold-500 font-body font-semibold tracking-wider uppercase text-sm rounded-none hover:bg-gold-500/10 transition-all duration-300">
                  View All Fragrances
                </button>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Brand Story Section */}
      <section className="relative py-32 px-4 overflow-hidden">
        <div className="noise absolute inset-0" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <ScrollReveal>
              <div>
                <p className="text-gold-500 text-sm tracking-[0.3em] uppercase mb-4 font-body">
                  Our Philosophy
                </p>
                <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-gradient-gold mb-8 leading-tight">
                  The Art of Fragrance
                </h2>
                <div className="space-y-6 text-white/60 font-body leading-relaxed">
                  <p>
                    At MAISON LUXE, we believe that fragrance is the most intimate form of self-expression.
                    Each scent in our collection is a masterpiece, crafted by master perfumers who have
                    dedicated their lives to the art of olfaction.
                  </p>
                  <p>
                    We source the world&apos;s rarest ingredients — from the dew-kissed petals of Grasse roses
                    to the ancient ambergris of the Indian Ocean — ensuring that every spray transports you
                    to a realm of unparalleled luxury.
                  </p>
                  <p>
                    Our commitment extends beyond exceptional fragrance. Each bottle is a work of art,
                    hand-blown by master glassmakers and adorned with 24-karat gold accents.
                  </p>
                </div>
                <Link href="/showroom">
                  <button className="mt-10 btn-luxury px-8 py-4 bg-gradient-gold text-black font-body font-semibold tracking-wider uppercase text-sm rounded-none hover:glow-gold transition-all duration-300">
                    Visit Our Showroom
                  </button>
                </Link>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <div className="relative">
                {/* Decorative Elements */}
                <div className="absolute -top-8 -right-8 w-64 h-64 border border-gold-500/10 rounded-full" />
                <div className="absolute -bottom-4 -left-4 w-48 h-48 border border-gold-500/10 rounded-full" />

                {/* Video Showcase */}
                <div className="relative glass-gold rounded-2xl overflow-hidden">
                  <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    className="w-full aspect-[4/3] object-cover"
                  >
                    <source src="/images/products/collection-showcase.mp4" type="video/mp4" />
                  </video>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-8 text-center">
                    <h3 className="font-display text-2xl text-white mb-2">Master Perfumers</h3>
                    <p className="text-white/50 font-body text-sm">
                      Over 150 years of combined experience in crafting the world&apos;s finest fragrances
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="relative py-32 px-4">
        <div className="noise absolute inset-0" />
        <div className="max-w-7xl mx-auto relative z-10">
          <ScrollReveal>
            <div className="text-center mb-20">
              <p className="text-gold-500 text-sm tracking-[0.3em] uppercase mb-4 font-body">
                Find Your Signature
              </p>
              <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-gradient-gold mb-6">
                Explore by Mood
              </h2>
              <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto" />
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category, index) => (
              <ScrollReveal key={category.name} delay={index * 0.1}>
                <Link href={`/collection?category=${category.name.toLowerCase()}`}>
                  <motion.div
                    whileHover={{ y: -8, scale: 1.02 }}
                    className={`glass rounded-xl p-6 text-center cursor-pointer transition-all duration-300 hover:glow-gold bg-gradient-to-br ${category.gradient} group`}
                  >
                    <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center group-hover:bg-amber-500/20 transition-colors">
                      <span className="font-display text-sm text-amber-500/70">{category.icon}</span>
                    </div>
                    <h3 className="font-display text-lg text-white mb-2">{category.name}</h3>
                    <p className="text-gold-500/70 text-sm font-body">{category.count} fragrances</p>
                  </motion.div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 3D Showcase Section */}
      <section className="relative py-32 px-4 overflow-hidden">
        <div className="noise absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-b from-luxury-bg via-amber-500/[0.03] to-luxury-bg" />
        <div className="max-w-7xl mx-auto relative z-10">
          <ScrollReveal>
            <div className="text-center mb-16">
              <p className="text-gold-500 text-sm tracking-[0.3em] uppercase mb-4 font-body">
                Immersive Experience
              </p>
              <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-gradient-gold mb-6">
                Step Into Luxury
              </h2>
              <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto" />
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div className="relative rounded-3xl overflow-hidden glass">
              <video
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                className="w-full aspect-[21/9] object-cover"
              >
                <source src="/images/products/product-detail.mp4" type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-gradient-to-t from-luxury-bg via-transparent to-luxury-bg/50" />
              <div className="absolute inset-0 bg-gradient-to-r from-luxury-bg/60 via-transparent to-luxury-bg/60" />

              {/* Floating 3D Cards */}
              <div className="absolute inset-0 flex items-center justify-center gap-8 px-8">
                {[
                  { name: 'Noir Cristal', color: '#8b4513', rotate: -12 },
                  { name: 'Velvet Dusk', color: '#c41e3a', rotate: 0 },
                  { name: 'Citrus Royale', color: '#d4a574', rotate: 12 },
                ].map((item, i) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, y: 40, rotateY: item.rotate }}
                    whileInView={{ opacity: 1, y: 0, rotateY: item.rotate }}
                    transition={{ delay: 0.3 + i * 0.15, duration: 0.8 }}
                    whileHover={{ y: -10, scale: 1.05, rotateY: 0 }}
                    className="hidden md:block"
                    style={{ perspective: 800 }}
                  >
                    <div
                      className="w-40 h-56 rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
                      style={{ transform: `perspective(600px) rotateY(${item.rotate}deg)` }}
                    >
                      <div className="w-full h-full bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-sm flex flex-col items-center justify-center p-4">
                        <div
                          className="w-16 h-28 rounded-t-full rounded-b-lg border border-white/20 mb-4"
                          style={{ background: `linear-gradient(to bottom, ${item.color}40, ${item.color}20)` }}
                        />
                        <p className="text-white/80 text-xs font-body text-center tracking-wider">{item.name}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="absolute bottom-8 left-8 right-8 text-center">
                <Link href="/showroom">
                  <button className="px-10 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-body font-semibold tracking-wider uppercase text-sm rounded-full hover:shadow-lg hover:shadow-amber-500/30 transition-all duration-300">
                    Enter the Showroom
                  </button>
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative py-32 px-4">
        <div className="noise absolute inset-0" />
        <div className="max-w-7xl mx-auto relative z-10">
          <ScrollReveal>
            <div className="text-center mb-20">
              <p className="text-gold-500 text-sm tracking-[0.3em] uppercase mb-4 font-body">
                Client Stories
              </p>
              <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-gradient-gold mb-6">
                What Our Clients Say
              </h2>
              <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto" />
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <ScrollReveal key={testimonial.name} delay={index * 0.15}>
                <motion.div
                  whileHover={{ y: -5 }}
                  className="glass rounded-2xl p-8 h-full flex flex-col"
                >
                  {/* Stars */}
                  <div className="flex gap-1.5 mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <div key={i} className="w-2 h-2 rounded-full bg-gold-500" />
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-white/70 font-body leading-relaxed mb-8 flex-1 italic">
                    &ldquo;{testimonial.text}&rdquo;
                  </p>

                  {/* Author */}
                  <div className="border-t border-white/5 pt-6">
                    <p className="font-display text-lg text-white">{testimonial.name}</p>
                    <p className="text-gold-500/70 text-sm font-body">{testimonial.title}</p>
                  </div>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="relative py-32 px-4 overflow-hidden">
        <div className="noise absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-b from-luxury-bg via-gold-500/5 to-luxury-bg" />
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <ScrollReveal>
            <div className="glass-gold rounded-3xl p-16">
              <motion.div
                animate={{ rotateY: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="w-20 h-20 mx-auto mb-8"
                style={{ perspective: 600 }}
              >
                <div className="w-full h-full relative" style={{ transformStyle: 'preserve-3d' }}>
                  <div className="absolute inset-0 bg-gradient-to-b from-amber-400/40 to-amber-700/20 rounded-t-full rounded-b-lg border border-amber-500/30" style={{ backfaceVisibility: 'hidden' }} />
                  <div className="absolute inset-0 bg-gradient-to-b from-amber-500/40 to-amber-800/20 rounded-t-full rounded-b-lg border border-amber-500/30" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }} />
                </div>
              </motion.div>

              <h2 className="font-display text-4xl md:text-5xl text-gradient-gold mb-6">
                Join the Inner Circle
              </h2>
              <p className="text-white/60 font-body mb-10 max-w-xl mx-auto">
                Exclusive access to new launches, private events, and limited edition fragrances
                reserved for our most valued clients.
              </p>

              <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-6 py-4 bg-black/40 border border-gold-500/20 text-white font-body placeholder:text-white/30 focus:outline-none focus:border-gold-500/50 transition-colors rounded-none"
                />
                <button
                  type="submit"
                  className="btn-luxury px-8 py-4 bg-gradient-gold text-black font-body font-semibold tracking-wider uppercase text-sm rounded-none hover:glow-gold transition-all duration-300 whitespace-nowrap"
                >
                  Subscribe
                </button>
              </form>

              <p className="text-white/30 text-xs font-body mt-6">
                By subscribing, you agree to our Privacy Policy. Unsubscribe anytime.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Recently Viewed */}
      <RecentlyViewed />

    </div>
  );
}
