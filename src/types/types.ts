export type SkillTag = {
  name: string;
  url: string;
};

export type SkillCategory = {
  category: string;
  tags: SkillTag[];
};

export type JobEntry = {
  title: string;
  company: string;
  duration: string;
  description: string[];
};

export type EducationEntry = {
  degree: string;
  institution: string;
  duration: string;
  description: string[];
};

export type LinkEntry = {
  label: string;
  url: string;
  icon?: string | null;
};

export type Section = {
  _id?: string;
  id: string;
  title: string;
  type: string;
  subtitle?: string | null;
  description?: string | null;
  content?: string[] | null;
  skills?: SkillCategory[] | null;
  experience?: JobEntry[] | null;
  education?: EducationEntry[] | null;
  links?: LinkEntry[] | null;
  background?: string | null;
  order?: number | null;
  published?: boolean | null;
  updatedAt?: string | null;
};

export type ProjectStatus = "draft" | "published";

export type Project = {
  _id?: string;
  slug: string;
  title: string;
  tagline?: string | null;
  description: string[];
  image?: string | null;
  images: string[];
  tags: string[];
  liveUrl?: string | null;
  githubUrl?: string | null;
  year?: string | null;
  role?: string | null;
  status: ProjectStatus;
  featured: boolean;
  order: number;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type ContactEntry = {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
};

export type UploadSignature = {
  signature: string;
  timestamp: number;
  apiKey: string;
  cloudName: string;
  folder: string;
};

export type SectionId =
  | "hero"
  | "about"
  | "skills"
  | "experience"
  | "education"
  | "contact";
