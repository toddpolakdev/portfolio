import Link from "next/link";
import { FiArrowRight, FiMail } from "react-icons/fi";
import styles from "./Hero.module.css";
import TypedTerminal, { type TerminalStep } from "./TypedTerminal";
import SocialLinks from "@/components/SocialLinks/SocialLinks";
import type { Project, Section } from "@/types/types";

type Props = {
  section?: Section;
  projects: Project[];
};

/**
 * Splits "Todd Polak" so the surname can take the accent colour without
 * hardcoding the name. Falls back gracefully for single-word names.
 */
function splitName(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length < 2) return { first: name, rest: "" };
  return { first: parts[0], rest: parts.slice(1).join(" ") };
}

function buildSteps(section: Section | undefined, projects: Project[]): TerminalStep[] {
  const stack = Array.from(new Set(projects.flatMap((p) => p.tags))).slice(0, 6);

  const steps: TerminalStep[] = [
    {
      cmd: "whoami",
      out: [section?.title ?? "Todd Polak"],
    },
  ];

  if (section?.subtitle) {
    steps.push({ cmd: "cat ./role.txt", out: [section.subtitle] });
  }

  if (stack.length) {
    steps.push({ cmd: "ls ./stack", out: [stack.join("  ")] });
  }

  steps.push({
    cmd: "ls ./projects | wc -l",
    out: [String(projects.length)],
  });

  return steps;
}

export default function Hero({ section, projects }: Props) {
  const { first, rest } = splitName(section?.title ?? "Todd Polak");
  const steps = buildSteps(section, projects);

  return (
    <section id="top" className={styles.hero} aria-label="Introduction">
      <div className={styles.grid} aria-hidden="true" />

      <div className={`wrap ${styles.inner}`}>
        <div>
          <p className={styles.line}>
            <span className={styles.sigil}>$</span>
            <span>./introduce --verbose</span>
          </p>

          <h1 className={styles.name}>
            {first} <em>{rest}</em>
          </h1>

          {section?.subtitle && <p className={styles.role}>{section.subtitle}</p>}

          {section?.description && (
            <p className={styles.blurb}>{section.description}</p>
          )}

          <div className={styles.ctas}>
            <a href="#work" className={styles.cta}>
              View work <FiArrowRight size={15} />
            </a>
            <a href="#contact" className={styles.ctaGhost}>
              <FiMail size={15} /> Get in touch
            </a>
          </div>

          <SocialLinks links={section?.links} className={styles.socials} itemClassName={styles.social} />
        </div>

        <div className={styles.window}>
          <div className={styles.windowBar} aria-hidden="true">
            <span className={styles.dot} />
            <span className={styles.dot} />
            <span className={styles.dot} />
            <span className={styles.windowTitle}>zsh — 80×24</span>
          </div>

          {/* The transcript is decorative; the same facts appear as real text
              in the left column, so it is hidden from assistive tech. */}
          <div aria-hidden="true">
            <TypedTerminal steps={steps} />
          </div>
        </div>
      </div>

      <Link href="#about" className={styles.scrollHint} aria-hidden="true" tabIndex={-1}>
        <span>scroll</span>
        <span>↓</span>
      </Link>
    </section>
  );
}
