"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  ShoppingBag,
  User,
  Menu,
  X,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useStore } from "@/store/useStore";

const navLinks = [
  { name: "Collection", href: "/collection" },
  { name: "Showroom", href: "/showroom" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isCartOpen = useStore((s) => s.ui.isCartOpen);
  const setCartOpen = useStore((s) => s.ui.setCartOpen);
  const isAuthOpen = useStore((s) => s.ui.isAuthOpen);
  const setAuthOpen = useStore((s) => s.ui.setAuthOpen);
  const cartItems = useCartStore((s) => s.items);
  const user = useStore((s) => s.user.user);
  const logout = useStore((s) => s.user.logout);
  const [wishlistCount] = useState(0);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [mobileOpen]);

  const cartCount = cartItems?.length ?? 0;
  const dashboardHref = user?.role === "ADMIN" ? "/admin" : "/dashboard";

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-black/40 backdrop-blur-xl border-b border-white/5 shadow-lg shadow-black/20"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl md:text-2xl font-serif tracking-[0.3em] text-white font-semibold">
                MAISON
              </span>
              <span className="text-xl md:text-2xl font-serif tracking-[0.3em] text-amber-400 font-light">
                LUXE
              </span>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-10">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="relative text-sm tracking-widest text-white/70 hover:text-white transition-colors duration-300 group"
                >
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-gradient-to-r from-amber-400 to-amber-600 group-hover:w-full transition-all duration-300" />
                </Link>
              ))}
            </div>

            {/* Desktop Icons */}
            <div className="hidden md:flex items-center gap-5">
              <Link
                href="/wishlist"
                className="relative text-white/70 hover:text-amber-400 transition-colors duration-300"
              >
                <Heart size={20} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-amber-500 text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>
              <button
                onClick={() => setCartOpen(!isCartOpen)}
                className="relative text-white/70 hover:text-amber-400 transition-colors duration-300"
              >
                <ShoppingBag size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-amber-500 text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
              {user ? (
                <div className="flex items-center gap-3">
                  <Link
                    href={dashboardHref}
                    className="flex items-center gap-1.5 text-white/70 hover:text-amber-400 transition-colors duration-300 text-sm"
                  >
                    <LayoutDashboard size={18} />
                    <span className="hidden lg:inline">{user.role === "ADMIN" ? "Admin" : "Dashboard"}</span>
                  </Link>
                  <button
                    onClick={() => { logout(); window.location.href = '/'; }}
                    className="text-white/70 hover:text-amber-400 transition-colors duration-300"
                    title="Logout"
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setAuthOpen(!isAuthOpen)}
                  className="text-white/70 hover:text-amber-400 transition-colors duration-300"
                >
                  <User size={20} />
                </button>
              )}
            </div>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden text-white/80 hover:text-amber-400 transition-colors"
            >
              <Menu size={26} />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Full-Screen Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex flex-col"
          >
            <div className="flex items-center justify-between px-6 h-20">
              <span className="text-xl font-serif tracking-[0.3em] text-white font-semibold">
                MAISON <span className="text-amber-400 font-light">LUXE</span>
              </span>
              <button
                onClick={() => setMobileOpen(false)}
                className="text-white/80 hover:text-amber-400 transition-colors"
              >
                <X size={28} />
              </button>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center gap-10">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.08, duration: 0.5 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="text-3xl font-serif tracking-widest text-white/80 hover:text-amber-400 transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
              {user && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  <Link
                    href={dashboardHref}
                    onClick={() => setMobileOpen(false)}
                    className="text-3xl font-serif tracking-widest text-amber-400 hover:text-amber-300 transition-colors duration-300"
                  >
                    {user.role === "ADMIN" ? "Admin Panel" : "My Dashboard"}
                  </Link>
                </motion.div>
              )}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center justify-center gap-8 pb-12"
            >
              <Link href="/wishlist" onClick={() => setMobileOpen(false)} className="text-white/60 hover:text-amber-400 transition-colors">
                <Heart size={22} />
              </Link>
              <button
                onClick={() => { setMobileOpen(false); setCartOpen(true); }}
                className="text-white/60 hover:text-amber-400 transition-colors"
              >
                <ShoppingBag size={22} />
              </button>
              {user ? (
                <button
                  onClick={() => { logout(); setMobileOpen(false); window.location.href = '/'; }}
                  className="text-white/60 hover:text-amber-400 transition-colors"
                >
                  <LogOut size={22} />
                </button>
              ) : (
                <button
                  onClick={() => { setMobileOpen(false); setAuthOpen(true); }}
                  className="text-white/60 hover:text-amber-400 transition-colors"
                >
                  <User size={22} />
                </button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
