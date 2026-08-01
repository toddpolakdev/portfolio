"use client";

import { useState } from "react";
import { FiChevronDown, FiChevronUp, FiPlus, FiTrash2 } from "react-icons/fi";
import styles from "./admin.module.css";

export type RepeaterField = {
  name: string;
  label: string;
  type?: "text" | "textarea";
  placeholder?: string;
  hint?: string;
  /** Renders full-width instead of sharing the two-column row. */
  wide?: boolean;
};

type Row = Record<string, string>;

type Props = {
  /** Form-data prefix. Rows submit as `${name}.${i}.${field}`. */
  name: string;
  label: string;
  fields: RepeaterField[];
  initial: Row[];
  /** Shown on each row header, e.g. "job" → "job 01". */
  itemNoun?: string;
  addLabel?: string;
};

/**
 * Renders an ordered list of grouped inputs. Row order in the DOM is the order
 * submitted, and the server rebuilds the array from the indexed field names —
 * no JSON blobs in hidden inputs.
 */
export default function Repeater({
  name,
  label,
  fields,
  initial,
  itemNoun = "item",
  addLabel = "Add",
}: Props) {
  const [rows, setRows] = useState<Row[]>(
    initial.length ? initial : [emptyRow(fields)]
  );

  function emptyRow(defs: RepeaterField[]): Row {
    return Object.fromEntries(defs.map((f) => [f.name, ""]));
  }

  function update(index: number, field: string, value: string) {
    setRows((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: value } : row))
    );
  }

  function move(index: number, delta: number) {
    setRows((prev) => {
      const next = [...prev];
      const target = index + delta;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function remove(index: number) {
    setRows((prev) =>
      prev.length === 1
        ? [emptyRow(fields)]
        : prev.filter((_, i) => i !== index)
    );
  }

  return (
    <div className={styles.field}>
      <span className={styles.label}>{label}</span>

      <div className={styles.repeat}>
        {rows.map((row, i) => (
          <div key={i} className={styles.repeatItem}>
            <div className={styles.repeatHead}>
              <span className={styles.repeatIndex}>
                {itemNoun} {String(i + 1).padStart(2, "0")}
              </span>

              <div className={styles.repeatActions}>
                <button
                  type="button"
                  className={styles.iconBtn}
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                  aria-label={`Move ${itemNoun} ${i + 1} up`}
                >
                  <FiChevronUp size={13} />
                </button>
                <button
                  type="button"
                  className={styles.iconBtn}
                  onClick={() => move(i, 1)}
                  disabled={i === rows.length - 1}
                  aria-label={`Move ${itemNoun} ${i + 1} down`}
                >
                  <FiChevronDown size={13} />
                </button>
                <button
                  type="button"
                  className={`${styles.iconBtn} ${styles.iconBtnDanger}`}
                  onClick={() => remove(i)}
                  aria-label={`Remove ${itemNoun} ${i + 1}`}
                >
                  <FiTrash2 size={13} />
                </button>
              </div>
            </div>

            <div className={styles.grid2}>
              {fields
                .filter((f) => !f.wide && f.type !== "textarea")
                .map((field) => (
                  <label key={field.name} className={styles.field}>
                    <span className={styles.label}>{field.label}</span>
                    <input
                      className={styles.input}
                      name={`${name}.${i}.${field.name}`}
                      value={row[field.name] ?? ""}
                      placeholder={field.placeholder}
                      onChange={(e) => update(i, field.name, e.target.value)}
                    />
                  </label>
                ))}
            </div>

            {fields
              .filter((f) => f.wide || f.type === "textarea")
              .map((field) =>
                field.type === "textarea" ? (
                  <label key={field.name} className={styles.field}>
                    <span className={styles.label}>{field.label}</span>
                    <textarea
                      className={styles.textarea}
                      name={`${name}.${i}.${field.name}`}
                      value={row[field.name] ?? ""}
                      placeholder={field.placeholder}
                      onChange={(e) => update(i, field.name, e.target.value)}
                    />
                    {field.hint && (
                      <span className={styles.hint}>{field.hint}</span>
                    )}
                  </label>
                ) : (
                  <label key={field.name} className={styles.field}>
                    <span className={styles.label}>{field.label}</span>
                    <input
                      className={styles.input}
                      name={`${name}.${i}.${field.name}`}
                      value={row[field.name] ?? ""}
                      placeholder={field.placeholder}
                      onChange={(e) => update(i, field.name, e.target.value)}
                    />
                    {field.hint && (
                      <span className={styles.hint}>{field.hint}</span>
                    )}
                  </label>
                )
              )}
          </div>
        ))}
      </div>

      <button
        type="button"
        className={`${styles.btnGhost} ${styles.btnSm}`}
        style={{ alignSelf: "flex-start" }}
        onClick={() => setRows((prev) => [...prev, emptyRow(fields)])}
      >
        <FiPlus size={13} /> {addLabel}
      </button>
    </div>
  );
}
