import React from "react";
import { motion } from "framer-motion";
import styles from "./Experience_M.module.css";
import clsx from "clsx";

type ExperienceItem = {
  title: string;
  company: string;
  duration: string;
  description: string[];
};

type Props = {
  title: string;
  experience: ExperienceItem[];
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    x: -50,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
  },
};

const descriptionVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

const timelineVariants = {
  hidden: { scaleY: 0, originY: 0 },
  visible: { scaleY: 1 },
};

const dotVariants = {
  hidden: { scale: 0, rotate: -180 },
  visible: { scale: 1, rotate: 0 },
  hover: {
    scale: 1.5,
    boxShadow: "0 0 20px rgba(0, 212, 255, 0.8)",
  },
};

const Experience: React.FC<Props> = ({ title, experience }) => {
  return (
    <section id="experience" className="section">
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
          className={clsx(styles.experienceTimeline, "fade-in")}
          style={{ position: "relative" }}>
          <motion.div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              height: "100%",
              width: "3px",
              background: "linear-gradient(to bottom, #00d4ff, #ff6b9d)",
            }}
            variants={timelineVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={{
              duration: 1.5,
              ease: "easeInOut",
              delay: 0.3,
            }}
          />

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={{
              staggerChildren: 0.3,
              delayChildren: 0.2,
            }}>
            {experience?.map((experienceItem, experienceIndex) => (
              <motion.div
                key={experienceIndex}
                className={styles.experienceItem}
                variants={itemVariants}
                transition={{
                  type: "spring",
                  stiffness: 100,
                  damping: 12,
                }}
                whileHover={{
                  x: 10,
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
                    background: "#00d4ff",
                  }}
                  variants={dotVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 15,
                    delay: experienceIndex * 0.1 + 0.5,
                  }}
                  whileHover={{
                    scale: 1.5,
                    boxShadow: "0 0 20px rgba(0, 212, 255, 0.8)",
                    transition: { duration: 0.3 },
                  }}
                />

                <motion.div
                  className={styles.experienceHeader}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: experienceIndex * 0.2 + 0.4 }}>
                  <motion.div
                    className={styles.jobTitle}
                    whileHover={{
                      color: "#00d4ff",
                      transition: { duration: 0.3 },
                    }}>
                    {experienceItem.title}
                  </motion.div>
                  <motion.div
                    className={styles.company}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: experienceIndex * 0.2 + 0.5 }}>
                    {experienceItem.company}
                  </motion.div>
                  <motion.div
                    className={styles.duration}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: experienceIndex * 0.2 + 0.6 }}>
                    {experienceItem.duration}
                  </motion.div>
                </motion.div>

                <motion.div
                  className={styles.jobDescription}
                  initial={{ opacity: 0, height: 0 }}
                  whileInView={{ opacity: 1, height: "auto" }}
                  viewport={{ once: true }}
                  transition={{
                    delay: experienceIndex * 0.2 + 0.7,
                    duration: 0.5,
                    ease: "easeOut",
                  }}>
                  <ul>
                    {experienceItem.description.map((item, index) => (
                      <motion.li
                        key={index}
                        variants={descriptionVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        transition={{
                          delay: index * 0.1,
                          duration: 0.5,
                          ease: "easeOut",
                        }}
                        whileHover={{
                          x: 5,
                          color: "#00d4ff",
                          transition: { duration: 0.2 },
                        }}>
                        {item}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
