"use client";

import { FaStar, FaRegStar } from "react-icons/fa";

interface StarRatingProps {
  rating: number;
  size?: "sm" | "md" | "lg";
  showCount?: boolean;
  count?: number;
}

const sizeMap = {
  sm: 12,
  md: 16,
  lg: 20,
};

export default function StarRating({
  rating,
  size = "md",
  showCount = false,
  count,
}: StarRatingProps) {
  const starSize = sizeMap[size];

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className="text-amber-400">
          {star <= Math.round(rating) ? (
            <FaStar size={starSize} />
          ) : (
            <FaRegStar size={starSize} className="text-white/20" />
          )}
        </span>
      ))}
      {showCount && count !== undefined && (
        <span className="text-white/30 text-xs ml-1">({count})</span>
      )}
    </div>
  );
}
