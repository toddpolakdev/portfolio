"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { FiGithub } from "react-icons/fi";
import styles from "../admin/admin.module.css";

export default function SignInButton({ callbackUrl }: { callbackUrl: string }) {
  const [pending, setPending] = useState(false);

  return (
    <button
      type="button"
      className={styles.signinBtn}
      disabled={pending}
      onClick={() => {
        setPending(true);
        // Only allow same-origin callbacks so a crafted ?callbackUrl= cannot
        // bounce a freshly-authenticated admin to another site.
        const safe = callbackUrl.startsWith("/") ? callbackUrl : "/admin";
        signIn("github", { callbackUrl: safe });
      }}
    >
      <FiGithub size={16} />
      {pending ? "redirecting…" : "Continue with GitHub"}
    </button>
  );
}
