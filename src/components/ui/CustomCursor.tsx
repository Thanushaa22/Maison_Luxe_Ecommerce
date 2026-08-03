"use client";

import { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

export default function CustomCursor() {
  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [clicking, setClicking] = useState(false);

  const cursorX = useSpring(0, { stiffness: 800, damping: 35 });
  const cursorY = useSpring(0, { stiffness: 800, damping: 35 });
  const ringX = useSpring(0, { stiffness: 120, damping: 18 });
  const ringY = useSpring(0, { stiffness: 120, damping: 18 });
  const ringScale = useMotionValue(1);

  useEffect(() => {
    if ("ontouchstart" in window) return;

    const handleMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      ringX.set(e.clientX);
      ringY.set(e.clientY);
      if (!visible) setVisible(true);
    };

    const handleDown = () => setClicking(true);
    const handleUp = () => setClicking(false);
    const handleEnter = () => setVisible(true);
    const handleLeave = () => setVisible(false);

    const addHoverListeners = () => {
      const interactive = document.querySelectorAll(
        "a, button, input, textarea, select, [role='button'], [data-cursor-hover]"
      );
      interactive.forEach((el) => {
        el.addEventListener("mouseenter", () => setHovering(true));
        el.addEventListener("mouseleave", () => setHovering(false));
      });
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mousedown", handleDown);
    window.addEventListener("mouseup", handleUp);
    document.addEventListener("mouseenter", handleEnter);
    document.addEventListener("mouseleave", handleLeave);

    addHoverListeners();
    const interval = setInterval(addHoverListeners, 2000);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mousedown", handleDown);
      window.removeEventListener("mouseup", handleUp);
      document.removeEventListener("mouseenter", handleEnter);
      document.removeEventListener("mouseleave", handleLeave);
      clearInterval(interval);
    };
  }, [cursorX, cursorY, ringX, ringY, visible]);

  useEffect(() => {
    ringScale.set(hovering ? 1.8 : clicking ? 0.7 : 1);
  }, [hovering, clicking, ringScale]);

  if (typeof window !== "undefined" && "ontouchstart" in window) return null;

  return (
    <>
      <style>{`
        *, *::before, *::after { cursor: none !important; }
        @media (pointer: coarse) { *, *::before, *::after { cursor: auto !important; } }
      `}</style>
      <div className="pointer-events-none fixed inset-0 z-[9999]">
        {/* Crosshair lines */}
        <motion.div
          style={{ x: ringX, y: ringY }}
          animate={{ opacity: visible && hovering ? 0.5 : 0 }}
          transition={{ duration: 0.3 }}
          className="fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2"
        >
          {/* Top line */}
          <div className="absolute left-1/2 -translate-x-1/2 -top-8 w-px h-5 bg-gradient-to-b from-transparent to-amber-500/60" />
          {/* Bottom line */}
          <div className="absolute left-1/2 -translate-x-1/2 top-8 w-px h-5 bg-gradient-to-t from-transparent to-amber-500/60" />
          {/* Left line */}
          <div className="absolute top-1/2 -translate-y-1/2 -left-8 w-5 h-px bg-gradient-to-r from-transparent to-amber-500/60" />
          {/* Right line */}
          <div className="absolute top-1/2 -translate-y-1/2 left-8 w-5 h-px bg-gradient-to-l from-transparent to-amber-500/60" />
        </motion.div>

        {/* Diamond ring */}
        <motion.div
          style={{ x: ringX, y: ringY }}
          animate={{ opacity: visible ? 1 : 0, scale: ringScale }}
          transition={{ scale: { type: "spring", stiffness: 300, damping: 25 } }}
          className="fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2"
        >
          <div
            className="w-8 h-8 rotate-45 border transition-all duration-300"
            style={{
              borderColor: hovering ? "rgba(212,175,55,0.8)" : "rgba(255,255,255,0.25)",
              boxShadow: hovering
                ? "0 0 15px rgba(212,175,55,0.3), inset 0 0 10px rgba(212,175,55,0.15)"
                : "none",
            }}
          />
        </motion.div>

        {/* Center dot */}
        <motion.div
          style={{ x: cursorX, y: cursorY }}
          animate={{
            opacity: visible ? 1 : 0,
            scale: clicking ? 0.4 : hovering ? 0.6 : 1,
          }}
          transition={{ scale: { type: "spring", stiffness: 600, damping: 25 } }}
          className="fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2"
        >
          <div
            className="w-2 h-2 rotate-45"
            style={{
              background: "linear-gradient(135deg, #d4af37 0%, #f0d060 50%, #b8941f 100%)",
              boxShadow: "0 0 8px rgba(212,175,55,0.7), 0 0 16px rgba(212,175,55,0.3)",
            }}
          />
        </motion.div>
      </div>
    </>
  );
}
