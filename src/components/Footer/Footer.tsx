import SocialLinks from "@/components/SocialLinks/SocialLinks";
import styles from "./Footer.module.css";
import type { Section } from "@/types/types";

export default function Footer({ hero }: { hero?: Section }) {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={`wrap ${styles.inner}`}>
        <p className={styles.line}>
          <span className={styles.sigil}>$</span> echo{" "}
          <b>&quot;© {year} Todd Polak&quot;</b>
        </p>

        <SocialLinks
          links={hero?.links}
          className={styles.socials}
          itemClassName={styles.social}
        />

        <p className={styles.built}>
          <span>
            Built with <a href="https://nextjs.org">Next.js</a>,{" "}
            <a href="https://graphql.org">GraphQL</a>, and{" "}
            <a href="https://www.mongodb.com">MongoDB</a>.
          </span>
          <span>All copy served from the database.</span>
        </p>
      </div>
    </footer>
  );
}
