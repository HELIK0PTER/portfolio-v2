// Shared types for static portfolio data.
export type Locale = 'fr' | 'en';

export type Localized = { fr: string; en: string };
export type LocalizedArray = { fr: string[]; en: string[] };

export function pick<T>(localized: { fr: T; en: T }, locale: Locale): T {
  return localized[locale];
}

export type ProjectData = {
  id: string;
  slug: string;
  title: Localized;
  description: Localized;
  longDescription: Localized;
  imageUrl: string;
  images: string[];
  tags: string[];
  technologies: string[];
  features: LocalizedArray;
  category: Localized;
  status: Localized;
  date: string;
  duration: Localized;
  client: string;
  githubUrl: string;
  liveUrl: string | null;
  featured: boolean;
};

export type ServiceData = {
  id: string;
  title: Localized;
  description: Localized;
  price: number;
};

export type EducationData = {
  id: string;
  title: Localized;
  institution: string;
  location: Localized;
  description: Localized;
  startDate: string;
  endDate: string | null;
  isCurrently: boolean;
  grade: Localized | null;
  skills: string[];
};

export type ExperienceData = {
  id: string;
  title: Localized;
  company: string;
  location: Localized;
  description: Localized;
  startDate: string;
  endDate: string | null;
  isCurrently: boolean;
  skills: string[];
  companyUrl: string | null;
};

export type ContactData = {
  contactEmail: string;
  phone: string | null;
  location: Localized;
  availability: Localized;
  responseTime: Localized;
  preferredContact: string;
  autoReply: boolean;
  autoReplyMessage: Localized | null;
};
