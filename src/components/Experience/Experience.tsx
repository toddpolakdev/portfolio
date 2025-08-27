import React from "react";
import styles from "./Experience.module.css";
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

const Experience: React.FC<Props> = ({ title, experience }) => {
  return (
    <section id="experience" className="section">
      <div className="container">
        <h2 className="sectionTitle fade-in">{title}</h2>
        <div className={clsx(styles.experienceTimeline, "fade-in")}>
          {experience?.map((experienceItem, experienceIndex) => (
            <div key={experienceIndex} className={styles.experienceItem}>
              <div className={styles.experienceHeader}>
                <div className={styles.jobTitle}>{experienceItem.title}</div>
                <div className={styles.company}>{experienceItem.company}</div>
                <div className={styles.duration}>{experienceItem.duration}</div>
              </div>

              <div className={styles.jobDescription}>
                <ul>
                  {experienceItem.description.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
