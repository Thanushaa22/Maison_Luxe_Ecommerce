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
  const glowX = useSpring(0, { stiffness: 80, damping: 22 });
  const glowY = useSpring(0, { stiffness: 80, damping: 22 });
  const ringScale = useMotionValue(1);

  useEffect(() => {
    if ("ontouchstart" in window) return;

    const handleMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      ringX.set(e.clientX);
      ringY.set(e.clientY);
      glowX.set(e.clientX);
      glowY.set(e.clientY);
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
  }, [cursorX, cursorY, ringX, ringY, glowX, glowY, visible]);

  useEffect(() => {
    ringScale.set(hovering ? 1.6 : clicking ? 0.8 : 1);
  }, [hovering, clicking, ringScale]);

  if (typeof window !== "undefined" && "ontouchstart" in window) return null;

  return (
    <>
      <style>{`*, *::before, *::after { cursor: none !important; }`}</style>
      <div className="pointer-events-none fixed inset-0 z-[9999]">
        {/* Outer glow */}
        <motion.div
          style={{ x: glowX, y: glowY }}
          animate={{ opacity: visible ? (hovering ? 0.5 : 0.15) : 0, scale: hovering ? 2.5 : 1.5 }}
          transition={{ opacity: { duration: 0.4 }, scale: { type: "spring", stiffness: 200, damping: 25 } }}
          className="fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full"
          style={{
            x: glowX,
            y: glowY,
            background: "radial-gradient(circle, rgba(217,161,52,0.4) 0%, rgba(217,161,52,0) 70%)",
          }}
        />

        {/* Ring */}
        <motion.div
          animate={{ opacity: visible ? 1 : 0 }}
          className="fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            x: ringX,
            y: ringY,
            width: 36,
            height: 36,
            border: "1.5px solid",
            borderColor: hovering ? "rgba(217,161,52,0.7)" : "rgba(255,255,255,0.25)",
            scale: ringScale,
            boxShadow: hovering ? "0 0 20px rgba(217,161,52,0.25), inset 0 0 12px rgba(217,161,52,0.1)" : "none",
            transition: "border-color 0.3s, box-shadow 0.3s",
          }}
        />

        {/* Inner dot */}
        <motion.div
          style={{ x: cursorX, y: cursorY }}
          animate={{
            opacity: visible ? 1 : 0,
            scale: clicking ? 0.6 : hovering ? 0.5 : 1,
          }}
          transition={{ scale: { type: "spring", stiffness: 500, damping: 30 } }}
          className="fixed top-0 left-0 -translate-x-1/2 -translate-y-1.5 w-2.5 h-2.5 rounded-full"
          style={{
            background: "radial-gradient(circle, #d4af37 30%, #b8941f 100%)",
            boxShadow: "0 0 10px rgba(217,161,52,0.6), 0 0 20px rgba(217,161,52,0.3)",
          }}
        />
      </div>
    </>
  );
}
