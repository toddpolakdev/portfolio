import React from "react";
import { motion } from "framer-motion";
import styles from "./Education_M.module.css";
import clsx from "clsx";

type EducationItem = {
  degree: string;
  institution: string;
  duration: string;
  description: string[];
};

type Props = {
  title: string;
  education: EducationItem[];
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    x: -60,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
  },
};

const descriptionVariants = {
  hidden: { opacity: 0, y: 15, x: -10 },
  visible: { opacity: 1, y: 0, x: 0 },
};

const timelineVariants = {
  hidden: { scaleY: 0, originY: 0 },
  visible: { scaleY: 1 },
};

const dotVariants = {
  hidden: { scale: 0, rotate: 180 },
  visible: { scale: 1, rotate: 0 },
  hover: {
    scale: 1.4,
    boxShadow: "0 0 25px rgba(255, 107, 157, 0.8)",
    background: "#ff6b9d",
  },
};

const Education: React.FC<Props> = ({ title, education }) => {
  return (
    <section id="education" className="section">
      <div className="container">
        <motion.h2
          className="sectionTitle fade-in"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 12,
          }}>
          {title}
        </motion.h2>

        <div
          className={clsx(styles.educationTimeline, "fade-in")}
          style={{ position: "relative" }}>
          <motion.div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              height: "100%",
              width: "3px",
              background: "linear-gradient(to bottom, #ff6b9d, #00d4ff)",
            }}
            variants={timelineVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={{
              duration: 1.8,
              ease: "easeInOut",
              delay: 0.2,
            }}
          />

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={{
              staggerChildren: 0.25,
              delayChildren: 0.3,
            }}>
            {education?.map((educationItem, educationIndex) => (
              <motion.div
                key={educationIndex}
                className={styles.educationItem}
                variants={itemVariants}
                transition={{
                  type: "spring",
                  stiffness: 120,
                  damping: 15,
                }}
                whileHover={{
                  x: 15,
                  transition: { duration: 0.3 },
                }}
                style={{ position: "relative" }}>
                <motion.div
                  style={{
                    position: "absolute",
                    left: "-1.5rem",
                    top: 0,
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    background: "#ff6b9d",
                  }}
                  variants={dotVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{
                    type: "spring",
                    stiffness: 180,
                    damping: 12,
                    delay: educationIndex * 0.1 + 0.4,
                  }}
                  whileHover={{
                    scale: 1.4,
                    boxShadow: "0 0 25px rgba(255, 107, 157, 0.8)",
                    background: "#ff6b9d",
                    transition: { duration: 0.3 },
                  }}
                />

                <motion.div
                  className={styles.educationHeader}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: educationIndex * 0.25 + 0.5 }}>
                  <motion.div
                    className={styles.degree}
                    whileHover={{
                      color: "#ff6b9d",
                      scale: 1.02,
                      transition: { duration: 0.3 },
                    }}>
                    {educationItem.degree}
                  </motion.div>
                  <motion.div
                    className={styles.institution}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: educationIndex * 0.25 + 0.6 }}
                    whileHover={{
                      x: 5,
                      transition: { duration: 0.2 },
                    }}>
                    {educationItem.institution}
                  </motion.div>
                </motion.div>

                <motion.div
                  className={styles.courseDescriptions}
                  initial={{ opacity: 0, height: 0 }}
                  whileInView={{ opacity: 1, height: "auto" }}
                  viewport={{ once: true }}
                  transition={{
                    delay: educationIndex * 0.25 + 0.7,
                    duration: 0.6,
                    ease: "easeOut",
                  }}>
                  <motion.ul
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: educationIndex * 0.25 + 0.9 }}>
                    {educationItem.description.map((item, index) => (
                      <motion.li
                        key={index}
                        variants={descriptionVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        transition={{
                          delay: index * 0.08,
                          duration: 0.4,
                          ease: "easeOut",
                        }}
                        whileHover={{
                          x: 8,
                          color: "#ff6b9d",
                          scale: 1.02,
                          transition: { duration: 0.2 },
                        }}
                        style={{
                          position: "relative",
                          paddingLeft: "1rem",
                        }}>
                        {/* Animated list bullet */}
                        <motion.span
                          style={{
                            position: "absolute",
                            left: 0,
                            top: "0.6rem",
                            width: "6px",
                            height: "6px",
                            background:
                              "linear-gradient(45deg, #ff6b9d, #00d4ff)",
                            borderRadius: "50%",
                          }}
                          animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.6, 1, 0.6],
                          }}
                          transition={{
                            duration: 2.5,
                            repeat: Infinity,
                            delay: index * 0.3,
                          }}
                        />
                        {item}
                      </motion.li>
                    ))}
                  </motion.ul>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Education;
