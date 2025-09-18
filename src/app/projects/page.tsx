import Link from "next/link";
import styles from "./projects.module.css";
import ProjectCard from "../../components/ProjectCard/ProjectCard";

export default function ProjectsPage() {
  return (
    <main className={styles.container}>
      <h1>My Projects</h1>
      <div className={styles.grid}>
        <ProjectCard
          title="React Calculator"
          description="A scientific calculator built with React."
          image="/images/react-calculator-app.png"
          liveUrl="https://react-calculator-flax-chi.vercel.app/"
          githubUrl="https://github.com/toddpolakdev/react-calculator"
        />
        <ProjectCard
          title="YouTube Favorites"
          description="Save and organize your favorite YouTube videos."
          image="/images/youtube-favorites-app.png"
          liveUrl="https://youtube-favorites-git-main-todd-polaks-projects.vercel.app/"
          githubUrl="https://github.com/toddpolakdev/youtube-favorites"
        />
      </div>
      <div className={styles.backLink}>
        <Link href="/">← Back to Home</Link>
      </div>
    </main>
  );
}
