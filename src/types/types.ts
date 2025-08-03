export type SkillCategory = {
  category: string;
  tags: string[];
};

export type JobEntry = {
  title: string;
  company: string;
  duration: string;
  description: string[];
};

export type Section = {
  id: string;
  title: string;
  type: string;
  subtitle?: string;
  description?: string;
  content?: string[];
  skills?: SkillCategory[];
  experience?: JobEntry[];
};
