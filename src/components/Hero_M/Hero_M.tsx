import React, { useEffect } from "react";
import { motion, useAnimation, useScroll, useTransform } from "framer-motion";
import styles from "./Hero_M.module.css";
import Button from "../Button/Button";

type HeroProps = {
  title: string;
  subtitle: string;
  description: string;
};

const Particle: React.FC<{ index: number }> = () => {
  const controls = useAnimation();

  useEffect(() => {
    controls.start({
      x: [0, Math.random() * 100 - 50, Math.random() * 100 - 50, 0],
      y: [0, Math.random() * 100 - 50, Math.random() * 100 - 50, 0],
      scale: [1, 1.2, 0.8, 1],
      opacity: [0.3, 0.8, 0.4, 0.3],
      transition: {
        duration: 4 + Math.random() * 4,
        repeat: Infinity,
        ease: "easeInOut",
        delay: Math.random() * 2,
      },
    });
  }, [controls]);

  return (
    <motion.div
      animate={controls}
      style={{
        position: "absolute",
        width: `${4 + Math.random() * 8}px`,
        height: `${4 + Math.random() * 8}px`,
        background: `radial-gradient(circle, ${
          Math.random() > 0.5 ? "#00d4ff" : "#ff6b9d"
        }40, transparent)`,
        borderRadius: "50%",
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        pointerEvents: "none",
      }}
    />
  );
};

const FloatingShape: React.FC<{ index: number }> = ({ index }) => {
  const shapes = ["circle", "triangle", "square"];
  const shape = shapes[index % shapes.length];

  const getShapeStyle = () => {
    const size = 20 + Math.random() * 40;
    const baseStyle = {
      width: `${size}px`,
      height: `${size}px`,
      position: "absolute" as const,
      left: `${10 + Math.random() * 80}%`,
      top: `${10 + Math.random() * 80}%`,
      opacity: 0.3,
      // border: ".1px solid #000",
      // background: "#1f0505ff",
      background: "rgba(0, 212, 255, 0.3)",
    };

    switch (shape) {
      case "circle":
        return { ...baseStyle, borderRadius: "50%" };
      case "triangle":
        return {
          ...baseStyle,
          background: "transparent",
          border: "2px solid rgba(0, 212, 255, 0.3)",
          clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
        };
      case "square":
        return {
          ...baseStyle,
          background: "transparent",
          border: "2px solid rgba(255, 107, 157, 0.3)",
          transform: "rotate(45deg)",
        };
      default:
        return baseStyle;
    }
  };

  return (
    <motion.div
      style={getShapeStyle()}
      animate={{
        rotate: [0, 360],
        scale: [1, 1.2, 1],
        y: [-20, 20, -20],
      }}
      transition={{
        duration: 6 + Math.random() * 4,
        repeat: Infinity,
        ease: "easeInOut",
        delay: Math.random() * 2,
      }}
    />
  );
};

const Hero: React.FC<HeroProps> = ({ title, subtitle, description }) => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, -50]);
  const y2 = useTransform(scrollY, [0, 300], [0, -100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0.3]);

  const titleVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.8,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
    },
  };

  const subtitleVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  const descriptionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
    },
  };

  const buttonItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  const bgY = useTransform(scrollY, [0, 300], [0, -100]);

  return (
    <motion.section className={styles.hero} style={{ opacity }}>
      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          // backgroundImage: "linear-gradient(135deg, #1f2937 0%, #111827 100%)",
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
        {Array.from({ length: 40 }, (_, i) => (
          <Particle key={i} index={i} />
        ))}
      </div>

      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          pointerEvents: "none",
          y: y1,
        }}>
        {Array.from({ length: 100 }, (_, i) => (
          <FloatingShape key={i} index={i} />
        ))}
      </motion.div>

      <div className="container">
        <motion.div
          className={styles.heroContent}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            ease: "easeOut",
          }}>
          <motion.h1
            variants={titleVariants}
            initial="hidden"
            animate="visible"
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 15,
              delay: 0.2,
            }}
            whileHover={{
              scale: 1.05,
              transition: { duration: 0.3 },
            }}>
            {title}
          </motion.h1>

          <motion.p
            className={styles.subtitle}
            variants={subtitleVariants}
            initial="hidden"
            animate="visible"
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 15,
              delay: 0.4,
            }}>
            {subtitle}
          </motion.p>

          <motion.p
            className={styles.description}
            variants={descriptionVariants}
            initial="hidden"
            animate="visible"
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 15,
              delay: 0.6,
            }}>
            {description}
          </motion.p>

          <motion.div
            className={styles.ctaButtons}
            variants={buttonVariants}
            initial="hidden"
            animate="visible"
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 15,
              delay: 0.8,
              staggerChildren: 0.1,
            }}>
            <motion.div
              variants={buttonItemVariants}
              initial="hidden"
              animate="visible"
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 15,
                delay: 0.9,
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}>
              <Button href="#projects" variant="primary">
                View My Work
              </Button>
            </motion.div>
            <motion.div
              variants={buttonItemVariants}
              initial="hidden"
              animate="visible"
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 15,
                delay: 1.0,
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}>
              <Button href="#contact" variant="secondary">
                Get In Touch
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Hero;
