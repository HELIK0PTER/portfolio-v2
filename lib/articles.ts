import { prisma } from './prisma';
import { Article } from '@prisma/client';

export async function getAllArticles(): Promise<Article[]> {
  try {
    const articles = await prisma.article.findMany({
      where: {
        isPublished: true,
      },
      orderBy: [
        { featured: 'desc' }, // Articles en vedette en premier
        { createdAt: 'desc' }, // Plus récents en premier
      ],
    });
    return articles;
  } catch (error) {
    console.error('Erreur lors de la récupération des articles:', error);
    return [];
  }
}

export async function getAllArticlesAdmin(): Promise<Article[]> {
  try {
    const articles = await prisma.article.findMany({
      orderBy: [
        { featured: 'desc' },
        { createdAt: 'desc' },
      ],
    });
    return articles;
  } catch (error) {
    console.error('Erreur lors de la récupération des articles (admin):', error);
    return [];
  }
}

export async function getFeaturedArticles(): Promise<Article[]> {
  try {
    const articles = await prisma.article.findMany({
      where: {
        isPublished: true,
        featured: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return articles;
  } catch (error) {
    console.error('Erreur lors de la récupération des articles en vedette:', error);
    return [];
  }
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  try {
    const article = await prisma.article.findUnique({
      where: {
        slug: slug,
        isPublished: true,
      },
    });
    return article;
  } catch (error) {
    console.error(`Erreur lors de la récupération de l'article ${slug}:`, error);
    return null;
  }
}

export async function getArticleById(id: string): Promise<Article | null> {
  try {
    const article = await prisma.article.findUnique({
      where: {
        id: id,
      },
    });
    return article;
  } catch (error) {
    console.error(`Erreur lors de la récupération de l'article ${id}:`, error);
    return null;
  }
}

export async function getArticlesByCategory(category: string): Promise<Article[]> {
  try {
    const articles = await prisma.article.findMany({
      where: {
        isPublished: true,
        category: category,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return articles;
  } catch (error) {
    console.error(`Erreur lors de la récupération des articles de la catégorie ${category}:`, error);
    return [];
  }
}

export async function getArticlesByTag(tag: string): Promise<Article[]> {
  try {
    const articles = await prisma.article.findMany({
      where: {
        isPublished: true,
        tags: {
          has: tag,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return articles;
  } catch (error) {
    console.error(`Erreur lors de la récupération des articles avec le tag ${tag}:`, error);
    return [];
  }
}

export async function incrementArticleViews(slug: string): Promise<void> {
  try {
    await prisma.article.update({
      where: {
        slug: slug,
      },
      data: {
        views: {
          increment: 1,
        },
      },
    });
  } catch (error) {
    console.error('Erreur lors de l\'incrémentation des vues:', error);
  }
}

// Export du type Article depuis Prisma
export type { Article };
