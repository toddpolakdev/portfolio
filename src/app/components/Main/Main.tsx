import React from "react";
import styles from "./Main.module.css";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type Props = {
  children: React.ReactNode;
};

const Main: React.FC<Props> = ({ children }) => {
  return <main className={styles.main}>{children}</main>;
};

export default Main;
