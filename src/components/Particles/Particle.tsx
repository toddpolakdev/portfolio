"use client";

import React from "react";
import { motion, useAnimation } from "framer-motion";

// Seeded random so SSR/CSR are consistent
function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

const Particle: React.FC<{ index: number }> = ({ index }) => {
  const controls = useAnimation();

  const size = 4 + seededRandom(index) * 8;
  const color = seededRandom(index + 1) > 0.5 ? "#00d4ff" : "#ff6b9d";
  const left = seededRandom(index + 2) * 100;
  const top = seededRandom(index + 3) * 100;

  const randomX = seededRandom(index + 4) * 100 - 50;
  const randomY = seededRandom(index + 5) * 100 - 50;
  const delay = seededRandom(index + 6);
  const duration = 4 + seededRandom(index + 7) * 4;

  React.useEffect(() => {
    controls.start({
      x: [0, randomX, randomX, 0],
      y: [0, randomY, randomY, 0],
      scale: [1, 1.2, 0.8, 1],
      opacity: [0.3, 0.8, 0.4, 0.3],
      transition: {
        duration,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      },
    });
  }, [controls, randomX, randomY, delay, duration]);

  return (
    <motion.div
      animate={controls}
      style={{
        position: "absolute",
        width: `${size}px`,
        height: `${size}px`,
        background: `radial-gradient(circle, ${color}40, transparent)`,
        borderRadius: "50%",
        left: `${left}%`,
        top: `${top}%`,
        pointerEvents: "none",
      }}
    />
  );
};

export default Particle;
