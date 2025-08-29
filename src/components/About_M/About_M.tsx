import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import styles from "./About_M.module.css";
import clsx from "clsx";
import Image from "next/image";

type Props = {
  title: string;
  content: string[];
};

const About: React.FC<Props> = ({ title, content }) => {
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.8, 1]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 5]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const imageVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      x: -50,
    },
    visible: {
      opacity: 1,
      scale: 1,
      x: 0,
    },
  };

  const textVariants = {
    hidden: {
      opacity: 0,
      x: 50,
    },
    visible: {
      opacity: 1,
      x: 0,
    },
  };

  const paragraphVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  return (
    <section id="about" className="section">
      <div className="container">
        <motion.h2
          className="sectionTitle fade-in"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}>
          {title}
        </motion.h2>

        <motion.div
          className={clsx(styles.aboutGrid, "fade-in")}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          transition={{
            staggerChildren: 0.3,
            delayChildren: 0.1,
          }}>
          <motion.div
            className={styles.aboutImage}
            variants={imageVariants}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 15,
              duration: 0.8,
            }}
            whileHover={{
              scale: 1.05,
              rotate: 2,
              transition: { duration: 0.3 },
            }}
            style={{ scale, rotate }}>
            <motion.div
              whileHover={{
                scale: 1.1,
                transition: { duration: 0.3 },
              }}
              style={{
                position: "relative",
                width: "100%",
                height: "100%",
                overflow: "hidden",
                borderRadius: "20px",
                background: "linear-gradient(45deg, #00d4ff20, #ff6b9d20)",
                padding: "4px",
              }}>
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "16px",
                  overflow: "hidden",
                  position: "relative",
                }}>
                <Image
                  src="/images/about.svg"
                  alt=""
                  width={300}
                  height={300}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />

                <motion.div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(45deg, transparent, rgba(0, 212, 255, 0.1), transparent)",
                  }}
                  animate={{
                    x: ["-100%", "100%"],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 3,
                    ease: "easeInOut",
                  }}
                />
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            className={styles.aboutText}
            variants={textVariants}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 15,
              staggerChildren: 0.2,
              delayChildren: 0.2,
            }}>
            {content?.map((paragraph, index) => (
              <motion.p
                key={index}
                variants={paragraphVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{
                  delay: index * 0.2,
                  duration: 0.6,
                  ease: "easeOut",
                }}
                whileHover={{
                  x: 10,
                  transition: { duration: 0.3 },
                }}
                style={{
                  marginBottom: "1.5rem",
                  position: "relative",
                  paddingLeft: "20px",
                }}>
                <motion.span
                  style={{
                    position: "absolute",
                    left: 0,
                    top: "0.7rem",
                    width: "8px",
                    height: "8px",
                    background: "linear-gradient(45deg, #00d4ff, #ff6b9d)",
                    borderRadius: "50%",
                  }}
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.7, 1, 0.7],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: index * 0.2,
                  }}
                />
                {paragraph}
              </motion.p>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
