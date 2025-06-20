"use client";

import { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Save } from "lucide-react";

const serviceSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  description: z.string().min(10, "La description doit faire au moins 10 caractères"),
  price: z.number().min(0, "Le prix doit être positif"),
  isPublished: z.boolean(),
});

type ServiceFormValues = z.infer<typeof serviceSchema>;

interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface ServiceFormProps {
  service?: Service;
  onSuccess: (service: Service) => void;
}

export function ServiceForm({ service, onSuccess }: ServiceFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      title: service?.title || "",
      description: service?.description || "",
      price: service?.price || 0,
      isPublished: service?.isPublished || false,
    },
  });

  const onSubmit = async (values: ServiceFormValues) => {
    setIsSubmitting(true);

    try {
      const url = service 
        ? `/api/admin/services/${service.id}`
        : "/api/admin/services";
      
      const method = service ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la sauvegarde");
      }

      const savedService = await response.json();
      onSuccess(savedService);
      
      if (!service) {
        form.reset();
      }
    } catch (error) {
      console.error("Erreur:", error);
      // L'erreur sera gérée par le composant parent via les toasts
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Titre du service</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Ex: Développement Web Full Stack" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Décrivez votre service en détail..."
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                {`Une description claire et attractive de votre service.`}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prix (€/jour)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="0"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                />
              </FormControl>
              <FormDescription>
                {`Mettez 0 pour "Sur devis". Le prix sera affiché par jour.`}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isPublished"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Publier le service</FormLabel>
                <FormDescription>
                  {`Le service sera visible sur votre page publique.`}
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

        <div className="flex justify-end gap-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {service ? `Mise à jour...` : `Création...`}
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {service ? `Mettre à jour` : `Créer le service`}
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
} 