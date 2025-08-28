"use client";

import { useEffect } from "react";
import { motion, useScroll, useSpring } from "framer-motion";

const ScrollAnimations = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    const handleSmoothScroll = (e: Event) => {
      const target = e.target as HTMLAnchorElement;
      const href = target.getAttribute("href");

      if (href && href.startsWith("#") && href !== "#") {
        e.preventDefault();
        const element = document.querySelector(href);
        if (element) {
          const headerHeight = 100; // Adjust this to match your header height
          const elementPosition =
            element.getBoundingClientRect().top + window.pageYOffset;
          const offsetPosition = elementPosition - headerHeight;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });
        }
      } else if (href === "#") {
        e.preventDefault();
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }
    };

    document.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "A") {
        handleSmoothScroll(e);
      }
    });

    return () => {
      document.removeEventListener("click", handleSmoothScroll);
    };
  }, []);

  return (
    <>
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

      <motion.button
        style={{
          position: "fixed",
          bottom: "2rem",
          right: "2rem",
          width: "50px",
          height: "50px",
          borderRadius: "50%",
          background: "linear-gradient(45deg, #00d4ff, #ff6b9d)",
          border: "none",
          color: "white",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.2rem",
          zIndex: 1000,
        }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{
          opacity: scrollYProgress.get() > 0.2 ? 1 : 0,
          scale: scrollYProgress.get() > 0.2 ? 1 : 0,
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
        ↑
      </motion.button>
    </>
  );
};

export default ScrollAnimations;
