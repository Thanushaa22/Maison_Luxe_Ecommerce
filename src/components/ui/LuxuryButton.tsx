"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

interface LuxuryButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
  href?: string;
  disabled?: boolean;
  loading?: boolean;
}

const sizeClasses = {
  sm: "px-5 py-2 text-xs tracking-widest",
  md: "px-7 py-3 text-sm tracking-widest",
  lg: "px-10 py-4 text-sm tracking-widest",
};

const variantClasses = {
  primary:
    "bg-gradient-to-r from-amber-500 to-amber-600 text-black font-semibold hover:from-amber-400 hover:to-amber-500 hover:shadow-lg hover:shadow-amber-500/30",
  secondary:
    "bg-black/60 border border-amber-500/50 text-amber-400 hover:bg-amber-500/10 hover:border-amber-400",
  outline:
    "bg-transparent border border-amber-500/40 text-amber-400 hover:bg-amber-500/10 hover:border-amber-400",
  ghost:
    "bg-transparent text-amber-400 hover:bg-amber-500/10",
};

export default function LuxuryButton({
  children,
  variant = "primary",
  size = "md",
  className = "",
  onClick,
  href,
  disabled = false,
  loading = false,
}: LuxuryButtonProps) {
  const baseClasses = `
    inline-flex items-center justify-center gap-2 rounded-full
    font-medium transition-all duration-300
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${disabled || loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
    ${className}
  `;

  const content = (
    <>
      {loading && <Loader2 size={16} className="animate-spin" />}
      {children}
    </>
  );

  if (href && !disabled && !loading) {
    return (
      <Link href={href}>
        <motion.span
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className={baseClasses}
        >
          {content}
        </motion.span>
      </Link>
    );
  }

  return (
    <motion.button
      whileHover={!disabled && !loading ? { scale: 1.03 } : undefined}
      whileTap={!disabled && !loading ? { scale: 0.97 } : undefined}
      onClick={onClick}
      disabled={disabled || loading}
      className={baseClasses}
    >
      {content}
    </motion.button>
  );
}
