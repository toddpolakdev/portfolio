import { FiGithub, FiMail, FiMapPin } from "react-icons/fi";
import Section from "@/components/Section/Section";
import ContactForm from "./ContactForm";
import styles from "./Contact.module.css";
import type { Section as SectionType } from "@/types/types";

export default function Contact({ section }: { section?: SectionType }) {
  const title = section?.title ?? "Get in touch";
  const intro =
    section?.description ??
    "Open to full-time roles, contract work, and interesting side projects. Drop a note and I'll reply within a day or two.";

  return (
    <Section id="contact" command="mail" flag="-s" title={title}>
      <div className={styles.grid}>
        <div className="reveal">
          <p className={styles.intro}>{intro}</p>

          <div className={styles.direct}>
            <a
              href="mailto:toddpolakdev@gmail.com"
              className={styles.directItem}
            >
              <FiMail size={14} className={styles.directIcon} />
              toddpolakdev@gmail.com
            </a>

            <a
              href="https://github.com/toddpolakdev"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.directItem}
            >
              <FiGithub size={14} className={styles.directIcon} />
              github.com/toddpolakdev
            </a>

            <span className={styles.directItem}>
              <FiMapPin size={14} className={styles.directIcon} />
              Remote / United States
            </span>
          </div>
        </div>

        <div className="reveal">
          <ContactForm />
        </div>
      </div>
    </Section>
  );
}
