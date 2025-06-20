import Link from "next/link";
import { Github, Linkedin, Mail, Shield } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: "GitHub",
      href: "https://github.com/HELIK0PTER",
      icon: Github,
    },
    {
      name: "LinkedIn",
      href: "https://www.linkedin.com/in/matheus-kops-guedes-4293b7213/",
      icon: Linkedin,
    },
    {
      name: "Email",
      href: "mailto:matheuskg.pro@gmail.com",
      icon: Mail,
    },
  ];

  return (
    <footer className="border-t bg-background pt-8">
      <div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 px-4">
          {/* Logo et description */}
          <div className="space-y-4">
            <div className="text-2xl font-bold gradient-text">Portfolio</div>
            <p className="text-muted-foreground">
              Développeur passionné créant des expériences numériques innovantes
              et performantes.
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h3 className="font-semibold">Navigation</h3>
            <nav className="flex flex-col space-y-2">
              <Link
                href="/projets"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Projets
              </Link>
              <Link
                href="/services"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Services
              </Link>
              <Link
                href="/blog"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Blog
              </Link>
              <Link
                href="/contact"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Contact
              </Link>
            </nav>
          </div>

          {/* Liens utiles */}
          <div className="space-y-4">
            <h3 className="font-semibold">Liens utiles</h3>
            <nav className="flex flex-col space-y-2">
              <Link
                href="/labs"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Labs
              </Link>
              <Link
                href="/privacy"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Confidentialité
              </Link>
              <Link
                href="/terms"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Mentions légales
              </Link>
            </nav>
          </div>

          {/* Réseaux sociaux */}
          <div className="space-y-4">
            <h3 className="font-semibold">Suivez-moi</h3>
            <div className="flex space-x-4">
              {socialLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon className="h-5 w-5" />
                    <span className="sr-only">{link.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-4 border-t border-border text-center text-muted-foreground flex justify-between px-4">
          <p>
            © {currentYear} Portfolio de Matheus KOPS GUEDES. Tous droits
            réservés. Fait avec ❤️ et Next.js
          </p>
          <div className="flex space-x-4 pb-4">
            <Link href="/admin" className="flex items-center gap-2">
              <Shield />
              <span className="text-muted-foreground hover:text-primary transition-colors">
                Admin
              </span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
