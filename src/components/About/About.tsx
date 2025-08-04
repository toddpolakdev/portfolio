import React from "react";
import styles from "./About.module.css";
import clsx from "clsx";

type Props = {
  title: string;
  content: string[];
};

const About: React.FC<Props> = ({ title, content }) => (
  <section id="about" className="section">
    <div className="container">
      <h2 className="sectionTitle fade-in">{title}</h2>
      <div className={clsx(styles.aboutGrid, "fade-in")}>
        <div className={styles.aboutImage}>TP</div>
        <div className={styles.aboutText}>
          {content.map((graph, index) => (
            <p key={index}>{graph}</p>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default About;
