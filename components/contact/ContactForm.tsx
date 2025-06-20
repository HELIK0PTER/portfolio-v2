"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/providers/toast-provider";
import { Loader2, Send } from "lucide-react";

const contactSchema = z.object({
  name: z.string().min(2, {
    message: "Le nom doit contenir au moins 2 caractères.",
  }),
  email: z.string().email({
    message: "Veuillez entrer une adresse email valide.",
  }),
  subject: z.string().min(5, {
    message: "Le sujet doit contenir au moins 5 caractères.",
  }),
  message: z.string().min(10, {
    message: "Le message doit contenir au moins 10 caractères.",
  }),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  // Fonction pour générer le template de message selon le service
  const generateMessageTemplate = (serviceName: string) => {
    const templates = {
      "Développement Web Full Stack": `Bonjour,

Je suis intéressé(e) par votre service de développement web full stack.

Mon projet concerne :
- Une application web complète
- Un site vitrine/e-commerce  
- Une API/backend
- Autre : ___________

Détails du projet :
- Budget estimé : ___________
- Timeline souhaitée : ___________
- Technologies préférées : ___________

Description détaillée :
[Décrivez votre projet, vos besoins spécifiques, fonctionnalités attendues...]

Merci pour votre temps !`,

      "Optimisation de Performance": `Bonjour,

J'aimerais améliorer les performances de mon application existante.

Problèmes rencontrés :
- Temps de chargement lents
- Problèmes de SEO
- Performance mobile
- Autre : ___________

Informations sur l'application :
- URL : ___________
- Technologies utilisées : ___________
- Trafic mensuel approximatif : ___________

Objectifs :
[Décrivez les améliorations souhaitées, métriques cibles...]

Merci !`,

      "Formation & Mentoring": `Bonjour,

Je suis intéressé(e) par vos services de formation/mentoring.

Type de formation souhaité :
- Formation individuelle
- Formation équipe
- Mentoring long terme
- Code review ponctuel

Sujets d'intérêt :
- React/Next.js
- Architecture d'applications
- Best practices
- Autre : ___________

Niveau actuel : ___________
Objectifs : ___________

Merci !`,

      "Consulting Technique": `Bonjour,

J'aimerais bénéficier de votre expertise technique.

Type de consulting :
- Audit technique
- Choix d'architecture
- Stratégie de développement
- Autre : ___________

Contexte du projet :
- Secteur d'activité : ___________
- Taille de l'équipe : ___________
- Technologies actuelles : ___________

Problématiques :
[Décrivez les défis techniques, questions spécifiques...]

Merci !`,

      "Migration et Modernisation": `Bonjour,

Je souhaite moderniser/migrer mon application existante.

Application actuelle :
- Technologies : ___________
- Âge de l'application : ___________
- Problèmes rencontrés : ___________

Objectifs de migration :
- Nouvelles technologies
- Amélioration performance
- Facilité de maintenance
- Autre : ___________

Technologies cibles souhaitées : ___________

Contraintes :
[Budget, timing, continuité de service...]

Merci !`,

      "Audit de Sécurité": `Bonjour,

J'aimerais faire auditer la sécurité de mon application.

Type d'application :
- Application web
- API
- E-commerce
- Autre : ___________

Informations :
- URL (si applicable) : ___________
- Technologies : ___________
- Données sensibles traitées : ___________

Préoccupations spécifiques :
[Décrivez vos inquiétudes en matière de sécurité...]

Merci !`,

      "Alternance": `Bonjour,

Je représente [Nom de l'entreprise] et je suis intéressé(e) par votre profil pour une alternance.

Informations sur l'alternance :
- Poste : ___________
- Durée : ___________
- Localisation : ___________
- Rythme : ___________

Mission proposée :
- Technologies utilisées : ___________
- Projets : ___________
- Équipe : ___________

Nous aimerions échanger avec vous pour discuter de cette opportunité.

Cordialement`
    };

    return templates[serviceName as keyof typeof templates] || `Bonjour,

Je suis intéressé(e) par votre service "${serviceName}".

[Décrivez votre projet et vos besoins...]

Merci !`;
  };

  // Effet pour pré-remplir le formulaire selon les paramètres URL
  useEffect(() => {
    const service = searchParams.get('service');
    if (service) {
      const decodedService = decodeURIComponent(service);
      const messageTemplate = generateMessageTemplate(decodedService);
      
      form.setValue('subject', `Demande de devis - ${decodedService}`);
      form.setValue('message', messageTemplate);
    }
  }, [searchParams, form]);

  const onSubmit = async (values: ContactFormValues) => {
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'envoi du message");
      }

      toast({
        title: "Message envoyé !",
        description:
          "Votre message a été envoyé avec succès. Je vous répondrai dans les plus brefs délais.",
      });

      form.reset();
    } catch (error) {
      console.error("Erreur:", error);
      toast({
        title: "Erreur",
        description:
          "Une erreur est survenue lors de l'envoi du message. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex flex-col flex-1">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom complet</FormLabel>
                <FormControl>
                  <Input placeholder="Votre nom" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="votre.email@exemple.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sujet</FormLabel>
              <FormControl>
                <Input placeholder="Sujet de votre message" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem className="h-full flex flex-col justify-start">
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Décrivez votre projet, vos besoins ou votre question..."
                  className="min-h-[120px] flex-1"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full"
          size="lg"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {`Envoi en cours...`}
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              {`Envoyer le message`}
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
