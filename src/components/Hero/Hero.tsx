import React from "react";
import styles from "./Hero.module.css";
import Button from "../Button/Button";

type HeroProps = {
  title: string;
  subtitle: string;
  description: string;
};

const Hero: React.FC<HeroProps> = ({ title, subtitle, description }) => {
  return (
    <section className={styles.hero}>
      <div className="floatingElements">
        <div className="floatingElement"></div>
        <div className="floatingElement"></div>
        <div className="floatingElement"></div>
      </div>
      <div className="container">
        <div className={styles.heroContent}>
          <h1>{title}</h1>
          <p className={styles.subtitle}>{subtitle}</p>
          <p className={styles.description}>{description}</p>
          <div className={styles.ctaButtons}>
            <Button href="#" variant="primary">
              View My Work
            </Button>
            <Button href="#contact" variant="secondary">
              Get In Touch
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
