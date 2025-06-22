"use client";

import { useState, useEffect, useCallback } from "react";
import { Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Type pour un thème
interface Theme {
  id: string;
  name: string;
  description: string;
  cssFile: string;
}

// Fonction pour découvrir les thèmes disponibles
const discoverThemes = async (): Promise<Theme[]> => {
  const themes: Theme[] = [];

  // Liste des thèmes connus (peut être étendue)
  const knownThemes = [
    {
      id: "blue-bubblegum",
      name: "Bleu Bubblegum",
      description: "Thème bleu avec des accents colorés",
    },
    {
      id: "dark-purple",
      name: "Violet Sombre",
      description: "Thème violet foncé",
    },
    {
      id: "twitter",
      name: "Twitter",
      description: "Thème inspiré de Twitter (X)",
    },
  ];

  // Vérifier chaque thème
  for (const theme of knownThemes) {
    try {
      const response = await fetch(`/styles/theme-${theme.id}.css`, {
        method: "HEAD",
      });
      if (response.ok) {
        themes.push({
          ...theme,
          cssFile: `/styles/theme-${theme.id}.css`,
        });
      }
    } catch {
      // Fichier n'existe pas, on l'ignore
      console.log(`Thème ${theme.id} non trouvé`);
    }
  }

  return themes;
};

// Fonction pour parser les variables CSS depuis un fichier
const parseThemeVariables = async (
  cssFile: string
): Promise<{ light: Record<string, string>; dark: Record<string, string> }> => {
  try {
    const response = await fetch(cssFile);
    const cssText = await response.text();

    const lightVariables: Record<string, string> = {};
    const darkVariables: Record<string, string> = {};

    // Parser pour :root
    const rootMatch = cssText.match(/:root\s*{([\s\S]*?)}/m);
    if (rootMatch) {
      const rootContent = rootMatch[1];
      const variableRegex = /--([^:]+):\s*([^;]+);/g;
      let match;
      while ((match = variableRegex.exec(rootContent)) !== null) {
        lightVariables[`--${match[1].trim()}`] = match[2].trim();
      }
    }

    // Parser pour .dark
    const darkMatch = cssText.match(/\.dark\s*{([\s\S]*?)}/m);
    if (darkMatch) {
      const darkContent = darkMatch[1];
      const variableRegex = /--([^:]+):\s*([^;]+);/g;
      let match;
      while ((match = variableRegex.exec(darkContent)) !== null) {
        darkVariables[`--${match[1].trim()}`] = match[2].trim();
      }
    }

    return { light: lightVariables, dark: darkVariables };
  } catch (error) {
    console.error(`Erreur lors du parsing du thème ${cssFile}:`, error);
    return { light: {}, dark: {} };
  }
};

// Fonction pour injecter les variables CSS
const injectThemeVariables = (variables: {
  light: Record<string, string>;
  dark: Record<string, string>;
}) => {
  // Supprimer l'ancien style de thème
  const existingStyle = document.querySelector("style[data-theme]");
  if (existingStyle) {
    existingStyle.remove();
  }

  // Créer un élément style avec les variables du thème
  const style = document.createElement("style");
  style.setAttribute("data-theme", "custom");

  let css = ":root {\n";
  Object.entries(variables.light).forEach(([property, value]) => {
    css += `  ${property}: ${value};\n`;
  });
  css += "}\n\n";

  css += ".dark {\n";
  Object.entries(variables.dark).forEach(([property, value]) => {
    css += `  ${property}: ${value};\n`;
  });
  css += "}\n";

  style.textContent = css;
  document.head.appendChild(style);
};

export default function ThemeSelector() {
  const [currentTheme, setCurrentTheme] = useState<string>("default");
  const [availableThemes, setAvailableThemes] = useState<Theme[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Charger les thèmes disponibles au montage
  useEffect(() => {
    const loadAvailableThemes = async () => {
      setIsLoading(true);
      const themes = await discoverThemes();
      setAvailableThemes(themes);
      setIsLoading(false);
    };

    loadAvailableThemes();
  }, []);

  // Fonction pour charger un thème
  const loadTheme = useCallback(
    async (themeId: string) => {
      if (themeId === "default") {
        // Supprimer le style personnalisé pour revenir au thème par défaut
        const existingStyle = document.querySelector("style[data-theme]");
        if (existingStyle) {
          existingStyle.remove();
        }
        return;
      }

      const selectedTheme = availableThemes.find(
        (theme) => theme.id === themeId
      );
      if (selectedTheme) {
        const variables = await parseThemeVariables(selectedTheme.cssFile);
        injectThemeVariables(variables);
      }
    },
    [availableThemes]
  );

  // Charger le thème sauvegardé au montage
  useEffect(() => {
    const savedTheme = localStorage.getItem("portfolio-theme");
    if (savedTheme) {
      setCurrentTheme(savedTheme);
      loadTheme(savedTheme);
    }
  }, [availableThemes, loadTheme]);

  // Fonction pour changer de thème
  const changeTheme = async (themeId: string) => {
    setCurrentTheme(themeId);
    localStorage.setItem("portfolio-theme", themeId);
    await loadTheme(themeId);
  };

  if (isLoading) {
    return (
      <Button variant="ghost" size="sm" disabled>
        <Palette className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Palette className="h-4 w-4" />
          <span className="hidden sm:inline">Thème</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 space-y-1">
        {/* Thème par défaut */}
        <DropdownMenuItem
          onClick={() => changeTheme("default")}
          className={currentTheme === "default" ? "bg-accent" : ""}
        >
          <div className="flex flex-col">
            <span className="font-medium">Défaut</span>
            <span className={`text-xs ${currentTheme === "default" ? "" : "text-muted-foreground"}`}>
              Thème par défaut
            </span>
          </div>
        </DropdownMenuItem>

        {/* Thèmes découverts */}
        {availableThemes.map((theme) => (
          <DropdownMenuItem
            key={theme.id}
            onClick={() => changeTheme(theme.id)}
            className={currentTheme === theme.id ? "bg-accent" : ""}
          >
            <div className="flex flex-col">
              <span className="font-medium">{theme.name}</span>
              <span className={`text-xs ${currentTheme === theme.id ? "" : "text-muted-foreground"}`}>
                {theme.description}
              </span>
            </div>
          </DropdownMenuItem>
        ))}

        {availableThemes.length === 0 && (
          <DropdownMenuItem disabled>
            <span className="text-xs text-muted-foreground">
              Aucun thème personnalisé trouvé
            </span>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
