"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, Plus, Minus, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useCartStore } from "@/store/useCartStore";
import { useStore } from "@/store/useStore";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);

export default function CartDrawer() {
  const isCartOpen = useStore((s) => s.ui.isCartOpen);
  const setCartOpen = useStore((s) => s.ui.setCartOpen);
  const items = useCartStore((s) => s.items);
  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setCartOpen(false)}
            className="fixed inset-0 z-[150] bg-black/50 backdrop-blur-sm"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 z-[160] w-full max-w-md bg-black/90 backdrop-blur-2xl border-l border-white/10 flex flex-col"
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
              <div className="flex items-center gap-3">
                <ShoppingBag size={20} className="text-amber-400" />
                <h2 className="text-white font-serif text-lg tracking-wider">
                  Your Bag
                </h2>
                <span className="text-white/30 text-sm">
                  ({items.length} {items.length === 1 ? "item" : "items"})
                </span>
              </div>
              <button
                onClick={() => setCartOpen(false)}
                className="text-white/40 hover:text-white transition-colors"
              >
                <X size={22} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 px-6 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag size={48} className="text-white/10 mb-4" />
                  <p className="text-white/40 font-serif text-lg tracking-wider mb-2">
                    Your bag is empty
                  </p>
                  <p className="text-white/20 text-sm">
                    Explore our collection to find your signature scent.
                  </p>
                </div>
              ) : (
                items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex gap-4 bg-white/5 backdrop-blur-sm border border-white/5 rounded-xl p-4"
                  >
                    <div className="w-20 h-24 relative rounded-lg overflow-hidden bg-white/5 flex-shrink-0">
                      {item.product.images?.[0] ? (
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="w-8 h-12 rounded bg-gradient-to-b from-amber-500/20 to-amber-700/10" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-amber-400/60 text-xs tracking-widest uppercase">
                        {item.product.brand}
                      </p>
                      <h4 className="text-white text-sm font-serif tracking-wide truncate">
                        {item.product.name}
                      </h4>
                      {item.size && (
                        <p className="text-white/30 text-xs mt-0.5">{item.size}</p>
                      )}

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2 bg-white/5 rounded-full px-2 py-1">
                          <button
                            onClick={() =>
                              updateQuantity(item.productId, Math.max(1, item.quantity - 1))
                            }
                            className="text-white/40 hover:text-white transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="text-white text-sm w-6 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.productId, item.quantity + 1)
                            }
                            className="text-white/40 hover:text-white transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-amber-400 text-sm font-serif">
                            {formatPrice(item.product.price * item.quantity)}
                          </span>
                          <button
                            onClick={() => removeItem(item.productId)}
                            className="text-white/20 hover:text-red-400 transition-colors"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-white/5 px-6 py-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-white/60 text-sm tracking-wider">Subtotal</span>
                  <span className="text-white font-serif text-xl">{formatPrice(subtotal)}</span>
                </div>
                {subtotal < 10000 && (
                  <p className="text-amber-400/60 text-xs">
                    Complimentary shipping on orders over ₹10,000
                  </p>
                )}
                <p className="text-white/20 text-xs">Shipping calculated at checkout</p>
                <Link href="/checkout" onClick={() => setCartOpen(false)}>
                  <button className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-semibold py-4 rounded-none tracking-widest text-sm transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/30 btn-luxury">
                    CHECKOUT
                  </button>
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
