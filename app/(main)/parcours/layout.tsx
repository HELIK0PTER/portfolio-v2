import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Parcours | Matheus Kops Guedes",
  description: "Découvrez mon parcours académique et professionnel, formations et expériences.",
};

export default function ParcoursLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 