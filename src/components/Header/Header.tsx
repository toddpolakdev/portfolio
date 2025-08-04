import React from "react";
import styles from "../Header/Header.module.css";
import Navbar from "../Navbar/Navbar";

const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <Navbar />
    </header>
  );
};

export default Header;
