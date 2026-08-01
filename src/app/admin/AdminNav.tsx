"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  FiExternalLink,
  FiFolder,
  FiGrid,
  FiInbox,
  FiLogOut,
  FiType,
} from "react-icons/fi";
import styles from "./admin.module.css";

const LINKS = [
  { href: "/admin", label: "Dashboard", icon: FiGrid },
  { href: "/admin/sections", label: "Copy", icon: FiType },
  { href: "/admin/projects", label: "Projects", icon: FiFolder },
  { href: "/admin/inbox", label: "Inbox", icon: FiInbox, badge: true },
];

type Props = {
  unread: number;
  user: { name: string; image: string | null };
};

export default function AdminNav({ unread, user }: Props) {
  const pathname = usePathname();

  return (
    <aside className={styles.side}>
      <p className={styles.brand}>
        <span className={styles.brandSigil}>$</span> admin --portfolio
      </p>

      <nav className={styles.navGroup} aria-label="Admin sections">
        <p className={styles.navLabel}>Manage</p>

        {LINKS.map((link) => {
          const Icon = link.icon;
          // Only /admin is an exact match; the rest match their subtree.
          const active =
            link.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={styles.navLink}
              data-active={active}
            >
              <Icon size={14} />
              {link.label}
              {link.badge && unread > 0 && (
                <span className={styles.navBadge}>{unread}</span>
              )}
            </Link>
          );
        })}
      </nav>

      <nav className={styles.navGroup} aria-label="Site">
        <p className={styles.navLabel}>Site</p>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.navLink}
        >
          <FiExternalLink size={14} />
          View live site
        </a>
      </nav>

      <div className={styles.sideFoot}>
        <div className={styles.who}>
          {user.image ? (
            // Avatars come from arbitrary GitHub CDN hosts; a plain <img>
            // avoids widening next/image's remote allowlist for a 22px icon.
            // eslint-disable-next-line @next/next/no-img-element
            <img className={styles.avatar} src={user.image} alt="" />
          ) : null}
          <span className={styles.whoName}>{user.name}</span>
        </div>

        <button
          type="button"
          className={styles.signOut}
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          <FiLogOut size={13} /> sign out
        </button>
      </div>
    </aside>
  );
}
