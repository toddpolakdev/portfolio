import Link from "next/link";
import { redirect } from "next/navigation";
import { requireAdminSession } from "@/auth";
import styles from "../admin/admin.module.css";
import SignInButton from "./SignInButton";

export const metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const ERRORS: Record<string, string> = {
  AccessDenied:
    "That GitHub account is not on the allowlist. Add its email to ADMIN_EMAILS or its username to ADMIN_GITHUB_LOGINS.",
  Configuration:
    "Auth is not configured. Set AUTH_SECRET, AUTH_GITHUB_ID, and AUTH_GITHUB_SECRET, then restart the server.",
  Verification: "That sign-in link has expired. Try again.",
};

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; callbackUrl?: string }>;
}) {
  const session = await requireAdminSession();
  if (session) redirect("/admin");

  const { error, callbackUrl } = await searchParams;

  const configured =
    Boolean(process.env.AUTH_GITHUB_ID) &&
    Boolean(process.env.AUTH_GITHUB_SECRET);

  const message = error
    ? (ERRORS[error] ?? "Sign in failed. Please try again.")
    : null;

  return (
    <main className={styles.signin}>
      <div className={styles.signinPanel}>
        <div className={styles.signinBar}>
          <span className={styles.dot} />
          <span className={styles.dot} />
          <span className={styles.dot} />
          <span className={styles.signinTitle}>auth — admin</span>
        </div>

        <div className={styles.signinBody}>
          <p className={styles.signinLine}>
            <span className={styles.sigil}>$</span> sudo su admin
          </p>
          <p className={`${styles.signinLine} ${styles.signinDim}`}>
            Authentication required. This area manages the copy and projects
            shown on the public site.
          </p>

          {message && <p className={styles.signinErr}>{message}</p>}

          {configured ? (
            <SignInButton callbackUrl={callbackUrl ?? "/admin"} />
          ) : (
            <p className={styles.signinErr}>
              GitHub OAuth is not configured yet. Add AUTH_GITHUB_ID and
              AUTH_GITHUB_SECRET to .env.local, then restart the dev server.
            </p>
          )}

          <p className={styles.backLink}>
            <Link href="/">← back to the site</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
