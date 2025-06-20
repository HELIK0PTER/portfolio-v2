"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Plus, GraduationCap, Briefcase, Calendar, MapPin } from "lucide-react";
import { useToast } from "@/components/providers/toast-provider";

interface Education {
  id: string;
  title: string;
  institution: string;
  location: string;
  description: string;
  startDate: Date | string;
  endDate?: Date | string | null;
  isCurrently: boolean;
  grade?: string | null;
  skills: string[];
  isPublished: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

interface Experience {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  startDate: Date | string;
  endDate?: Date | string | null;
  isCurrently: boolean;
  skills: string[];
  companyUrl?: string | null;
  isPublished: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

interface ParcoursManagerProps {
  educations: Education[];
  experiences: Experience[];
}

export function ParcoursManager({ educations: initialEducations, experiences: initialExperiences }: ParcoursManagerProps) {
  const router = useRouter();
  const [educations, setEducations] = useState(initialEducations);
  const [experiences, setExperiences] = useState(initialExperiences);
  const { toast } = useToast();

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) {
      return 'Date invalide';
    }
    return new Intl.DateTimeFormat('fr-FR', {
      month: 'long',
      year: 'numeric'
    }).format(dateObj);
  };

  const handleToggleEducationPublish = async (education: Education) => {
    try {
      const response = await fetch(`/api/admin/educations/${education.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isPublished: !education.isPublished,
        }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour");
      }

      const updatedEducation = await response.json();
      setEducations(educations.map(e => e.id === education.id ? updatedEducation : e));
      
      toast({
        title: education.isPublished ? "Formation masquée" : "Formation publiée",
        description: `La formation a été ${education.isPublished ? "masquée" : "publiée"} avec succès.`,
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

  const handleToggleExperiencePublish = async (experience: Experience) => {
    try {
      const response = await fetch(`/api/admin/experiences/${experience.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isPublished: !experience.isPublished,
        }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour");
      }

      const updatedExperience = await response.json();
      setExperiences(experiences.map(e => e.id === experience.id ? updatedExperience : e));
      
      toast({
        title: experience.isPublished ? "Expérience masquée" : "Expérience publiée",
        description: `L'expérience a été ${experience.isPublished ? "masquée" : "publiée"} avec succès.`,
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

  const handleDeleteEducation = async (education: Education) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer la formation "${education.title}" ?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/educations/${education.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression");
      }

      setEducations(educations.filter(e => e.id !== education.id));
      
      toast({
        title: "Formation supprimée",
        description: "La formation a été supprimée avec succès.",
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

  const handleDeleteExperience = async (experience: Experience) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer l'expérience "${experience.title}" ?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/experiences/${experience.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression");
      }

      setExperiences(experiences.filter(e => e.id !== experience.id));
      
      toast({
        title: "Expérience supprimée",
        description: "L'expérience a été supprimée avec succès.",
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">
            {`Parcours (${educations.length + experiences.length} éléments)`}
          </h2>
          <p className="text-muted-foreground">
            {`Gérez vos formations et expériences professionnelles`}
          </p>
        </div>
      </div>

      <Tabs defaultValue="educations" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="educations" className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            {`Formations (${educations.length})`}
          </TabsTrigger>
          <TabsTrigger value="experiences" className="flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            {`Expériences (${experiences.length})`}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="educations" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">{`Formations`}</h3>
            <Button onClick={() => router.push('/admin/parcours/educations/new')}>
              <Plus className="mr-2 h-4 w-4" />
              {`Ajouter une formation`}
            </Button>
          </div>

          <div className="grid gap-6">
            {educations.map((education) => (
              <Card key={education.id} className="relative">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{education.title}</CardTitle>
                      <div className="flex items-center gap-4 text-muted-foreground mt-2">
                        <div className="flex items-center gap-1">
                          <GraduationCap className="h-4 w-4" />
                          <span>{education.institution}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{education.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {formatDate(education.startDate)} - {" "}
                            {education.isCurrently ? "Présent" : formatDate(education.endDate!)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {education.isCurrently && (
                        <Badge variant="secondary">{`En cours`}</Badge>
                      )}
                      {education.grade && (
                        <Badge variant="default">{education.grade}</Badge>
                      )}
                      <Badge variant={education.isPublished ? "default" : "secondary"}>
                        {education.isPublished ? "Publié" : "Brouillon"}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <CardDescription className="text-base leading-relaxed mb-4">
                    {education.description}
                  </CardDescription>
                  
                  {education.skills && education.skills.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-semibold mb-2">{`Compétences acquises :`}</h4>
                      <div className="flex flex-wrap gap-2">
                        {education.skills.map((skill, index) => (
                          <Badge key={index} variant="outline">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleEducationPublish(education)}
                    >
                      {education.isPublished ? `Masquer` : `Publier`}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => router.push(`/admin/parcours/educations/${education.id}/edit`)}
                    >
                      {`Modifier`}
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => handleDeleteEducation(education)}
                    >
                      {`Supprimer`}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="experiences" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">{`Expériences`}</h3>
            <Button onClick={() => router.push('/admin/parcours/experiences/new')}>
              <Plus className="mr-2 h-4 w-4" />
              {`Ajouter une expérience`}
            </Button>
          </div>

          <div className="grid gap-6">
            {experiences.map((experience) => (
              <Card key={experience.id} className="relative">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{experience.title}</CardTitle>
                      <div className="flex items-center gap-4 text-muted-foreground mt-2">
                        <div className="flex items-center gap-1">
                          <Briefcase className="h-4 w-4" />
                          <span>{experience.company}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{experience.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {formatDate(experience.startDate)} - {" "}
                            {experience.isCurrently ? "Présent" : formatDate(experience.endDate!)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {experience.isCurrently && (
                        <Badge variant="secondary">{`En cours`}</Badge>
                      )}
                      <Badge variant={experience.isPublished ? "default" : "secondary"}>
                        {experience.isPublished ? "Publié" : "Brouillon"}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <CardDescription className="text-base leading-relaxed mb-4">
                    {experience.description}
                  </CardDescription>
                  
                  {experience.skills && experience.skills.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-semibold mb-2">{`Compétences utilisées :`}</h4>
                      <div className="flex flex-wrap gap-2">
                        {experience.skills.map((skill, index) => (
                          <Badge key={index} variant="outline">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleExperiencePublish(experience)}
                    >
                      {experience.isPublished ? `Masquer` : `Publier`}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => router.push(`/admin/parcours/experiences/${experience.id}/edit`)}
                    >
                      {`Modifier`}
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => handleDeleteExperience(experience)}
                    >
                      {`Supprimer`}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 