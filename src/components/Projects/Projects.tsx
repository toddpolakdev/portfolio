import styles from "./projects.module.css";
import ProjectCard from "../../components/ProjectCard/ProjectCard";

export default function Projects() {
  return (
    <section id="projects">
      <div className={styles.container}>
        <h1>Projects</h1>
        <div className={styles.grid}>
          <ProjectCard
            title="React Calculator"
            description="A scientific calculator built with React."
            image="/images/react-calculator-app.png"
            liveUrl="https://react-calculator-flax-chi.vercel.app/"
            githubUrl="https://github.com/toddpolakdev/react-calculator"
          />
          <ProjectCard
            title="Flipbook Image Viewer"
            description=""
            image="/images/flipbook-app.png"
            liveUrl="https://flipbook-app-web.vercel.app/"
            githubUrl="https://github.com/toddpolakdev/flipbook-app"
          />
          <ProjectCard
            title="YouTube Favorites"
            description="Save and organize your favorite YouTube videos."
            image="/images/youtube-favorites-app.png"
            liveUrl="https://youtube-favorites-git-main-todd-polaks-projects.vercel.app/"
            githubUrl="https://github.com/toddpolakdev/youtube-favorites"
          />
        </div>
      </div>
    </section>
  );
}
