"use client";

import { useFormStatus } from "react-dom";
import { FiAlertTriangle, FiCheck, FiSave } from "react-icons/fi";
import styles from "./admin.module.css";
import type { ActionState } from "@/app/actions/admin";

/**
 * Sticky footer for admin forms. Split out because `useFormStatus` only
 * reports pending state from inside the <form> it belongs to.
 */
export default function SaveBar({
  state,
  label = "Save changes",
  children,
}: {
  state: ActionState;
  label?: string;
  children?: React.ReactNode;
}) {
  const { pending } = useFormStatus();

  return (
    <div className={styles.saveBar}>
      <button type="submit" className={styles.btn} disabled={pending}>
        <FiSave size={14} />
        {pending ? "saving…" : label}
      </button>

      {children}

      {state.status !== "idle" && state.message && (
        <span
          className={`${styles.status} ${
            state.status === "ok" ? styles.statusOk : styles.statusErr
          }`}
          role="status"
        >
          {state.status === "ok" ? (
            <FiCheck size={13} />
          ) : (
            <FiAlertTriangle size={13} />
          )}
          {state.message}
        </span>
      )}
    </div>
  );
}
