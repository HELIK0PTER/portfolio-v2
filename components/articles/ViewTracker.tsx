"use client";

import { useEffect, useState } from "react";

interface ViewTrackerProps {
  slug?: string;
}

export function ViewIncrementer({ slug }: ViewTrackerProps) {
  useEffect(() => {
    const incrementView = async () => {
      try {
        await fetch(`/api/articles/${slug}/views`, {
          method: "POST",
        });
      } catch (error) {
        console.error("Erreur lors de l'incrémentation des vues:", error);
      }
    };

    // Délai pour éviter les incrémentations multiples rapides
    const timer = setTimeout(incrementView, 1000);

    return () => clearTimeout(timer);
  }, [slug]);

  return null; // Ce composant n'affiche rien
}

export function ViewTracker({ slug }: ViewTrackerProps) {
  const [views, setViews] = useState(0);

  useEffect(() => {
    const fetchViews = async () => {
      let response;
      if (slug) {
        response = await fetch(`/api/articles/${slug}/views`);
      } else {
        response = await fetch(`/api/articles/views`);
      }
      const data = await response.json();
      console.log("data", data);
      setViews(data.views);
    };

    fetchViews();
  }, [slug]);

  return <span>{views.toLocaleString()} vues</span>;
}