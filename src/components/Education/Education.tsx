import React from "react";
import styles from "./Education.module.css";
import clsx from "clsx";

type EducationItem = {
  degree: string;
  institution: string;
  ducation: string;
  description: string[];
};

type Props = {
  title: string;
  education: EducationItem[];
};

const Education: React.FC<Props> = ({ title, education }) => {
  return (
    <section id="education" className="section">
      <div className="container">
        <h2 className="sectionTitle fade-in">{title}</h2>
        <div className={clsx(styles.educationTimeline, "fade-in")}>
          {education.map((educationItem, educationIndex) => (
            <div key={educationIndex} className={styles.educationItem}>
              <div className={styles.educationHeader}>
                <div className={styles.degree}>{educationItem.degree}</div>
                <div className={styles.institution}>
                  {educationItem.institution}
                </div>
              </div>

              <div className={styles.courseDescriptions}>
                <ul>
                  {educationItem.description.map((item, index) => (
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

export default Education;
