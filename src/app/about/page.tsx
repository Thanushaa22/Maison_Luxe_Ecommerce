'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import ScrollReveal from '@/components/ui/ScrollReveal';
import ParallaxSection from '@/components/ui/ParallaxSection';

const philosophyPillars = [
  {
    icon: 'I',
    title: 'Craftsmanship',
    description:
      'Every fragrance is meticulously composed by master perfumers with decades of experience, using only the finest raw materials sourced from around the world.',
  },
  {
    icon: 'II',
    title: 'Heritage',
    description:
      'Rooted in the timeless traditions of Grasse perfumery, we honor centuries of artistry while pushing the boundaries of modern olfaction.',
  },
  {
    icon: 'III',
    title: 'Innovation',
    description:
      'We blend cutting-edge extraction techniques with classical composition methods to create fragrances that are both timeless and distinctly contemporary.',
  },
];

const processSteps = [
  {
    number: '01',
    title: 'Sourcing',
    description:
      'Our perfumers travel the globe to source the rarest ingredients — from Indian sandalwood to Bulgarian rose absolute.',
  },
  {
    number: '02',
    title: 'Composition',
    description:
      'Each fragrance is composed in our atelier, where top, heart, and base notes are layered with precision and artistry.',
  },
  {
    number: '03',
    title: 'Maturation',
    description:
      'The composed fragrance rests in temperature-controlled environments, allowing the notes to meld and mature over weeks.',
  },
  {
    number: '04',
    title: 'Bottling',
    description:
      'Each bottle is hand-filled, sealed, and adorned with our signature gold accent — a mark of uncompromising quality.',
  },
];

const teamMembers = [
  {
    name: 'Ace',
    role: 'Master Perfumer',
    description: 'With over 20 years at the helm of our fragrance creation, Ace brings unparalleled expertise in oriental and floral compositions.',
  },
  {
    name: 'Zoro',
    role: 'Creative Director',
    description: 'Zoro shapes the visual and sensory identity of every MAISON LUXE creation, ensuring each product tells a cohesive story.',
  },
  {
    name: 'Luffy',
    role: 'Head of Innovation',
    description: 'Luffy leads our R&D team, pioneering sustainable extraction methods and novel fragrance technologies.',
  },
];

export default function AboutPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div className="bg-luxury-bg text-white">
      {/* Hero Section */}
      <section ref={heroRef} className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <motion.div style={{ y: heroY }} className="absolute inset-0 z-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="w-full h-full object-cover opacity-20"
          >
            <source src="/images/products/hero-perfume.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-luxury-bg/60 via-luxury-bg/80 to-luxury-bg" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,168,67,0.08),transparent_70%)]" />
        </motion.div>

        <motion.div style={{ opacity: heroOpacity }} className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.p
            initial={{ opacity: 0, letterSpacing: '0.3em' }}
            animate={{ opacity: 1, letterSpacing: '0.5em' }}
            transition={{ duration: 1.2, delay: 0.3 }}
            className="text-amber-500/70 text-xs font-body tracking-[0.5em] uppercase mb-6"
          >
            Since 2024
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="font-display text-5xl md:text-6xl lg:text-7xl text-gradient-gold mb-6 leading-tight"
          >
            The Art of Perfumery
          </motion.h1>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="w-24 h-[1px] bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto mb-8"
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="text-white/50 font-body text-lg max-w-2xl mx-auto leading-relaxed"
          >
            Where ancient artistry meets modern luxury, crafting fragrances that transcend the ordinary
          </motion.p>
        </motion.div>

        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-luxury-bg to-transparent z-10" />
      </section>

      {/* Brand Story */}
      <section className="relative py-24 px-4">
        <div className="noise absolute inset-0" />
        <div className="max-w-5xl mx-auto relative z-10">
          <ScrollReveal>
            <div className="text-center mb-16">
              <p className="text-amber-500/70 text-xs tracking-[0.3em] uppercase mb-4 font-body">Our Story</p>
              <h2 className="font-display text-4xl md:text-5xl text-gradient-gold mb-8">Born from Passion</h2>
              <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto" />
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div className="space-y-6 text-white/50 font-body leading-relaxed text-center max-w-3xl mx-auto">
              <p className="text-lg">
                MAISON LUXE was founded on a singular belief: that fragrance is the most intimate form of self-expression.
              </p>
              <p>
                In a world of mass production, we chose a different path. Our atelier in the heart of Grasse — the perfume
                capital of the world — is where tradition meets innovation. Here, master perfumers with decades of experience
                hand-craft each fragrance using the world&apos;s rarest ingredients.
              </p>
              <p>
                From the dew-kissed petals of Grasse roses to the ancient ambergris of the Indian Ocean, every ingredient
                tells a story. Every blend is a masterpiece. Every bottle, a testament to the art of olfaction.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Philosophy Pillars */}
      <section className="relative py-24 px-4">
        <div className="noise absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-b from-luxury-bg via-amber-500/[0.02] to-luxury-bg" />
        <div className="max-w-6xl mx-auto relative z-10">
          <ScrollReveal>
            <div className="text-center mb-16">
              <p className="text-amber-500/70 text-xs tracking-[0.3em] uppercase mb-4 font-body">Our Philosophy</p>
              <h2 className="font-display text-4xl md:text-5xl text-gradient-gold mb-6">Three Pillars</h2>
              <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto" />
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {philosophyPillars.map((pillar, index) => (
              <ScrollReveal key={pillar.title} delay={index * 0.15}>
                <motion.div
                  whileHover={{ y: -8 }}
                  className="glass rounded-2xl p-8 text-center h-full group hover:border-amber-500/30 transition-all duration-500"
                >
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center group-hover:bg-amber-500/15 transition-colors">
                    <span className="font-display text-lg text-amber-500">{pillar.icon}</span>
                  </div>
                  <h3 className="font-display text-xl text-white mb-4">{pillar.title}</h3>
                  <p className="text-white/40 font-body text-sm leading-relaxed">{pillar.description}</p>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* The Process */}
      <section className="relative py-24 px-4">
        <div className="noise absolute inset-0" />
        <div className="max-w-5xl mx-auto relative z-10">
          <ScrollReveal>
            <div className="text-center mb-16">
              <p className="text-amber-500/70 text-xs tracking-[0.3em] uppercase mb-4 font-body">The Process</p>
              <h2 className="font-display text-4xl md:text-5xl text-gradient-gold mb-6">From Vision to Bottle</h2>
              <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto" />
            </div>
          </ScrollReveal>

          <div className="space-y-8">
            {processSteps.map((step, index) => (
              <ScrollReveal key={step.number} delay={index * 0.1} direction={index % 2 === 0 ? 'left' : 'right'}>
                <motion.div
                  whileHover={{ x: 8 }}
                  className="glass rounded-xl p-6 sm:p-8 flex items-start gap-6 group hover:border-amber-500/30 transition-all duration-500"
                >
                  <div className="flex-shrink-0">
                    <span className="font-display text-4xl text-amber-500/30 group-hover:text-amber-500/60 transition-colors">
                      {step.number}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-display text-xl text-white mb-2">{step.title}</h3>
                    <p className="text-white/40 font-body text-sm leading-relaxed">{step.description}</p>
                  </div>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="relative py-24 px-4">
        <div className="noise absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-b from-luxury-bg via-amber-500/[0.02] to-luxury-bg" />
        <div className="max-w-6xl mx-auto relative z-10">
          <ScrollReveal>
            <div className="text-center mb-16">
              <p className="text-amber-500/70 text-xs tracking-[0.3em] uppercase mb-4 font-body">Our Artisans</p>
              <h2 className="font-display text-4xl md:text-5xl text-gradient-gold mb-6">The Hands Behind the Craft</h2>
              <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto" />
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {teamMembers.map((member, index) => (
              <ScrollReveal key={member.name} delay={index * 0.15}>
                <motion.div
                  whileHover={{ y: -6 }}
                  className="glass rounded-2xl overflow-hidden group hover:border-amber-500/30 transition-all duration-500"
                >
                  <div className="h-48 bg-gradient-to-br from-amber-500/10 to-amber-700/5 flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-amber-500/15 border border-amber-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                      <span className="font-display text-2xl text-amber-500/60">{member.name.charAt(0)}</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-display text-lg text-white mb-1">{member.name}</h3>
                    <p className="text-amber-500/70 text-xs font-body tracking-wider uppercase mb-3">{member.role}</p>
                    <p className="text-white/40 font-body text-sm leading-relaxed">{member.description}</p>
                  </div>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="noise absolute inset-0" />
        <ParallaxSection speed={0.3}>
          <div className="absolute inset-0 bg-gradient-to-b from-luxury-bg via-amber-500/5 to-luxury-bg" />
        </ParallaxSection>
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <ScrollReveal>
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="glass-gold rounded-3xl p-12 sm:p-16"
            >
              <p className="text-amber-500/70 text-xs tracking-[0.3em] uppercase mb-6 font-body">Begin Your Journey</p>
              <h2 className="font-display text-3xl md:text-4xl text-gradient-gold mb-6">
                Discover Your Signature Scent
              </h2>
              <p className="text-white/50 font-body mb-10 max-w-xl mx-auto leading-relaxed">
                Explore our curated collection of luxury fragrances, each a masterpiece of olfactory artistry
              </p>
              <Link href="/collection">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-12 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-body font-semibold tracking-wider uppercase text-sm rounded-full hover:shadow-lg hover:shadow-amber-500/30 transition-all"
                >
                  Explore Collection
                </motion.button>
              </Link>
            </motion.div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
