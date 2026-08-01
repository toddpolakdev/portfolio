import Section from "@/components/Section/Section";
import styles from "./Skills.module.css";
import type { Section as SectionType } from "@/types/types";

export default function Skills({ section }: { section?: SectionType }) {
  const categories = section?.skills?.filter((c) => c.tags?.length) ?? [];
  if (!section || categories.length === 0) return null;

  const total = categories.reduce((sum, c) => sum + c.tags.length, 0);

  return (
    <Section
      id="skills"
      command="ls"
      flag="-R ./skills"
      title={section.title}
      meta={`${total} items in ${categories.length} directories`}
    >
      <div className={styles.grid}>
        {categories.map((category) => (
          <div key={category.category} className={`${styles.card} reveal`}>
            <div className={styles.head}>
              <span className={styles.dir} aria-hidden="true">
                ▸
              </span>
              <span className={styles.category}>{category.category}</span>
              <span className={styles.count}>{category.tags.length}</span>
            </div>

            <div className={styles.body}>
              {category.tags.map((tag) => (
                <a
                  key={tag.name}
                  href={tag.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.tag}
                >
                  {tag.name}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
