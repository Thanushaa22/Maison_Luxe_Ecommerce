"use client";

import { motion } from "framer-motion";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
}

export default function GlassCard({
  children,
  className = "",
  hover = false,
  glow = false,
}: GlassCardProps) {
  return (
    <motion.div
      whileHover={
        hover
          ? {
              y: -6,
              transition: { duration: 0.3, ease: "easeOut" },
            }
          : undefined
      }
      className={`
        backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl
        ${hover ? "cursor-pointer transition-colors duration-500 hover:border-amber-500/30" : ""}
        ${glow ? "hover:shadow-2xl hover:shadow-amber-500/10" : ""}
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}
