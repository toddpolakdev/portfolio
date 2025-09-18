import Image from "next/image";
import { FaGithub } from "react-icons/fa";
import styles from "./ProjectCard.module.css";

type ProjectCardProps = {
  title: string;
  description: string;
  image: string;
  liveUrl: string;
  githubUrl?: string;
};

export default function ProjectCard({
  title,
  description,
  image,
  liveUrl,
  githubUrl,
}: ProjectCardProps) {
  return (
    <div className={styles.card}>
      <a
        href={liveUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.thumbWrapper}>
        <Image
          src={image}
          alt={`${title} Preview`}
          className={styles.image}
          width={400}
          height={300}
        />
      </a>
      <div className={styles.cardContent}>
        <h2>{title}</h2>
        {description && <p>{description}</p>}
        <div className={styles.links}>
          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.githubLink}>
              <FaGithub size={22} />
            </a>
          )}
          <a href={liveUrl} target="_blank" rel="noopener noreferrer">
            <span className={styles.link}>View Demo</span>
          </a>
        </div>
      </div>
    </div>
  );
}
