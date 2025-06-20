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

interface Education {
  id?: string;
  title: string;
  institution: string;
  location: string;
  description: string;
  startDate: string;
  endDate?: string | null;
  isCurrently: boolean;
  grade?: string | null;
  skills: string[];
  isPublished: boolean;
}

interface EducationFormProps {
  education?: Education;
  isEditing?: boolean;
}

export function EducationForm({ education, isEditing = false }: EducationFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<Education>({
    title: education?.title || "",
    institution: education?.institution || "",
    location: education?.location || "",
    description: education?.description || "",
    startDate: education?.startDate ? new Date(education.startDate).toISOString().split('T')[0] : "",
    endDate: education?.endDate ? new Date(education.endDate).toISOString().split('T')[0] : "",
    isCurrently: education?.isCurrently || false,
    grade: education?.grade || "",
    skills: education?.skills || [],
    isPublished: education?.isPublished || true,
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
        ? `/api/admin/educations/${education?.id}` 
        : '/api/admin/educations';
      
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
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la sauvegarde');
      }

      toast({
        title: isEditing ? "Formation modifiée" : "Formation créée",
        description: `La formation a été ${isEditing ? "modifiée" : "créée"} avec succès.`,
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
          {isEditing ? `Modifier la formation` : `Nouvelle formation`}
        </CardTitle>
        <CardDescription>
          {isEditing 
            ? `Modifiez les informations de la formation`
            : `Ajoutez une nouvelle formation à votre parcours`
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">{`Titre de la formation *`}</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Ex: Master en Informatique"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="institution">{`Institution *`}</Label>
              <Input
                id="institution"
                name="institution"
                value={formData.institution}
                onChange={handleInputChange}
                placeholder="Ex: Université de Paris"
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
              <Label htmlFor="grade">{`Diplôme/Note`}</Label>
              <Input
                id="grade"
                name="grade"
                value={formData.grade || ""}
                onChange={handleInputChange}
                placeholder="Ex: Mention Bien, En cours..."
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
              placeholder="Décrivez le contenu de la formation, les matières étudiées..."
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
                  {`Cette formation est en cours`}
                </Label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>{`Compétences acquises`}</Label>
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
                {`Publier cette formation`}
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