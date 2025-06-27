import { Metadata } from "next";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Connexion Admin | Portfolio",
  description: "Accès à l'interface d'administration du portfolio",
  alternates: {
    canonical: new URL(
      "/login",
      process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
    ).toString(),
  },
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold gradient-text mb-2">
            {`Administration`}
          </h1>
          <p className="text-muted-foreground">
            {`Connectez-vous pour accéder au dashboard`}
          </p>
        </div>

        <div className="bg-card border rounded-lg shadow-lg p-6">
          <LoginForm />
        </div>

        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground">
            {`Accès réservé à l'administrateur`}
          </p>
        </div>
      </div>
    </div>
  );
}
