import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Mail, MapPin, Phone, Calendar } from "lucide-react";
import { ContactForm } from "@/components/contact/ContactForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getContact, type Locale } from "@/lib/data";

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Contact");
  const contact = getContact(locale as Locale);

  const items = [
    { icon: Mail, title: t("email"), value: contact.contactEmail },
    {
      icon: Phone,
      title: t("phone"),
      value: contact.phone ?? "—",
    },
    {
      icon: Calendar,
      title: t("availability"),
      value: contact.availability,
    },
    { icon: MapPin, title: t("location"), value: contact.location },
  ];

  return (
    <div className="min-h-screen py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl mb-4">
            {t("title")}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <Card className="shadow-lg h-full">
              <CardHeader>
                <CardTitle className="text-2xl">{t("title")}</CardTitle>
                <CardDescription>{t("subtitle")}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-1">
                <Suspense fallback={<div>…</div>}>
                  <ContactForm />
                </Suspense>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6">
            {items.map((item, index) => (
              <Card key={index} className="border-l-4 border-l-primary">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <item.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">
                        {item.title}
                      </h3>
                      <p className="font-medium text-foreground">
                        {item.value}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            <Card className="border-l-4 border-l-primary">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">
                      {t("responseTime")}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {contact.responseTime}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
