import React from "react";
import { motion } from "framer-motion";
import styles from "./Skills_M.module.css";
import clsx from "clsx";

type SkillCategory = {
  category: string;
  tags: string[];
};

type Props = {
  title: string;
  skills: SkillCategory[];
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const categoryVariants = {
  hidden: {
    opacity: 0,
    y: 30,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
  },
};

const tagVariants = {
  hidden: {
    opacity: 0,
    scale: 0,
    rotate: -10,
  },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
  },
  hover: {
    scale: 1.1,
    rotate: 2,
  },
};

const titleVariants = {
  hidden: { opacity: 0, y: -30 },
  visible: { opacity: 1, y: 0 },
};

const Skills: React.FC<Props> = ({ title, skills }) => {
  return (
    <section id="skills" className="section">
      <div className="container">
        <motion.h2
          className="sectionTitle fade-in"
          variants={titleVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}>
          {title}
        </motion.h2>

        <motion.div
          className={clsx(styles.skillsGrid, "fade-in")}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}>
          {skills?.map((skill, skillIndex) => (
            <motion.div
              key={skillIndex}
              className={styles.skillCategory}
              variants={categoryVariants}
              whileHover={{
                scale: 1.02,
                boxShadow: "0 10px 30px rgba(0, 212, 255, 0.2)",
                transition: { duration: 0.3 },
              }}>
              <motion.h3
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: skillIndex * 0.1 + 0.3 }}>
                {skill.category}
              </motion.h3>

              <motion.div
                className={styles.skillTags}
                variants={containerVariants}>
                {skill.tags.map((tag, tagIndex) => (
                  <motion.span
                    key={tagIndex}
                    className={styles.skillTag}
                    variants={tagVariants}
                    whileHover="hover"
                    whileTap={{ scale: 0.95 }}
                    style={{
                      cursor: "pointer",
                    }}>
                    {tag}
                  </motion.span>
                ))}
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;
