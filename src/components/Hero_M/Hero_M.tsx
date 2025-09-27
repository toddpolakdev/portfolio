"use client";

import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import styles from "./Hero_M.module.css";
import Button from "../Button/Button";
import Particle from "../Particles/Particle";
import FloatingShape from "../Particles/FloatingShape";
import ClientOnly from "../../utils/ClientOnly";

type HeroProps = {
  title: string;
  subtitle: string;
  description: string;
};

const Hero: React.FC<HeroProps> = ({ title, subtitle, description }) => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, -50]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0.3]);
  const bgY = useTransform(scrollY, [0, 300], [0, -100]);

  return (
    <motion.section className={styles.hero} style={{ opacity }}>
      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          backgroundSize: "cover",
          backgroundPosition: "center",
          y: bgY,
          zIndex: -1,
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          pointerEvents: "none",
        }}>
        <ClientOnly>
          {Array.from({ length: 40 }, (_, i) => (
            <Particle key={i} index={i} />
          ))}
        </ClientOnly>
      </div>

      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          pointerEvents: "none",
          y: y1,
        }}>
        <ClientOnly>
          {Array.from({ length: 100 }, (_, i) => (
            <FloatingShape key={i} index={i} />
          ))}
        </ClientOnly>
      </motion.div>

      <div className="container">
        <motion.div
          className={styles.heroContent}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}>
          <motion.h1>{title}</motion.h1>
          <motion.p className={styles.subtitle}>{subtitle}</motion.p>
          <motion.p className={styles.description}>{description}</motion.p>

          <div className={styles.ctaButtons}>
            <Button href="#projects" variant="primary">
              View My Work
            </Button>
            <Button href="#contact" variant="secondary">
              Get In Touch
            </Button>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Hero;
