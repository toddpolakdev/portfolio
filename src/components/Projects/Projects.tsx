import Section from "@/components/Section/Section";
import ProjectCard from "./ProjectCard";
import styles from "./Projects.module.css";
import type { Project } from "@/types/types";

export default function Projects({ projects }: { projects: Project[] }) {
  return (
    <Section
      id="work"
      command="ls"
      flag="-lah ./projects"
      title="Selected Work"
      meta={projects.length ? `${projects.length} repositories` : undefined}
    >
      {projects.length === 0 ? (
        <p className={styles.empty}>
          No published projects yet — add one from the admin portal.
        </p>
      ) : (
        <div className={styles.grid}>
          {projects.map((project, i) => (
            <ProjectCard
              key={project.slug}
              project={project}
              // Lead with the first project at full width, but only when there
              // are enough others to keep the grid balanced.
              wide={i === 0 && projects.length > 2}
              priority={i === 0}
            />
          ))}
        </div>
      )}
    </Section>
  );
}
