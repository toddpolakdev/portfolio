"use client";

import { motion, useScroll, useSpring } from "framer-motion";

const ScrollAnimations = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "3px",
        background: "linear-gradient(90deg, #00d4ff, #ff6b9d)",
        transformOrigin: "0%",
        scaleX,
        zIndex: 10000,
      }}
    />
  );
};

export default ScrollAnimations;
