import React from "react";
import styles from "./About.module.css";
import clsx from "clsx";
import Image from "next/image";

type Props = {
  title: string;
  content: string[];
};

const About: React.FC<Props> = ({ title, content }) => (
  <section id="about" className="section">
    <div className="container">
      <h2 className="sectionTitle fade-in">{title}</h2>
      <div className={clsx(styles.aboutGrid, "fade-in")}>
        <div className={styles.aboutImage}>
          {/* <Image
            src="/images/web-dev.png"
            alt="Web Dev"
            width={500}
            height={300}
          /> */}
        </div>
        <div className={styles.aboutText}>
          {content?.map((graph, index) => (
            <p key={index}>{graph}</p>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default About;
