import { FiAlertTriangle } from "react-icons/fi";
import styles from "../admin.module.css";
import MessageActions from "./MessageActions";
import { gqlAdmin } from "@/lib/gql";
import { GET_CONTACTS } from "@/lib/queries";
import type { ContactEntry } from "@/types/types";

export const dynamic = "force-dynamic";

async function loadContacts() {
  try {
    const data = await gqlAdmin<{ contacts: ContactEntry[] }>(GET_CONTACTS);
    return { contacts: data.contacts, error: null as string | null };
  } catch (err) {
    console.error("[admin] inbox load failed:", err);
    return {
      contacts: [] as ContactEntry[],
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

function formatDate(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "unknown date";

  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default async function InboxPage() {
  const { contacts, error } = await loadContacts();
  const unread = contacts.filter((c) => !c.read).length;

  return (
    <>
      <header className={styles.header}>
        <p className={styles.crumb}>
          <span className={styles.sigil}>$</span> mail -i
        </p>
        <h1 className={styles.h1}>Inbox</h1>
        <p className={styles.sub}>
          Messages submitted through the contact form.
          {contacts.length > 0 &&
            ` ${contacts.length} total, ${unread} unread.`}
        </p>
      </header>

      {error && (
        <p className={styles.warn}>
          <FiAlertTriangle size={16} />
          <span>Could not load messages: {error}</span>
        </p>
      )}

      {contacts.length === 0 && !error ? (
        <p className={styles.empty}>No messages yet.</p>
      ) : (
        contacts.map((message) => (
          <article
            key={message._id}
            className={`${styles.msg} ${
              message.read ? "" : styles.msgUnread
            }`}
          >
            <div className={styles.msgHead}>
              <span className={styles.msgFrom}>{message.name}</span>
              <a
                href={`mailto:${message.email}`}
                className={styles.msgEmail}
              >
                {message.email}
              </a>
              {!message.read && (
                <span className={`${styles.pill} ${styles.pillNew}`}>new</span>
              )}
              <span className={styles.msgDate}>
                {formatDate(message.createdAt)}
              </span>
            </div>

            <div className={styles.msgBody}>
              <p className={styles.msgSubject}>{message.subject}</p>
              <p className={styles.msgText}>{message.message}</p>
            </div>

            <MessageActions message={message} />
          </article>
        ))
      )}
    </>
  );
}
