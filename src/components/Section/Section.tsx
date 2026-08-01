import styles from "./Section.module.css";

type Props = {
  id: string;
  /** The shell command shown as the section heading, e.g. `cat about.md`. */
  command: string;
  /** Optional flag rendered in the accent colour after the command. */
  flag?: string;
  /** Human-readable heading. Kept as the real h2 for screen readers and SEO. */
  title: string;
  /** Right-aligned metadata, e.g. "3 entries". */
  meta?: string;
  children: React.ReactNode;
};

export default function Section({
  id,
  command,
  flag,
  title,
  meta,
  children,
}: Props) {
  return (
    <section id={id} className={styles.section} aria-labelledby={`${id}-title`}>
      <div className="wrap">
        <header className={`${styles.head} reveal`}>
          <p className={styles.prompt} aria-hidden="true">
            <span className={styles.sigil}>$</span>
            <span className={styles.command}>{command}</span>
            {flag && <span className={styles.flag}>{flag}</span>}
            <span className={styles.caret} />
          </p>

          {meta && <span className={styles.count}>{meta}</span>}

          <h2 id={`${id}-title`} className={styles.title}>
            {title}
          </h2>
        </header>

        {children}
      </div>
    </section>
  );
}
