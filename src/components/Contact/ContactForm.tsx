"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { FiCheck, FiAlertTriangle, FiSend } from "react-icons/fi";
import styles from "./Contact.module.css";
import {
  submitContactAction,
  type ContactState,
} from "@/app/actions/contact";

const MAX_MESSAGE = 1000;
const INITIAL: ContactState = { status: "idle" };

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className={styles.submit}
      disabled={pending || disabled}
    >
      <FiSend size={13} />
      {pending ? "sending…" : "send"}
    </button>
  );
}

export default function ContactForm() {
  const [state, formAction] = useActionState(submitContactAction, INITIAL);
  const [length, setLength] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);

  // Clear the form once the server confirms the message landed.
  useEffect(() => {
    if (state.status === "ok") {
      formRef.current?.reset();
      setLength(0);
    }
  }, [state]);

  const over = length > MAX_MESSAGE;

  return (
    <div className={styles.window}>
      <div className={styles.windowBar}>
        <span>$ mail -s &quot;hello&quot; toddpolakdev@gmail.com</span>
      </div>

      <form ref={formRef} action={formAction} className={styles.form}>
        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="name">
              name
            </label>
            <input
              id="name"
              name="name"
              className={styles.input}
              required
              maxLength={120}
              autoComplete="name"
              placeholder="Ada Lovelace"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="email">
              email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className={styles.input}
              required
              autoComplete="email"
              placeholder="ada@example.com"
            />
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="subject">
            subject
          </label>
          <input
            id="subject"
            name="subject"
            className={styles.input}
            required
            maxLength={200}
            placeholder="Let's build something"
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="message">
            message
          </label>
          <textarea
            id="message"
            name="message"
            className={styles.textarea}
            required
            maxLength={MAX_MESSAGE}
            placeholder="Tell me about the project…"
            onChange={(e) => setLength(e.target.value.length)}
          />
        </div>

        {/* Honeypot — hidden from users, tempting to bots. */}
        <div className={styles.honey} aria-hidden="true">
          <label htmlFor="website">Website</label>
          <input id="website" name="website" tabIndex={-1} autoComplete="off" />
        </div>

        {state.status !== "idle" && state.message && (
          <p
            className={`${styles.status} ${
              state.status === "ok" ? styles.ok : styles.err
            }`}
            role="status"
          >
            {state.status === "ok" ? (
              <FiCheck size={14} />
            ) : (
              <FiAlertTriangle size={14} />
            )}
            {state.message}
          </p>
        )}

        <div className={styles.footer}>
          <SubmitButton disabled={over} />
          <span
            className={`${styles.counter} ${over ? styles.counterOver : ""}`}
          >
            {length}/{MAX_MESSAGE}
          </span>
        </div>
      </form>
    </div>
  );
}
