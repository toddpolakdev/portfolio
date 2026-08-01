import Section from "@/components/Section/Section";
import styles from "./About.module.css";
import type { Project, Section as SectionType } from "@/types/types";

type Props = {
  section?: SectionType;
  skills?: SectionType;
  experience?: SectionType;
  projects: Project[];
};

/** Derives the side panel facts from real data rather than hardcoded numbers. */
function buildStats(
  skills: SectionType | undefined,
  experience: SectionType | undefined,
  projects: Project[]
) {
  const stats: { key: string; value: string }[] = [];

  const current = experience?.experience?.[0];
  if (current) {
    stats.push({ key: "role", value: current.title });
    stats.push({ key: "company", value: current.company });
  }

  const skillCount =
    skills?.skills?.reduce((sum, cat) => sum + cat.tags.length, 0) ?? 0;
  if (skillCount) stats.push({ key: "skills", value: String(skillCount) });

  if (projects.length) {
    stats.push({ key: "projects", value: String(projects.length) });
  }

  stats.push({ key: "status", value: "open to work" });

  return stats;
}

export default function About({
  section,
  skills,
  experience,
  projects,
}: Props) {
  const paragraphs = section?.content?.filter(Boolean) ?? [];
  if (!section || paragraphs.length === 0) return null;

  const stats = buildStats(skills, experience, projects);

  return (
    <Section
      id="about"
      command="cat"
      flag="./about.md"
      title={section.title}
      meta={`${paragraphs.length} paragraphs`}
    >
      <div className={styles.grid}>
        <div className={`${styles.prose} reveal`}>
          {paragraphs.map((text, i) => (
            <div key={i} className={styles.para}>
              <span className={styles.num} aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p>{text}</p>
            </div>
          ))}
        </div>

        <aside className={`${styles.panel} reveal`}>
          <div className={styles.panelHead}>~/.profile</div>
          <div className={styles.panelBody}>
            {stats.map((stat) => (
              <div key={stat.key} className={styles.stat}>
                <span className={styles.statKey}>{stat.key}</span>
                <span className={styles.statDots} aria-hidden="true" />
                <span className={styles.statVal}>{stat.value}</span>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </Section>
  );
}
