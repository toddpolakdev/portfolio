"use client";

import { useState, useTransition } from "react";
import { FiCornerUpLeft, FiEye, FiEyeOff, FiTrash2 } from "react-icons/fi";
import styles from "../admin.module.css";
import {
  deleteContactAction,
  markContactReadAction,
} from "@/app/actions/admin";
import type { ContactEntry } from "@/types/types";

export default function MessageActions({ message }: { message: ContactEntry }) {
  const [pending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function run(fn: () => Promise<{ status: string; message?: string }>) {
    setError(null);
    startTransition(async () => {
      const res = await fn();
      if (res.status === "error") setError(res.message ?? "Action failed.");
    });
  }

  const replyHref = `mailto:${encodeURIComponent(
    message.email
  )}?subject=${encodeURIComponent(`Re: ${message.subject}`)}`;

  return (
    <div className={styles.msgActions}>
      <a href={replyHref} className={`${styles.btnGhost} ${styles.btnSm}`}>
        <FiCornerUpLeft size={12} /> reply
      </a>

      <button
        type="button"
        className={`${styles.btnGhost} ${styles.btnSm}`}
        disabled={pending}
        onClick={() =>
          run(() => markContactReadAction(message._id, !message.read))
        }
      >
        {message.read ? <FiEyeOff size={12} /> : <FiEye size={12} />}
        {message.read ? "mark unread" : "mark read"}
      </button>

      {confirming ? (
        <>
          <button
            type="button"
            className={`${styles.btnDanger} ${styles.btnSm}`}
            disabled={pending}
            onClick={() => run(() => deleteContactAction(message._id))}
          >
            <FiTrash2 size={12} /> confirm delete
          </button>
          <button
            type="button"
            className={`${styles.btnGhost} ${styles.btnSm}`}
            onClick={() => setConfirming(false)}
          >
            cancel
          </button>
        </>
      ) : (
        <button
          type="button"
          className={`${styles.btnDanger} ${styles.btnSm}`}
          disabled={pending}
          onClick={() => setConfirming(true)}
        >
          <FiTrash2 size={12} /> delete
        </button>
      )}

      {error && (
        <span className={`${styles.status} ${styles.statusErr}`}>{error}</span>
      )}
    </div>
  );
}
