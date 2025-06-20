"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Palette, Check } from "lucide-react"

// Définition des thèmes disponibles
const themes = [
  {
    id: "default",
    name: "Défaut",
    description: "Thème par défaut",
    cssFile: "/styles/default.css",
  },
  {
    id: "blue-bubblegum",
    name: "Bleu Bubblegum",
    description: "Thème bleu avec des accents colorés",
    cssFile: "/styles/blue-bubblegum.css",
  },
]

export function ThemeSelector() {
  const [currentTheme, setCurrentTheme] = useState("default")
  const [mounted, setMounted] = useState(false)

  // Charger le thème depuis localStorage au montage
  useEffect(() => {
    const savedTheme = localStorage.getItem("selected-theme") || "default"
    setCurrentTheme(savedTheme)
    loadTheme(savedTheme)
    setMounted(true)
  }, [])

  // Fonction pour charger un thème
  const loadTheme = (themeId: string) => {
    // Supprimer les anciens liens de thème
    const existingThemeLinks = document.querySelectorAll('link[data-theme]')
    existingThemeLinks.forEach(link => link.remove())

    // Trouver le thème sélectionné
    const selectedTheme = themes.find(theme => theme.id === themeId)
    
    if (selectedTheme && selectedTheme.cssFile) {
      // Créer un nouveau lien CSS
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = selectedTheme.cssFile
      link.setAttribute('data-theme', themeId)
      document.head.appendChild(link)
    }
  }

  // Fonction pour changer de thème
  const changeTheme = (themeId: string) => {
    setCurrentTheme(themeId)
    loadTheme(themeId)
    localStorage.setItem("selected-theme", themeId)
  }

  if (!mounted) {
    return (
      <Button variant="ghost" size="sm" className="gap-2">
        <Palette className="h-4 w-4" />
        <span className="hidden sm:inline">{`Thème`}</span>
      </Button>
    )
  }

  const currentThemeData = themes.find(theme => theme.id === currentTheme)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Palette className="h-4 w-4" />
          <span className="hidden sm:inline">
            {currentThemeData?.name || `Thème`}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-2 py-1.5 text-sm font-medium text-muted-foreground">
          {`Choisir un thème`}
        </div>
        {themes.map((theme) => (
          <DropdownMenuItem
            key={theme.id}
            onClick={() => changeTheme(theme.id)}
            className="flex items-center justify-between cursor-pointer"
          >
            <div className="flex flex-col">
              <span className="font-medium">{theme.name}</span>
              <span className="text-xs text-muted-foreground">
                {theme.description}
              </span>
            </div>
            {currentTheme === theme.id && (
              <Check className="h-4 w-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 