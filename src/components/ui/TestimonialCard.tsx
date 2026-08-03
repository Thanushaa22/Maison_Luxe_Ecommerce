"use client";

import { motion } from "framer-motion";
import { FaQuoteLeft } from "react-icons/fa";
import StarRating from "./StarRating";

interface TestimonialCardProps {
  name: string;
  role?: string;
  quote: string;
  avatar?: string;
  rating?: number;
}

export default function TestimonialCard({
  name,
  role,
  quote,
  avatar,
  rating = 5,
}: TestimonialCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 relative group hover:border-amber-500/20 transition-colors duration-500"
    >
      {/* Gold glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-amber-500/0 to-amber-500/0 group-hover:from-amber-500/5 group-hover:to-transparent rounded-2xl transition-all duration-500 pointer-events-none" />

      {/* Quote icon */}
      <FaQuoteLeft className="text-amber-500/20 text-4xl mb-6" />

      {/* Quote text */}
      <p className="text-white/60 text-sm leading-relaxed mb-8 relative z-10">
        &ldquo;{quote}&rdquo;
      </p>

      {/* Rating */}
      <div className="mb-6">
        <StarRating rating={rating} size="sm" />
      </div>

      {/* Author */}
      <div className="flex items-center gap-4 relative z-10">
        {avatar ? (
          <div className="w-12 h-12 rounded-full overflow-hidden border border-white/10">
            <img
              src={avatar}
              alt={name}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500/30 to-amber-700/10 border border-amber-500/20 flex items-center justify-center">
            <span className="text-amber-400 font-serif text-lg">
              {name.charAt(0)}
            </span>
          </div>
        )}
        <div>
          <h4 className="text-white text-sm font-serif tracking-wider">
            {name}
          </h4>
          {role && (
            <p className="text-white/30 text-xs tracking-wider">{role}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
