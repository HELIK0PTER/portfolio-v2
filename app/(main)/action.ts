"use server"
import { getFeaturedProjects } from "@/lib/projects";

export async function getFeaturedProjectsAction() {
  try {
    const featuredProjects = await getFeaturedProjects();
    return { success: true, data: featuredProjects };
  } catch (error) {
    console.error('Erreur lors de la récupération des projets en vedette:', error);
    return { success: false, data: [], error: 'Erreur lors de la récupération des projets' };
  }
}

