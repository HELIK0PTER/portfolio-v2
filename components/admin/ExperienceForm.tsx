"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import { useToast } from "@/components/providers/toast-provider";

interface Experience {
  id?: string;
  title: string;
  company: string;
  location: string;
  description: string;
  startDate: string;
  endDate?: string | null;
  isCurrently: boolean;
  skills: string[];
  companyUrl?: string | null;
  isPublished: boolean;
}

interface ExperienceFormProps {
  experience?: Experience;
  isEditing?: boolean;
}

export function ExperienceForm({ experience, isEditing = false }: ExperienceFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<Experience>({
    title: experience?.title || "",
    company: experience?.company || "",
    location: experience?.location || "",
    description: experience?.description || "",
    startDate: experience?.startDate ? new Date(experience.startDate).toISOString().split('T')[0] : "",
    endDate: experience?.endDate ? new Date(experience.endDate).toISOString().split('T')[0] : "",
    isCurrently: experience?.isCurrently || false,
    skills: experience?.skills || [],
    companyUrl: experience?.companyUrl || "",
    isPublished: experience?.isPublished || true,
  });

  const [newSkill, setNewSkill] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }));
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const url = isEditing 
        ? `/api/admin/experiences/${experience?.id}` 
        : '/api/admin/experiences';
      
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          startDate: new Date(formData.startDate).toISOString(),
          endDate: formData.endDate ? new Date(formData.endDate).toISOString() : null,
          companyUrl: formData.companyUrl || null,
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la sauvegarde');
      }

      toast({
        title: isEditing ? "Expérience modifiée" : "Expérience créée",
        description: `L'expérience a été ${isEditing ? "modifiée" : "créée"} avec succès.`,
      });

      router.push('/admin/parcours');
      router.refresh();
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la sauvegarde.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>
          {isEditing ? `Modifier l'expérience` : `Nouvelle expérience`}
        </CardTitle>
        <CardDescription>
          {isEditing 
            ? `Modifiez les informations de l'expérience`
            : `Ajoutez une nouvelle expérience à votre parcours`
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">{`Titre du poste *`}</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Ex: Développeur Full Stack"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">{`Entreprise *`}</Label>
              <Input
                id="company"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                placeholder="Ex: Google, Startup..."
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">{`Lieu *`}</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Ex: Paris, France"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyUrl">{`Site web de l'entreprise`}</Label>
              <Input
                id="companyUrl"
                name="companyUrl"
                type="url"
                value={formData.companyUrl || ""}
                onChange={handleInputChange}
                placeholder="https://example.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">{`Description *`}</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Décrivez vos missions, réalisations, projets..."
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">{`Date de début *`}</Label>
              <Input
                id="startDate"
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">{`Date de fin`}</Label>
              <Input
                id="endDate"
                name="endDate"
                type="date"
                value={formData.endDate || ""}
                onChange={handleInputChange}
                disabled={formData.isCurrently}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="isCurrently">{`En cours`}</Label>
              <div className="flex items-center space-x-2 mt-2">
                <input
                  id="isCurrently"
                  name="isCurrently"
                  type="checkbox"
                  checked={formData.isCurrently}
                  onChange={handleInputChange}
                  className="rounded"
                />
                <Label htmlFor="isCurrently" className="text-sm">
                  {`Cette expérience est en cours`}
                </Label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>{`Compétences utilisées`}</Label>
            <div className="flex gap-2">
              <Input
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Ex: React, Python..."
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
              />
              <Button type="button" onClick={handleAddSkill} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.skills.map((skill, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <input
                id="isPublished"
                name="isPublished"
                type="checkbox"
                checked={formData.isPublished}
                onChange={handleInputChange}
                className="rounded"
              />
              <Label htmlFor="isPublished" className="text-sm">
                {`Publier cette expérience`}
              </Label>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting 
                ? (isEditing ? `Modification...` : `Création...`)
                : (isEditing ? `Modifier` : `Créer`)
              }
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => router.push('/admin/parcours')}
            >
              {`Annuler`}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
} 