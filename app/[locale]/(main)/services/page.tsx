import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight, Code } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getServices, type Locale } from "@/lib/data";

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Services");
  const services = getServices(locale as Locale);

  return (
    <div className="min-h-screen py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl mb-4">
            {t("title")}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 mb-16">
          {services.map((service) => (
            <Card
              key={service.id}
              className="relative overflow-hidden transition-all duration-300 hover:shadow-lg"
            >
              <CardHeader>
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Code className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{service.title}</CardTitle>
                    {service.price > 0 && (
                      <p className="text-2xl font-bold text-primary">
                        {t("from")} {service.price}€
                      </p>
                    )}
                  </div>
                </div>
                <CardDescription className="text-base leading-relaxed whitespace-pre-line">
                  {service.description}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <Button asChild className="w-full" variant="outline">
                  <Link
                    href={`/contact?service=${encodeURIComponent(service.title)}`}
                  >
                    {t("contactCta")}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
