
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ToastProvider } from "@/components/providers/toast-provider";
import { Footer } from "@/components/layout/footer";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: {
    default: "Portfolio - Développeur Full Stack",
    template: "%s | Portfolio",
  },
  description:
    "Portfolio de développeur full stack spécialisé en React, Next.js, TypeScript et Node.js. Découvrez mes projets, services et articles de blog.",
  keywords: [
    "développeur",
    "fullstack",
    "react",
    "nextjs",
    "typescript",
    "nodejs",
    "portfolio",
  ],
  authors: [{ name: "Votre Nom" }],
  creator: "Votre Nom",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
  alternates: {
    canonical: new URL(
      "/",
      process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
    ).toString(),
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "/",
    siteName: "Portfolio",
    title: "Portfolio - Développeur Full Stack",
    description:
      "Portfolio de développeur full stack spécialisé en React, Next.js, TypeScript et Node.js.",
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
    title: "Portfolio - Développeur Full Stack",
    description:
      "Portfolio de développeur full stack spécialisé en React, Next.js, TypeScript et Node.js.",
    images: ["/og-image.png"],
    creator: "@votre_handle",
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        {/* Preload de l'image optimisée avec support WebP */}
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
        <link
          rel="dns-prefetch"
          href="https://aws-0-eu-west-3.pooler.supabase.com"
        />
      </head>
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} font-sans antialiased w-full bg-background`}
        cz-shortcut-listen="true"
      >
        <ThemeProvider>
          <ToastProvider>
            <div className="flex min-h-screen flex-col">
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <Toaster />
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
