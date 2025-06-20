"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import { ServiceForm } from "./ServiceForm";
import { useToast } from "@/components/providers/toast-provider";

interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface ServicesManagerProps {
  services: Service[];
}

export function ServicesManager({ services: initialServices }: ServicesManagerProps) {
  const [services, setServices] = useState(initialServices);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const { toast } = useToast();

  const handleCreateService = (newService: Service) => {
    setServices([newService, ...services]);
    setIsCreateOpen(false);
    toast({
      title: "Service créé !",
      description: "Le service a été créé avec succès.",
    });
  };

  const handleUpdateService = (updatedService: Service) => {
    setServices(services.map(s => s.id === updatedService.id ? updatedService : s));
    setEditingService(null);
    toast({
      title: "Service mis à jour !",
      description: "Le service a été modifié avec succès.",
    });
  };

  const handleDeleteService = async (serviceId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce service ?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/services/${serviceId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression");
      }

      setServices(services.filter(s => s.id !== serviceId));
      toast({
        title: "Service supprimé !",
        description: "Le service a été supprimé avec succès.",
      });
    } catch (error) {
      console.error("Erreur:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression.",
        variant: "destructive",
      });
    }
  };

  const handleTogglePublish = async (service: Service) => {
    try {
      const response = await fetch(`/api/admin/services/${service.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isPublished: !service.isPublished,
        }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour");
      }

      const updatedService = await response.json();
      setServices(services.map(s => s.id === service.id ? updatedService : s));
      
      toast({
        title: service.isPublished ? "Service masqué" : "Service publié",
        description: `Le service a été ${service.isPublished ? "masqué" : "publié"} avec succès.`,
      });
    } catch (error) {
      console.error("Erreur:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header avec bouton créer */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">
            {`Services (${services.length})`}
          </h2>
          <p className="text-muted-foreground">
            {`Gérez vos services et leurs tarifs`}
          </p>
        </div>
        
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              {`Nouveau service`}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{`Créer un nouveau service`}</DialogTitle>
              <DialogDescription>
                {`Ajoutez un nouveau service à votre portfolio.`}
              </DialogDescription>
            </DialogHeader>
            <ServiceForm onSuccess={handleCreateService} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Liste des services */}
      {services.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">
                {`Aucun service`}
              </h3>
              <p className="text-muted-foreground mb-4">
                {`Commencez par créer votre premier service.`}
              </p>
              <Button onClick={() => setIsCreateOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                {`Créer un service`}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <Card key={service.id} className="relative">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{service.title}</CardTitle>
                    <CardDescription className="mt-2">
                      {service.description.length > 100
                        ? `${service.description.substring(0, 100)}...`
                        : service.description}
                    </CardDescription>
                  </div>
                  <Badge variant={service.isPublished ? "default" : "secondary"}>
                    {service.isPublished ? "Publié" : "Brouillon"}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-2xl font-bold text-primary">
                      {service.price > 0 ? `${service.price}€` : "Sur devis"}
                    </p>
                    {service.price > 0 && (
                      <p className="text-sm text-muted-foreground">par jour</p>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTogglePublish(service)}
                    >
                      {service.isPublished ? (
                        <>
                          <EyeOff className="mr-2 h-4 w-4" />
                          {`Masquer`}
                        </>
                      ) : (
                        <>
                          <Eye className="mr-2 h-4 w-4" />
                          {`Publier`}
                        </>
                      )}
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingService(service)}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      {`Modifier`}
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteService(service.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      {`Supprimer`}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Dialog d'édition */}
      <Dialog open={!!editingService} onOpenChange={() => setEditingService(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{`Modifier le service`}</DialogTitle>
            <DialogDescription>
              {`Modifiez les informations de votre service.`}
            </DialogDescription>
          </DialogHeader>
          {editingService && (
            <ServiceForm 
              service={editingService} 
              onSuccess={handleUpdateService} 
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 