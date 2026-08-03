"use client";

import Link from "next/link";
import { useState } from "react";
import { Linkedin, Mail, Send } from "lucide-react";

const shopLinks = [
  { name: "New Arrivals", href: "/collection?sort=newest" },
  { name: "Best Sellers", href: "/collection?sort=bestselling" },
  { name: "Eau de Parfum", href: "/collection?category=eau-de-parfum" },
  { name: "Eau de Toilette", href: "/collection?category=eau-de-toilette" },
  { name: "Gift Sets", href: "/collection?category=gift-sets" },
];

const aboutLinks = [
  { name: "Our Story", href: "/about" },
  { name: "Craftsmanship", href: "/about" },
  { name: "Sustainability", href: "/about" },
  { name: "Press", href: "/about" },
];

const supportLinks = [
  { name: "Contact Us", href: "/contact" },
  { name: "Shipping & Returns", href: "/contact" },
  { name: "FAQ", href: "/contact" },
  { name: "Size Guide", href: "/collection" },
];

const socialLinks = [
  { name: "LinkedIn", icon: Linkedin, href: "https://linkedin.com/in/thanusha2233" },
  { name: "Email", icon: Mail, href: "mailto:thanusham2233@gmail.com" },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer className="relative bg-black border-t border-amber-500/20">
      {/* Gold gradient top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/60 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-6">
              <span className="text-2xl font-serif tracking-[0.3em] text-white font-semibold">
                MAISON
              </span>
              <span className="text-2xl font-serif tracking-[0.3em] text-amber-400 font-light ml-2">
                LUXE
              </span>
            </Link>
            <p className="text-white/50 text-sm leading-relaxed max-w-sm mb-8">
              Crafting timeless fragrances that embody sophistication and
              elegance. Each scent is a journey through the world&apos;s finest
              ingredients.
            </p>

            {/* Newsletter */}
            <p className="text-white/70 text-sm tracking-wider mb-3">
              Subscribe to our newsletter
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-amber-500/50 transition-colors"
                required
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black px-5 py-3 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/25"
              >
                <Send size={16} />
              </button>
            </form>
            {subscribed && (
              <p className="text-amber-400 text-xs mt-2 tracking-wider">
                Thank you for subscribing!
              </p>
            )}
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="text-white font-serif tracking-widest text-sm mb-6">
              SHOP
            </h3>
            <ul className="space-y-3">
              {shopLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-white/40 hover:text-amber-400 text-sm transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About Links */}
          <div>
            <h3 className="text-white font-serif tracking-widest text-sm mb-6">
              ABOUT
            </h3>
            <ul className="space-y-3">
              {aboutLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-white/40 hover:text-amber-400 text-sm transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-white font-serif tracking-widest text-sm mb-6">
              SUPPORT
            </h3>
            <ul className="space-y-3">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-white/40 hover:text-amber-400 text-sm transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-xs tracking-wider">
            &copy; {new Date().getFullYear()} MAISON LUXE. All rights reserved.
          </p>

          {/* Social Icons */}
          <div className="flex items-center gap-5">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                className="text-white/30 hover:text-amber-400 transition-colors duration-300"
                aria-label={social.name}
              >
                <social.icon size={18} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
