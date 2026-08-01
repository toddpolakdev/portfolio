import { redirect } from "next/navigation";
import { requireAdminSession } from "@/auth";
import AdminNav from "./AdminNav";
import styles from "./admin.module.css";
import { gqlAdmin } from "@/lib/gql";
import { GET_UNREAD_COUNT } from "@/lib/queries";

export const metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

/** Admin data is per-request and never cached. */
export const dynamic = "force-dynamic";

async function unreadCount(): Promise<number> {
  try {
    const data = await gqlAdmin<{ unreadContactCount: number }>(
      GET_UNREAD_COUNT
    );
    return data.unreadContactCount;
  } catch {
    // The badge is a nicety — never block the whole portal on it.
    return 0;
  }
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Sign-in lives at /signin, outside this layout, so this guard is
  // unconditional: everything under /admin requires an allowlisted session.
  const session = await requireAdminSession();
  if (!session) redirect("/signin?callbackUrl=/admin");

  const unread = await unreadCount();

  return (
    <div className={styles.shell}>
      <AdminNav
        unread={unread}
        user={{
          name: session.user?.name ?? session.user?.login ?? "admin",
          image: session.user?.image ?? null,
        }}
      />
      <main className={styles.main}>{children}</main>
    </div>
  );
}
