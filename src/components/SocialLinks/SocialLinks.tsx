import {
  FiCodepen,
  FiFileText,
  FiGithub,
  FiGlobe,
  FiLinkedin,
  FiMail,
  FiTwitter,
} from "react-icons/fi";
import type { LinkEntry } from "@/types/types";

/**
 * Used when the hero section in the CMS has no `links` set, so a fresh
 * database still renders something sensible. Adding links in the admin
 * portal overrides this entirely.
 */
export const DEFAULT_LINKS: LinkEntry[] = [
  {
    label: "GitHub",
    url: "https://github.com/toddpolakdev",
    icon: "github",
  },
  {
    label: "Email",
    url: "mailto:toddpolakdev@gmail.com",
    icon: "mail",
  },
];

const ICONS: Record<string, React.ComponentType<{ size?: number }>> = {
  github: FiGithub,
  linkedin: FiLinkedin,
  twitter: FiTwitter,
  x: FiTwitter,
  mail: FiMail,
  email: FiMail,
  resume: FiFileText,
  cv: FiFileText,
  codepen: FiCodepen,
  website: FiGlobe,
};

/** Guesses an icon from the label when the CMS entry did not specify one. */
function iconFor(link: LinkEntry) {
  const key = (link.icon ?? link.label).toLowerCase().trim();
  return ICONS[key] ?? FiGlobe;
}

type Props = {
  links?: LinkEntry[] | null;
  className?: string;
  itemClassName?: string;
};

export default function SocialLinks({
  links,
  className,
  itemClassName,
}: Props) {
  const resolved = links?.length ? links : DEFAULT_LINKS;

  return (
    <div className={className}>
      {resolved.map((link) => {
        const Icon = iconFor(link);
        const external = !link.url.startsWith("mailto:");

        return (
          <a
            key={link.url}
            href={link.url}
            className={itemClassName}
            aria-label={link.label}
            title={link.label}
            {...(external
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
          >
            <Icon size={16} />
          </a>
        );
      })}
    </div>
  );
}
