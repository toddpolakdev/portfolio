import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

/**
 * Only these identities may reach the admin portal. GitHub accounts with a
 * private email will not expose one, so logins are accepted as an alternative.
 * Both lists are comma-separated env vars.
 */
function allowlist(name: string): string[] {
  return (process.env[name] ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

export function isAllowed(
  email?: string | null,
  login?: string | null
): boolean {
  const emails = allowlist("ADMIN_EMAILS");
  const logins = allowlist("ADMIN_GITHUB_LOGINS");

  // An empty allowlist must never mean "everyone".
  if (emails.length === 0 && logins.length === 0) return false;

  if (email && emails.includes(email.toLowerCase())) return true;
  if (login && logins.includes(login.toLowerCase())) return true;
  return false;
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [GitHub],
  pages: {
    signIn: "/signin",
    error: "/signin",
  },
  session: { strategy: "jwt" },
  callbacks: {
    signIn({ profile, user }) {
      return isAllowed(
        profile?.email ?? user?.email,
        profile?.login as string | undefined
      );
    },

    // Carry the GitHub login into the token so the allowlist can be
    // re-checked on every request without another API call.
    jwt({ token, profile }) {
      if (profile?.login) token.login = profile.login as string;
      return token;
    },

    session({ session, token }) {
      if (session.user) {
        session.user.login = token.login as string | undefined;
      }
      return session;
    },
  },
});

/**
 * Single source of truth for "is this request from the admin?". Re-checks the
 * allowlist rather than trusting the session alone, so removing someone from
 * ADMIN_EMAILS locks them out immediately instead of when their JWT expires.
 */
export async function requireAdminSession() {
  const session = await auth();
  const ok = isAllowed(session?.user?.email, session?.user?.login);
  return ok ? session : null;
}
