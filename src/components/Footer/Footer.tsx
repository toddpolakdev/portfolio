import React from "react";
import styles from "./Footer.module.css";
import Image from "next/image";

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <p className={styles.info}>This site was built using:</p>
      <div className={styles.footerLogos}>
        <a href="https://nextjs.org/" target="_blank">
          <Image
            src="/images/nextjs.png"
            alt="Next.js"
            width={160}
            height={32.5}
          />
        </a>
        <a href="https://react.dev/" target="_blank">
          <Image
            src="/images/react.png"
            alt="React.js"
            width={130}
            height={120}
          />
        </a>
        <a href="https://graphql.org/" target="_blank">
          <Image
            src="/images/graphQL.png"
            alt="GraphQL"
            width={160}
            height={44}
          />
        </a>
        <a href="https://www.mongodb.com/" target="_blank">
          <Image
            src="/images/mongoDB.png"
            alt="MongoDB"
            width={185}
            height={92.5}
          />
        </a>
        <a href="https://vercel.com/" target="_blank">
          <Image
            src="/images/vercel.png"
            alt="Vercel"
            width={160}
            height={32}
          />
        </a>
      </div>
      <div className={styles.divider}></div>
      <p className={styles.copy}>© {new Date().getFullYear()} Todd Polak</p>
    </footer>
  );
};

export default Footer;
