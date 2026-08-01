import Link from "next/link";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <main className={styles.page}>
      <div className={styles.panel}>
        <div className={styles.bar}>
          <span className={styles.dot} />
          <span className={styles.dot} />
          <span className={styles.dot} />
          <span className={styles.barTitle}>zsh</span>
        </div>

        <div className={styles.body}>
          <p className={styles.row}>
            <span className={styles.sigil}>$</span> cd ./that-page
          </p>
          <p className={styles.err}>
            cd: no such file or directory: that-page
          </p>
          <p className={styles.row}>
            <span className={styles.sigil}>$</span> echo $?
          </p>
          <p className={styles.code}>404</p>

          <Link href="/" className={styles.cta}>
            cd ~ →
          </Link>
        </div>
      </div>
    </main>
  );
}
