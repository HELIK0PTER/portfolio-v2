import { prisma } from './prisma';
import { Project } from '@prisma/client';

export async function getAllProjects(): Promise<Project[]> {
  try {
    const projects = await prisma.project.findMany({
      where: {
        isPublished: true,
      },
      orderBy: [
        { featured: 'desc' }, // Projets en vedette en premier
        { createdAt: 'desc' }, // Plus récents en premier
      ],
    });
    return projects;
  } catch (error) {
    console.error('Erreur lors de la récupération des projets:', error);
    return [];
  }
}

export async function getFeaturedProjects(): Promise<Project[]> {
  try {
    const projects = await prisma.project.findMany({
      where: {
        isPublished: true,
        featured: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return projects;
  } catch (error) {
    console.error('Erreur lors de la récupération des projets en vedette:', error);
    return [];
  }
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  try {
    const project = await prisma.project.findUnique({
      where: {
        slug: slug,
        isPublished: true,
      },
    });
    return project;
  } catch (error) {
    console.error(`Erreur lors de la récupération du projet ${slug}:`, error);
    return null;
  }
}

export async function getProjectById(id: string): Promise<Project | null> {
  try {
    const project = await prisma.project.findUnique({
      where: {
        id: id,
        isPublished: true,
      },
    });
    return project;
  } catch (error) {
    console.error(`Erreur lors de la récupération du projet ${id}:`, error);
    return null;
  }
}

export async function getProjectsByCategory(category: string): Promise<Project[]> {
  try {
    const projects = await prisma.project.findMany({
      where: {
        isPublished: true,
        category: category,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return projects;
  } catch (error) {
    console.error(`Erreur lors de la récupération des projets de la catégorie ${category}:`, error);
    return [];
  }
}

export async function getProjectsByStatus(status: string): Promise<Project[]> {
  try {
    const projects = await prisma.project.findMany({
      where: {
        isPublished: true,
        status: status,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return projects;
  } catch (error) {
    console.error(`Erreur lors de la récupération des projets avec le statut ${status}:`, error);
    return [];
  }
}

export async function getOtherProjects(excludeId: string, limit: number = 3): Promise<Project[]> {
  try {
    const projects = await prisma.project.findMany({
      where: {
        isPublished: true,
        id: {
          not: excludeId,
        },
      },
      orderBy: [
        { featured: 'desc' },
        { createdAt: 'desc' },
      ],
      take: limit,
    });
    return projects;
  } catch (error) {
    console.error('Erreur lors de la récupération des autres projets:', error);
    return [];
  }
}

export async function getAllProjectsAdmin(): Promise<Project[]> {
  try {
    const projects = await prisma.project.findMany({
      orderBy: [
        { featured: 'desc' },
        { createdAt: 'desc' },
      ],
    });
    return projects;
  } catch (error) {
    console.error('Erreur lors de la récupération des projets (admin):', error);
    return [];
  }
}
