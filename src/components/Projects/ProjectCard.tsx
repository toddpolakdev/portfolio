import Image from "next/image";
import Link from "next/link";
import { FiArrowUpRight, FiExternalLink, FiGithub } from "react-icons/fi";
import styles from "./Projects.module.css";
import type { Project } from "@/types/types";

type Props = {
  project: Project;
  /** Lead card spans two columns and gets a wider preview. */
  wide?: boolean;
  /** Only the first card is eager — the rest lazy-load. */
  priority?: boolean;
};

export default function ProjectCard({ project, wide, priority }: Props) {
  return (
    <article className={`${styles.card} ${wide ? styles.wide : ""} reveal`}>
      <div className={styles.chrome}>
        <span className={styles.dot} aria-hidden="true" />
        <span className={styles.dot} aria-hidden="true" />
        <span className={styles.dot} aria-hidden="true" />
        <span className={styles.chromeTitle}>~/projects/{project.slug}</span>
        {project.featured && <span className={styles.badge}>featured</span>}
      </div>

      <div className={styles.shot}>
        {project.image ? (
          <Image
            src={project.image}
            alt={`${project.title} screenshot`}
            fill
            priority={priority}
            sizes={
              wide
                ? "(max-width: 760px) 100vw, 780px"
                : "(max-width: 760px) 100vw, 390px"
            }
          />
        ) : (
          <div className={styles.noShot}>no preview</div>
        )}
      </div>

      <div className={styles.body}>
        <div className={styles.titleRow}>
          <h3 className={styles.title}>{project.title}</h3>
          {project.year && <span className={styles.year}>{project.year}</span>}
        </div>

        {project.tagline && <p className={styles.tagline}>{project.tagline}</p>}

        {project.tags.length > 0 && (
          <div className={styles.tags}>
            {project.tags.map((tag) => (
              <span key={tag} className={styles.tag}>
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className={styles.actions}>
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.action}
          >
            <FiExternalLink size={12} /> live
          </a>
        )}

        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.action}
          >
            <FiGithub size={12} /> source
          </a>
        )}

        <Link
          href={`/work/${project.slug}`}
          className={styles.detail}
          aria-label={`Read more about ${project.title}`}
        >
          cd ./{project.slug} <FiArrowUpRight size={12} />
        </Link>
      </div>
    </article>
  );
}
