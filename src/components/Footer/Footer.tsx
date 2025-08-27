import React from "react";
import styles from "./Footer.module.css";
import Image from "next/image";

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <p className={styles.info}>This site was built using:</p>
      <div className={styles.footerLogos}>
        <Image src="/images/nextjs.png" alt="Next.js" width={320} height={65} />
        <Image
          src="/images/react.png"
          alt="React.js"
          width={260}
          height={240}
        />
        <Image
          src="/images/graphQL.png"
          alt="GraphQL"
          width={320}
          height={88}
        />
        <Image
          src="/images/mongoDB.png"
          alt="MongoDB"
          width={370}
          height={185}
        />
        <Image src="/images/vercel.png" alt="Vercel" width={320} height={64} />
      </div>
      <div className={styles.divider}></div>
      <p className={styles.copy}>© {new Date().getFullYear()} Todd Polak</p>
    </footer>
  );
};

export default Footer;
