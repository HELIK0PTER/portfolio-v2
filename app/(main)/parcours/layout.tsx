import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Parcours | Matheus Kops Guedes",
  description: "Découvrez mon parcours académique et professionnel, formations et expériences.",
  alternates: {
    canonical: new URL(
      "/parcours",
      process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
    ).toString(),
  },
};

export default function ParcoursLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 