import React from "react";
import styles from "./Skills.module.css";
import clsx from "clsx";

type SkillCategory = {
  // __typename: string;
  category: string;
  tags: string[];
};

type Props = {
  title: string;
  skills: SkillCategory[];
};

const Skills: React.FC<Props> = ({ title, skills }) => {
  return (
    <section id="skills" className="section">
      <div className="container">
        <h2 className="sectionTitle fade-in">{title}</h2>
        <div className={clsx(styles.skillsGrid, "fade-in")}>
          {skills.map((skill, skillIndex) => (
            <div key={skillIndex} className={styles.skillCategory}>
              <h3>{skill.category}</h3>
              <div className={styles.skillTags}>
                {skill.tags.map((tag, tagIndex) => (
                  <span key={tagIndex} className={styles.skillTag}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
