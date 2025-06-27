import { Metadata } from 'next';
import { ImageCleanupManager } from '@/components/admin/ImageCleanupManager';

export const metadata: Metadata = {
  title: `Gestion des images | Admin`,
  description: `Nettoyage et gestion des images orphelines`,
  alternates: {
    canonical: new URL(
      "/admin/images",
      process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
    ).toString(),
  },
};

export default async function AdminImagesPage() {
  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Gestion des images</h1>
        <p className="text-muted-foreground">
          Nettoyez les images orphelines qui ne sont plus utilisées dans votre portfolio
        </p>
      </div>

      <ImageCleanupManager />
    </div>
  );
} 