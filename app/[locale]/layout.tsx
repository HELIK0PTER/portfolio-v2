import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ToastProvider } from "@/components/providers/toast-provider";
import { Footer } from "@/components/layout/footer";
import { Toaster } from "@/components/ui/toaster";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Home" });

  const title = `Portfolio - ${t("heroPrefix")} ${t("heroHighlight")}`;
  const description = t("heroSubtitle");

  return {
    title: {
      default: title,
      template: "%s | Portfolio",
    },
    description,
    keywords: [
      "développeur",
      "fullstack",
      "react",
      "nextjs",
      "typescript",
      "nodejs",
      "portfolio",
    ],
    authors: [{ name: "Matheus Kops Guedes" }],
    creator: "Matheus Kops Guedes",
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    ),
    openGraph: {
      type: "website",
      locale: locale === "fr" ? "fr_FR" : "en_US",
      url: "/",
      siteName: "Portfolio",
      title,
      description,
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: "Portfolio",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og-image.png"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    other: {
      "google-site-verification":
        "D9OMcuNnMNpnquNWtmz7v-BQF1QrycbMVQ2nYxxPXjc",
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link
          rel="preload"
          href="/profile-optimized.webp"
          as="image"
          type="image/webp"
        />
        <link
          rel="preload"
          href="/profile-optimized.jpg"
          as="image"
          type="image/jpeg"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} font-sans antialiased w-full bg-background`}
        cz-shortcut-listen="true"
      >
        <NextIntlClientProvider>
          <ThemeProvider>
            <ToastProvider>
              <div className="flex min-h-screen flex-col">
                <main className="flex-1">{children}</main>
                <Footer />
              </div>
              <Toaster />
            </ToastProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
