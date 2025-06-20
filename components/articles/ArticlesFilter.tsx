"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Grid3X3, List, SortAsc, SortDesc } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ArticleCard from "./ArticleCard";

interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  slug: string;
  author: string;
  publishedAt: Date;
  readTime: number;
  views: number;
  category: string;
  tags: string[];
  imageUrl: string | null;
  featured: boolean;
  isPublished: boolean;
}

interface ArticlesFilterProps {
  articles: Article[];
  featuredArticles: Article[];
}

export default function ArticlesFilter({
  articles,
  featuredArticles,
}: ArticlesFilterProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [selectedTag, setSelectedTag] = useState("Tous");
  const [sortBy, setSortBy] = useState("date-desc");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Extraire les catégories uniques
  const categories = useMemo(() => {
    const cats = Array.from(
      new Set(articles.map((article) => article.category))
    );
    return ["Tous", ...cats.sort()];
  }, [articles]);

  // Extraire les tags uniques
  const tags = useMemo(() => {
    const allTags = articles.flatMap((article) => article.tags);
    const uniqueTags = Array.from(new Set(allTags));
    return ["Tous", ...uniqueTags.sort()];
  }, [articles]);

  // Filtrer et trier les articles
  const filteredArticles = useMemo(() => {
    const filtered = articles.filter((article) => {
      const matchesSearch =
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.tags.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        );

      const matchesCategory =
        selectedCategory === "Tous" || article.category === selectedCategory;
      const matchesTag =
        selectedTag === "Tous" || article.tags.includes(selectedTag);

      return matchesSearch && matchesCategory && matchesTag;
    });

    // Trier
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date-desc":
          return (
            new Date(b.publishedAt).getTime() -
            new Date(a.publishedAt).getTime()
          );
        case "date-asc":
          return (
            new Date(a.publishedAt).getTime() -
            new Date(b.publishedAt).getTime()
          );
        case "title-asc":
          return a.title.localeCompare(b.title);
        case "title-desc":
          return b.title.localeCompare(a.title);
        case "views-desc":
          return b.views - a.views;
        case "views-asc":
          return a.views - b.views;
        default:
          return 0;
      }
    });

    return filtered;
  }, [articles, searchTerm, selectedCategory, selectedTag, sortBy]);

  const getSortLabel = (value: string) => {
    switch (value) {
      case "date-desc":
        return "Plus récents";
      case "date-asc":
        return "Plus anciens";
      case "title-asc":
        return "Titre A-Z";
      case "title-desc":
        return "Titre Z-A";
      case "views-desc":
        return "Plus vus";
      case "views-asc":
        return "Moins vus";
      default:
        return "Trier";
    }
  };

  return (
    <div className="container mx-auto px-4 pb-16">
      {/* Articles en vedette */}
      {featuredArticles.length > 0 && (
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <h2 className="text-2xl font-bold">{`Articles en vedette`}</h2>
            <Badge variant="outline" className="text-xs">
              {featuredArticles.length}
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredArticles.slice(0, 3).map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                variant="featured"
                showCategory={true}
                showStats={true}
              />
            ))}
          </div>
        </section>
      )}

      {/* Filtres et recherche */}
      <div className="space-y-6 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-2xl font-bold">{`Tous les articles`}</h2>
          <Badge variant="outline" className="text-xs">
            {filteredArticles.length} / {articles.length}
          </Badge>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          {/* Barre de recherche */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder={`Rechercher un article...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filtres et tri */}
          <div className="flex flex-wrap gap-3">
            {/* Filtre par catégorie */}
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  {selectedCategory === "Tous" ? "Catégorie" : selectedCategory}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {categories.map((category) => (
                  <DropdownMenuItem
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Filtre par tag */}
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  #{selectedTag === "Tous" ? "Tags" : selectedTag}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="max-h-60 overflow-y-auto">
                {tags.map((tag) => (
                  <DropdownMenuItem
                    key={tag}
                    onClick={() => setSelectedTag(tag)}
                  >
                    {tag}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Tri */}
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  {sortBy.includes("asc") ? (
                    <SortAsc className="h-4 w-4 mr-2" />
                  ) : (
                    <SortDesc className="h-4 w-4 mr-2" />
                  )}
                  {getSortLabel(sortBy)}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSortBy("date-desc")}>
                  Plus récents
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("date-asc")}>
                  Plus anciens
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("title-asc")}>
                  Titre A-Z
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("title-desc")}>
                  Titre Z-A
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("views-desc")}>
                  Plus vus
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("views-asc")}>
                  Moins vus
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mode d'affichage */}
            <div className="flex border rounded-md overflow-hidden">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                className="rounded-none"
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                className="rounded-none"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Tags actifs */}
        {(selectedCategory !== "Tous" ||
          selectedTag !== "Tous" ||
          searchTerm) && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-muted-foreground">{`Filtres actifs :`}</span>
            {selectedCategory !== "Tous" && (
              <Badge
                variant="secondary"
                className="cursor-pointer"
                onClick={() => setSelectedCategory("Tous")}
              >
                {selectedCategory} ×
              </Badge>
            )}
            {selectedTag !== "Tous" && (
              <Badge
                variant="secondary"
                className="cursor-pointer"
                onClick={() => setSelectedTag("Tous")}
              >
                #{selectedTag} ×
              </Badge>
            )}
            {searchTerm && (
              <Badge
                variant="secondary"
                className="cursor-pointer"
                onClick={() => setSearchTerm("")}
              >
                {`"${searchTerm}"`} ×
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedCategory("Tous");
                setSelectedTag("Tous");
                setSearchTerm("");
              }}
            >
              {`Effacer tout`}
            </Button>
          </div>
        )}
      </div>

      {/* Grille d'articles */}
      {filteredArticles.length > 0 ? (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
          }
        >
          {filteredArticles.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              variant={viewMode === "list" ? "compact" : "default"}
              showCategory={true}
              showDate={true}
              showStats={true}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg mb-4">
            {`Aucun article trouvé avec ces critères.`}
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setSelectedCategory("Tous");
              setSelectedTag("Tous");
              setSearchTerm("");
            }}
          >
            {`Réinitialiser les filtres`}
          </Button>
        </div>
      )}
    </div>
  );
}
