import React from "react";
import styles from "./Button.module.css";
import clsx from "clsx";

type ButtonProps = {
  children: React.ReactNode;
  href: string;
  variant?: "primary" | "secondary";
};

const Button: React.FC<ButtonProps> = ({
  children,
  href,
  variant = "primary",
}) => {
  return (
    <a
      href={href}
      role="button"
      className={clsx(styles.btn, styles[`btn_${variant}`])}>
      {children}
    </a>
  );
};

export default Button;
