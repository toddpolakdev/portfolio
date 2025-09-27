"use client";

import React from "react";
import { motion } from "framer-motion";

// Seeded random
function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

const FloatingShape: React.FC<{ index: number }> = ({ index }) => {
  const shapes = ["circle", "triangle", "square"];
  const shape = shapes[index % shapes.length];

  const size = 20 + seededRandom(index) * 40;
  const left = 10 + seededRandom(index + 1) * 80;
  const top = 10 + seededRandom(index + 2) * 80;
  const duration = 6 + seededRandom(index + 3) * 4;
  const delay = seededRandom(index + 4) * 2;

  const baseStyle: React.CSSProperties = {
    width: `${size}px`,
    height: `${size}px`,
    position: "absolute",
    left: `${left}%`,
    top: `${top}%`,
    opacity: 0.3,
  };

  let style: React.CSSProperties;
  switch (shape) {
    case "circle":
      style = {
        ...baseStyle,
        borderRadius: "50%",
        background: "rgba(0, 212, 255, 0.3)",
      };
      break;
    case "triangle":
      style = {
        ...baseStyle,
        background: "transparent",
        border: "2px solid rgba(0, 212, 255, 0.3)",
        clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
      };
      break;
    case "square":
      style = {
        ...baseStyle,
        background: "transparent",
        border: "2px solid rgba(255, 107, 157, 0.3)",
        transform: "rotate(45deg)",
      };
      break;
    default:
      style = baseStyle;
  }

  return (
    <motion.div
      style={style}
      animate={{ rotate: [0, 360], scale: [1, 1.2, 1], y: [-20, 20, -20] }}
      transition={{ duration, repeat: Infinity, ease: "easeInOut", delay }}
    />
  );
};

export default FloatingShape;
