import { projects as rawProjects } from "./projects";
import { services as rawServices } from "./services";
import { educations as rawEducations } from "./educations";
import { experiences as rawExperiences } from "./experiences";
import { contact as rawContact } from "./contact";
import type { Locale } from "./types";

export type { Locale } from "./types";

export type ResolvedProject = {
  id: string;
  slug: string;
  title: string;
  description: string;
  longDescription: string;
  imageUrl: string;
  images: string[];
  tags: string[];
  technologies: string[];
  features: string[];
  category: string;
  status: string;
  date: string;
  duration: string;
  client: string;
  githubUrl: string;
  liveUrl: string | null;
  featured: boolean;
};

export type ResolvedService = {
  id: string;
  title: string;
  description: string;
  price: number;
};

export type ResolvedEducation = {
  id: string;
  title: string;
  institution: string;
  location: string;
  description: string;
  startDate: string;
  endDate: string | null;
  isCurrently: boolean;
  grade: string | null;
  skills: string[];
};

export type ResolvedExperience = {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  startDate: string;
  endDate: string | null;
  isCurrently: boolean;
  skills: string[];
  companyUrl: string | null;
};

export type ResolvedContact = {
  contactEmail: string;
  phone: string | null;
  location: string;
  availability: string;
  responseTime: string;
  preferredContact: string;
};

export function getProjects(locale: Locale): ResolvedProject[] {
  return rawProjects.map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title[locale],
    description: p.description[locale],
    longDescription: p.longDescription[locale],
    imageUrl: p.imageUrl,
    images: p.images,
    tags: p.tags,
    technologies: p.technologies,
    features: p.features[locale],
    category: p.category[locale],
    status: p.status[locale],
    date: p.date,
    duration: p.duration[locale],
    client: p.client,
    githubUrl: p.githubUrl,
    liveUrl: p.liveUrl,
    featured: p.featured,
  }));
}

export function getFeaturedProjects(locale: Locale): ResolvedProject[] {
  return getProjects(locale).filter((p) => p.featured);
}

export function getProjectBySlug(
  locale: Locale,
  slug: string,
): ResolvedProject | null {
  return getProjects(locale).find((p) => p.slug === slug) ?? null;
}

export function getOtherProjects(
  locale: Locale,
  excludeId: string,
  limit = 3,
): ResolvedProject[] {
  return getProjects(locale)
    .filter((p) => p.id !== excludeId)
    .slice(0, limit);
}

export function getAllProjectSlugs(): string[] {
  return rawProjects.map((p) => p.slug);
}

export function getServices(locale: Locale): ResolvedService[] {
  return rawServices.map((s) => ({
    id: s.id,
    title: s.title[locale],
    description: s.description[locale],
    price: s.price,
  }));
}

export function getEducations(locale: Locale): ResolvedEducation[] {
  return rawEducations.map((e) => ({
    id: e.id,
    title: e.title[locale],
    institution: e.institution,
    location: e.location[locale],
    description: e.description[locale],
    startDate: e.startDate,
    endDate: e.endDate,
    isCurrently: e.isCurrently,
    grade: e.grade ? e.grade[locale] : null,
    skills: e.skills,
  }));
}

export function getExperiences(locale: Locale): ResolvedExperience[] {
  return rawExperiences.map((e) => ({
    id: e.id,
    title: e.title[locale],
    company: e.company,
    location: e.location[locale],
    description: e.description[locale],
    startDate: e.startDate,
    endDate: e.endDate,
    isCurrently: e.isCurrently,
    skills: e.skills,
    companyUrl: e.companyUrl,
  }));
}

export function getContact(locale: Locale): ResolvedContact {
  return {
    contactEmail: rawContact.contactEmail,
    phone: rawContact.phone,
    location: rawContact.location[locale],
    availability: rawContact.availability[locale],
    responseTime: rawContact.responseTime[locale],
    preferredContact: rawContact.preferredContact,
  };
}
