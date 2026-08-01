import Section from "@/components/Section/Section";
import styles from "./Experience.module.css";
import type { Section as SectionType } from "@/types/types";

/**
 * Deterministic 7-char hex from the role, so each "commit" keeps the same id
 * across renders instead of flickering on every request.
 */
function fakeHash(seed: string) {
  let h = 0x811c9dc5;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(16).padStart(8, "0").slice(0, 7);
}

export default function Experience({ section }: { section?: SectionType }) {
  const jobs = section?.experience ?? [];
  if (!section || jobs.length === 0) return null;

  return (
    <Section
      id="experience"
      command="git log"
      flag='--author="Todd Polak"'
      title={section.title}
      meta={`${jobs.length} commits`}
    >
      <div className={styles.log}>
        {jobs.map((job) => (
          <article
            key={`${job.company}-${job.title}`}
            className={`${styles.entry} reveal`}
          >
            <div className={styles.rail} aria-hidden="true">
              <span className={styles.node} />
              <span className={styles.stem} />
            </div>

            <div>
              <p className={styles.hash} aria-hidden="true">
                commit {fakeHash(`${job.company}${job.title}`)}{" "}
                <span>(HEAD → {job.company.toLowerCase().replace(/\s+/g, "-")})</span>
              </p>

              <h3 className={styles.title}>
                {job.title} <span className={styles.at}>@</span>{" "}
                <span className={styles.company}>{job.company}</span>
              </h3>

              <p className={styles.duration}>{job.duration}</p>

              <ul className={styles.bullets}>
                {job.description.map((line, i) => (
                  <li key={i} className={styles.bullet}>
                    <span className={styles.plus} aria-hidden="true">
                      +
                    </span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}
