"use client";

import { motion } from "framer-motion";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  light?: boolean;
}

export default function SectionHeading({
  title,
  subtitle,
  align = "center",
  light = false,
}: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className={`mb-12 ${align === "center" ? "text-center" : "text-left"}`}
    >
      <h2
        className={`font-serif text-3xl md:text-4xl lg:text-5xl tracking-wider mb-4 ${
          light ? "text-black" : "text-white"
        }`}
      >
        {title}
      </h2>

      {/* Gold decorative line */}
      <div
        className={`h-px w-16 bg-gradient-to-r from-amber-500 to-amber-600 mb-5 ${
          align === "center" ? "mx-auto" : ""
        }`}
      />

      {subtitle && (
        <p
          className={`text-sm md:text-base tracking-wider max-w-lg ${
            align === "center" ? "mx-auto" : ""
          } ${light ? "text-black/50" : "text-white/40"}`}
        >
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
