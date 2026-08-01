import Section from "@/components/Section/Section";
import styles from "./Education.module.css";
import type { Section as SectionType } from "@/types/types";

export default function Education({ section }: { section?: SectionType }) {
  const entries = section?.education ?? [];
  if (!section || entries.length === 0) return null;

  return (
    <Section
      id="education"
      command="cat"
      flag="./education/*.md"
      title={section.title}
      meta={`${entries.length} files`}
    >
      <div className={styles.grid}>
        {entries.map((entry) => (
          <article
            key={`${entry.institution}-${entry.degree}`}
            className={`${styles.card} reveal`}
          >
            <div className={styles.head}>
              <span className={styles.icon} aria-hidden="true">
                ◆
              </span>
              <span>credential</span>
              <span className={styles.duration}>{entry.duration}</span>
            </div>

            <div className={styles.body}>
              <h3 className={styles.degree}>{entry.degree}</h3>
              <p className={styles.institution}>{entry.institution}</p>

              <ul className={styles.list}>
                {entry.description.map((line, i) => (
                  <li key={i} className={styles.item}>
                    <span className={styles.marker} aria-hidden="true">
                      ›
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
