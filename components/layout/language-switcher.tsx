"use client";

import { useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ className }: { className?: string }) {
  const locale = useLocale();
  const pathname = usePathname();

  return (
    <div className={cn("flex items-center gap-1 text-xs font-medium", className)}>
      {routing.locales.map((l, i) => (
        <span key={l} className="flex items-center">
          {i > 0 && <span className="text-muted-foreground/40 px-1">/</span>}
          <Link
            href={pathname}
            locale={l}
            className={cn(
              "transition-colors hover:text-primary uppercase",
              locale === l
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {l}
          </Link>
        </span>
      ))}
    </div>
  );
}
