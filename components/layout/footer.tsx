import { Github, Linkedin, Mail } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import ThemeSelector from "./theme-selector";

export function Footer() {
  const t = useTranslations("Nav");
  const tFooter = useTranslations("Footer");
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
          <div className="space-y-4">
            <div className="text-2xl font-bold gradient-text">Portfolio</div>
            <p className="text-muted-foreground">Matheus Kops Guedes</p>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">{t("home")}</h3>
            <nav className="flex flex-col space-y-2">
              <Link
                href="/projects"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                {t("projects")}
              </Link>
              <Link
                href="/services"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                {t("services")}
              </Link>
              <Link
                href="/contact"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                {t("contact")}
              </Link>
            </nav>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Social</h3>
            <div className="flex space-x-4">
              {socialLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon className="h-5 w-5" />
                    <span className="sr-only">{link.name}</span>
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-4 border-t border-border text-center text-muted-foreground flex flex-col sm:flex-row sm:justify-between gap-2 px-4 pb-4">
          <p>
            © {currentYear} Matheus Kops Guedes. {tFooter("rights")}
          </p>
          <div className="flex items-center space-x-4">
            <ThemeSelector />
          </div>
        </div>
      </div>
    </footer>
  );
}
