"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/providers/toast-provider";
import { Loader2, Save, TestTube, Eye, EyeOff } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const settingsSchema = z.object({
  contactEmail: z.string().email({
    message: "Veuillez entrer une adresse email valide.",
  }),
  phone: z.string().optional(),
  location: z.string().min(1, "La localisation est requise"),
  availability: z.string().min(1, "Les horaires sont requis"),
  responseTime: z.string().min(1, "Le temps de réponse est requis"),
  preferredContact: z.enum(["email", "phone", "both"]),
  autoReply: z.boolean(),
  autoReplyMessage: z.string().optional(),

  // Configuration SMTP
  smtpHost: z.string().min(1, "L'hôte SMTP est requis"),
  smtpPort: z.number().min(1).max(65535, "Port invalide"),
  smtpSecure: z.boolean(),
  smtpUser: z.string().min(1, "L'utilisateur SMTP est requis"),
  smtpPassword: z.string().min(1, "Le mot de passe SMTP est requis"),
  smtpFromName: z.string().min(1, "Le nom d'expéditeur est requis"),
  smtpFromEmail: z.string().email("Email d'expéditeur invalide"),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

export function SettingsForm() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { toast } = useToast();

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      contactEmail: "",
      phone: "",
      location: "France",
      availability: "Maintenant",
      responseTime: "Je réponds généralement dans les 24h",
      preferredContact: "email",
      autoReply: true,
      autoReplyMessage: "",
      smtpHost: "smtp.gmail.com",
      smtpPort: 587,
      smtpSecure: false,
      smtpUser: "",
      smtpPassword: "",
      smtpFromName: "Portfolio Contact",
      smtpFromEmail: "",
    },
  });

  const loadSettings = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/settings");
      if (response.ok) {
        const settings = await response.json();
        if (settings) {
          // Convert null values to empty strings for form inputs
          const formSettings = {
            ...settings,
            phone: settings.phone || "",
            autoReplyMessage: settings.autoReplyMessage || "",
          };
          form.reset(formSettings);
        }
      }
    } catch (error) {
      console.error("Erreur lors du chargement des paramètres:", error);
    } finally {
      setIsLoading(false);
    }
  }, [form]);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const onSubmit = async (values: SettingsFormValues) => {
    setIsSaving(true);

    try {
      const response = await fetch("/api/admin/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la sauvegarde");
      }

      toast({
        title: "Paramètres sauvegardés !",
        description: "Vos paramètres ont été mis à jour avec succès.",
      });
    } catch (error) {
      console.error("Erreur:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la sauvegarde.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const testSmtpConfig = async () => {
    setIsTesting(true);

    try {
      const formValues = form.getValues();
      console.log("Valeurs du formulaire pour test SMTP:", formValues);
      
      const response = await fetch("/api/admin/settings/test-smtp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          smtpHost: formValues.smtpHost,
          smtpPort: formValues.smtpPort,
          smtpSecure: formValues.smtpSecure,
          smtpUser: formValues.smtpUser,
          smtpPassword: formValues.smtpPassword,
          smtpFromName: formValues.smtpFromName,
          smtpFromEmail: formValues.smtpFromEmail,
          contactEmail: formValues.contactEmail,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          title: "Test réussi !",
          description:
            "La configuration SMTP fonctionne correctement. Un email de test a été envoyé.",
        });
      } else {
        throw new Error(result.error || "Erreur lors du test");
      }
    } catch (error) {
      console.error("Erreur:", error);
      toast({
        title: "Test échoué",
        description:
          error instanceof Error
            ? error.message
            : "La configuration SMTP ne fonctionne pas.",
        variant: "destructive",
      });
    } finally {
      setIsTesting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Informations de contact */}
        <Card>
          <CardHeader>
            <CardTitle>{`Informations de contact`}</CardTitle>
            <CardDescription>
              {`Ces informations seront affichées sur votre page de contact.`}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="contactEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email de contact</FormLabel>
                    <FormControl>
                      <Input placeholder="votre@email.com" {...field} />
                    </FormControl>
                    <FormDescription>
                      {`L'email où vous recevrez les messages de contact.`}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Téléphone (optionnel)</FormLabel>
                    <FormControl>
                      <Input placeholder="+33 6 12 34 56 78" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Localisation</FormLabel>
                    <FormControl>
                      <Input placeholder="France" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="availability"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Disponibilité</FormLabel>
                    <FormControl>
                      <Input placeholder="Maintenant, Septembre 2025 etc..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="responseTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Temps de réponse</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Je réponds généralement dans les 24h"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Separator />

        {/* Configuration SMTP */}
        <Card>
          <CardHeader>
            <CardTitle>{`Configuration SMTP`}</CardTitle>
            <CardDescription>
              {`Configurez vos paramètres SMTP pour recevoir les emails de contact.`}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <FormField
                control={form.control}
                name="smtpHost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Serveur SMTP</FormLabel>
                    <FormControl>
                      <Input placeholder="smtp.gmail.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="smtpPort"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Port</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="587"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="smtpSecure"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">SSL/TLS</FormLabel>
                      <FormDescription>
                        {`Utiliser une connexion sécurisée`}
                      </FormDescription>
                    </div>
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="data-[state=checked]:bg-primary"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="smtpUser"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom d&apos;utilisateur</FormLabel>
                    <FormControl>
                      <Input placeholder="votre@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="smtpPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mot de passe</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="smtpFromName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom d&apos;expéditeur</FormLabel>
                    <FormControl>
                      <Input placeholder="Portfolio Contact" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="smtpFromEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email d&apos;expéditeur</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="noreply@monportfolio.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={testSmtpConfig}
                disabled={isTesting}
              >
                {isTesting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {`Test en cours...`}
                  </>
                ) : (
                  <>
                    <TestTube className="mr-2 h-4 w-4" />
                    {`Tester la configuration`}
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {`Sauvegarde...`}
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {`Sauvegarder les paramètres`}
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
