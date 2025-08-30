import Image from "next/image";
import Link from "next/link";
import styles from "./projects.module.css";

export default function ProjectsPage() {
  return (
    <main className={styles.container}>
      <h1>My Projects</h1>
      <div className={styles.grid}>
        <a
          href="https://react-calculator-flax-chi.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.card}>
          <div className={styles.thumbWrapper}>
            <Image
              src="/images/react-calculator-app.png"
              alt="React Calculator Preview"
              className={styles.image}
              width={200}
              height={300}
            />
          </div>
          <h2>React Calculator</h2>
          <p>A scientific calculator built with React.</p>
          <span className={styles.link}>View Live Project →</span>
        </a>
      </div>
      <div className={styles.backLink}>
        <Link href="/">← Back to Home</Link>
      </div>
    </main>
  );
}
