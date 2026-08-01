"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./Hero.module.css";

export type TerminalStep = {
  cmd: string;
  out: string[];
};

const CHAR_MS = 38;
const AFTER_CMD_MS = 260;
const AFTER_OUT_MS = 520;

/**
 * Types each command out character by character, prints its output, then moves
 * to the next step. The full transcript is also rendered into the DOM up front
 * for screen readers, so the animation is decoration only.
 */
export default function TypedTerminal({ steps }: { steps: TerminalStep[] }) {
  const [step, setStep] = useState(0);
  const [typed, setTyped] = useState("");
  const [showOut, setShowOut] = useState(false);
  const [done, setDone] = useState(false);

  // Timers are collected so an unmount mid-sequence cannot set state later.
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches;
    if (reduced) {
      setStep(steps.length - 1);
      setTyped(steps[steps.length - 1]?.cmd ?? "");
      setShowOut(true);
      setDone(true);
    }
  }, [steps]);

  useEffect(() => {
    return () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, []);

  useEffect(() => {
    if (done || step >= steps.length) return;

    const current = steps[step];
    const wait = (ms: number, fn: () => void) => {
      const t = setTimeout(fn, ms);
      timers.current.push(t);
    };

    if (typed.length < current.cmd.length) {
      wait(CHAR_MS, () => setTyped(current.cmd.slice(0, typed.length + 1)));
      return;
    }

    if (!showOut) {
      wait(AFTER_CMD_MS, () => setShowOut(true));
      return;
    }

    if (step < steps.length - 1) {
      wait(AFTER_OUT_MS, () => {
        setStep(step + 1);
        setTyped("");
        setShowOut(false);
      });
    } else {
      setDone(true);
    }
  }, [steps, step, typed, showOut, done]);

  return (
    <div className={styles.windowBody}>
      {/* Completed steps stay on screen as scrollback. */}
      {steps.slice(0, step).map((s, i) => (
        <Step key={i} cmd={s.cmd} out={s.out} />
      ))}

      {step < steps.length && (
        <Step
          cmd={typed}
          out={showOut ? steps[step].out : []}
          caret={!done || step === steps.length - 1}
        />
      )}
    </div>
  );
}

function Step({
  cmd,
  out,
  caret = false,
}: {
  cmd: string;
  out: string[];
  caret?: boolean;
}) {
  return (
    <>
      <div className={`${styles.row} ${styles.rowCmd}`}>
        <span className={styles.sigil}>$</span> {cmd}
        {caret && out.length === 0 && <span className={styles.cursor} />}
      </div>
      {out.map((line, i) => (
        <div key={i} className={`${styles.row} ${styles.rowOut}`}>
          {line}
        </div>
      ))}
      {caret && out.length > 0 && (
        <div className={styles.row}>
          <span className={styles.sigil}>$</span> <span className={styles.cursor} />
        </div>
      )}
    </>
  );
}
