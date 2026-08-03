"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Eye, Heart } from "lucide-react";
import StarRating from "./StarRating";
import { Product } from "@/types";
import { useStore } from "@/store/useStore";
import { useToast } from "./Toast";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export default function ProductCard({ product, priority = false }: ProductCardProps) {
  const hasImage = product.images && product.images.length > 0;
  const hasDiscount =
    product.comparePrice && product.comparePrice > product.price;
  const toggleWishlist = useStore((s) => s.wishlist.toggleWishlist);
  const isInWishlist = useStore((s) => s.wishlist.isInWishlist);
  const isWished = isInWishlist(product.id);
  const { showToast } = useToast();

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="group relative"
    >
      <Link href={`/product/${product.slug || product.id}`}>
        <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden transition-all duration-500 group-hover:border-amber-500/30 group-hover:shadow-2xl group-hover:shadow-amber-500/10">
          <div className="absolute inset-0 bg-gradient-to-b from-amber-500/0 to-amber-500/0 group-hover:from-amber-500/5 group-hover:to-transparent transition-all duration-500 rounded-2xl pointer-events-none" />

          <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-white/5 to-white/[0.02]">
            {hasImage ? (
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                priority={priority}
                loading={priority ? "eager" : "lazy"}
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            ) : null}
            <div className={`absolute inset-0 flex items-center justify-center ${hasImage ? 'opacity-0 group-hover:opacity-100' : ''} transition-opacity duration-500`}>
              <div className="relative">
                <div className="w-16 h-28 bg-gradient-to-b from-amber-400/40 via-amber-500/30 to-amber-700/20 rounded-t-full rounded-b-lg border border-amber-500/30 shadow-lg shadow-amber-500/10" />
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-5 bg-gradient-to-b from-amber-300/60 to-amber-500/40 rounded-t-md border border-amber-400/40" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-gradient-radial from-white/20 to-transparent" />
              </div>
            </div>

            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-500 flex items-center justify-center opacity-0 group-hover:opacity-100">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-6 py-3 rounded-full flex items-center gap-2 text-sm tracking-wider">
                <Eye size={16} />
                Quick View
              </div>
            </div>

            {hasDiscount && (
              <div className="absolute top-4 left-4 bg-amber-500 text-black text-xs font-bold px-3 py-1 rounded-full tracking-wider">
                SALE
              </div>
            )}

            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleWishlist(product);
                showToast(isWished ? "Removed from wishlist" : "Added to wishlist", "success", "heart");
              }}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/30 backdrop-blur-md border border-white/10 flex items-center justify-center transition-all duration-300 hover:bg-amber-500/20 hover:border-amber-500/30"
            >
              <Heart
                size={16}
                className={isWished ? "fill-amber-400 text-amber-400" : "text-white/70"}
              />
            </button>
          </div>

          <div className="p-5">
            <p className="text-amber-400/80 text-xs tracking-[0.2em] uppercase mb-1.5">
              {product.brand}
            </p>
            <h3 className="text-white font-serif text-lg tracking-wide mb-3 line-clamp-1">
              {product.name}
            </h3>

            <div className="mb-3">
              <StarRating rating={product.rating} size="sm" />
            </div>

            <div className="flex items-center gap-3">
              <span className="text-amber-400 font-serif text-lg">
                {formatPrice(product.price)}
              </span>
              {hasDiscount && (
                <span className="text-white/30 text-sm line-through">
                  {formatPrice(product.comparePrice!)}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
