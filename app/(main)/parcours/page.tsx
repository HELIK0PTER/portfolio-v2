"use client";

import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  GraduationCap,
  Briefcase,
  Calendar,
  MapPin,
  Download,
  ExternalLink,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

// Metadata sera gérée par le layout parent

// Données par défaut si la base est vide
const defaultEducations = [
  {
    id: "1",
    title: "Master en Informatique",
    institution: "Université / École",
    location: "Ville, Pays",
    startDate: new Date("2023-09-01"),
    endDate: new Date("2025-06-30"),
    isCurrently: true,
    description:
      "Spécialisation en développement web et technologies modernes. Formation approfondie en architecture logicielle, bases de données, et développement full-stack.",
    skills: [
      "React",
      "Node.js",
      "Python",
      "Bases de données",
      "Architecture logicielle",
    ],
    grade: "En cours",
    isPublished: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    title: "Licence Informatique",
    institution: "Université",
    location: "Ville, Pays",
    startDate: new Date("2020-09-01"),
    endDate: new Date("2023-06-30"),
    isCurrently: false,
    description:
      "Formation généraliste en informatique couvrant les fondamentaux de la programmation, algorithmique, et systèmes.",
    skills: ["Java", "C++", "Algorithmique", "Systèmes", "Réseaux"],
    grade: "Mention Bien",
    isPublished: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const defaultExperiences = [
  {
    id: "1",
    title: "Développeur Full Stack - Alternance",
    company: "Entreprise Recherchée",
    location: "À définir",
    startDate: new Date("2024-09-01"),
    endDate: new Date("2025-08-31"),
    isCurrently: false,
    description:
      "🔍 Actuellement en recherche d'alternance pour septembre 2024. Intéressé par les missions de développement web full-stack, création d'applications modernes, et apprentissage au sein d'une équipe expérimentée.",
    skills: ["React", "Next.js", "TypeScript", "Node.js", "Prisma"],
    companyUrl: null,
    isPublished: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    title: "Développeur Web - Stage",
    company: "Entreprise/Projet Personnel",
    location: "Télétravail",
    startDate: new Date("2023-06-01"),
    endDate: new Date("2023-08-31"),
    isCurrently: false,
    description:
      "Développement d'applications web avec React et Node.js. Création de ce portfolio et d'autres projets personnels pour acquérir de l'expérience pratique.",
    skills: ["React", "Next.js", "JavaScript", "CSS", "Git"],
    companyUrl: null,
    isPublished: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// Animations variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    x: -30,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
  hover: {
    scale: 1.02,
    y: -5,
    transition: {
      duration: 0.2,
      ease: "easeInOut",
    },
  },
};

const badgeVariants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
  hover: {
    scale: 1.1,
    transition: {
      duration: 0.2,
    },
  },
};

// Configuration de revalidation
export const revalidate = 3600; // Revalidation toutes les heures
export const dynamic = 'force-static'; // Force la génération statique
export const dynamicParams = true; // Permet la génération de nouveaux paramètres

export default function ParcoursPage() {
  const [educations, setEducations] = useState(defaultEducations);
  const [experiences, setExperiences] = useState(defaultExperiences);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/parcours");
        if (response.ok) {
          const data = await response.json();

          if (data.educations && data.educations.length > 0) {
            setEducations(data.educations);
          }
          if (data.experiences && data.experiences.length > 0) {
            setExperiences(data.experiences);
          }
        }
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
      }
    };

    fetchData();
  }, []);

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) {
      return "Date invalide";
    }
    return new Intl.DateTimeFormat("fr-FR", {
      month: "long",
      year: "numeric",
    }).format(dateObj);
  };

  return (
    <motion.div
      className="min-h-screen py-16 px-4"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <motion.div className="text-center mb-16" variants={itemVariants}>
          <motion.h1
            className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl mb-4"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {`Mon Parcours`}
          </motion.h1>
          <motion.p
            className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            {`Étudiant passionné en recherche d'alternance, découvrez mon parcours académique et mes premières expériences professionnelles.`}
          </motion.p>

          {/* CTA Alternance */}
          <motion.div
            className="bg-primary/10 border border-primary/20 rounded-lg p-6 mb-8"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            whileHover={{ scale: 1.02 }}
          >
            <motion.div
              className="flex items-center justify-center gap-2 mb-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 3,
                }}
              >
                <Clock className="h-5 w-5 text-primary" />
              </motion.div>
              <span className="font-semibold text-primary">{`En recherche d'alternance`}</span>
            </motion.div>
            <motion.p
              className="text-muted-foreground mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              {`Je recherche activement une alternance en développement web pour septembre 2024. Intéressé par une collaboration ?`}
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row gap-3 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button asChild>
                  <Link href="/contact">{`Me contacter`}</Link>
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button variant="outline" asChild>
                  <Link href="/cv-matheuskopsguedes.pdf" target="_blank">
                    <Download className="mr-2 h-4 w-4" />
                    {`Télécharger mon CV`}
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div className="space-y-12" variants={containerVariants}>
          {/* Expériences Professionnelles */}
          <motion.section variants={itemVariants}>
            <motion.div
              className="flex items-center gap-3 mb-8"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <motion.div
                className="p-2 rounded-lg bg-primary/10"
                whileHover={{
                  scale: 1.1,
                  rotate: 5,
                  backgroundColor: "rgba(var(--primary), 0.2)",
                }}
                transition={{ duration: 0.2 }}
              >
                <Briefcase className="h-6 w-6 text-primary" />
              </motion.div>
              <h2 className="text-3xl font-bold">{`Expériences Professionnelles`}</h2>
            </motion.div>

            <motion.div className="space-y-6" variants={containerVariants}>
              {experiences.map((experience, index) => (
                <motion.div
                  key={experience.id}
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  whileHover="hover"
                  viewport={{ once: true, margin: "-50px" }}
                  custom={index}
                >
                  <Card className="relative overflow-hidden border-l-4 border-l-primary/30 hover:border-l-primary transition-colors duration-300">
                    <CardHeader>
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        <div className="flex-1">
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                          >
                            <CardTitle className="text-xl mb-2">
                              {experience.title}
                            </CardTitle>
                          </motion.div>
                          <motion.div
                            className="flex flex-col sm:flex-row sm:items-center gap-2 text-muted-foreground"
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{
                              duration: 0.4,
                              delay: index * 0.1 + 0.1,
                            }}
                          >
                            <div className="flex items-center gap-1">
                              <Briefcase className="h-4 w-4" />
                              {experience.companyUrl ? (
                                <Link
                                  href={experience.companyUrl}
                                  target="_blank"
                                  className="hover:text-primary flex items-center gap-1 transition-colors"
                                >
                                  {experience.company}
                                  <ExternalLink className="h-3 w-3" />
                                </Link>
                              ) : (
                                <span>{experience.company}</span>
                              )}
                            </div>
                            <span className="hidden sm:inline">•</span>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              <span>{experience.location}</span>
                            </div>
                          </motion.div>
                        </div>
                        <motion.div
                          className="flex flex-col items-end gap-2"
                          initial={{ opacity: 0, x: 20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{
                            duration: 0.4,
                            delay: index * 0.1 + 0.2,
                          }}
                        >
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {formatDate(experience.startDate)} -{" "}
                              {experience.isCurrently
                                ? "Présent"
                                : formatDate(experience.endDate!)}
                            </span>
                          </div>
                          {experience.isCurrently && (
                            <motion.div
                              variants={badgeVariants}
                              whileHover="hover"
                            >
                              <Badge variant="secondary">{`En cours`}</Badge>
                            </motion.div>
                          )}
                        </motion.div>
                      </div>
                    </CardHeader>

                    <CardContent>
                      <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                      >
                        <CardDescription className="text-base leading-relaxed mb-4">
                          {experience.description}
                        </CardDescription>
                      </motion.div>

                      {experience.skills && experience.skills.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{
                            duration: 0.5,
                            delay: index * 0.1 + 0.4,
                          }}
                        >
                          <h4 className="font-semibold mb-2">{`Compétences utilisées :`}</h4>
                          <div className="flex flex-wrap gap-2">
                            {experience.skills.map((skill, skillIndex) => (
                              <motion.div
                                key={skillIndex}
                                variants={badgeVariants}
                                initial="hidden"
                                whileInView="visible"
                                whileHover="hover"
                                viewport={{ once: true }}
                                transition={{ delay: skillIndex * 0.05 }}
                              >
                                <Badge variant="outline">{skill}</Badge>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </motion.section>

          {/* Formation */}
          <motion.section variants={itemVariants}>
            <motion.div
              className="flex items-center gap-3 mb-8"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <motion.div
                className="p-2 rounded-lg bg-primary/10"
                whileHover={{
                  scale: 1.1,
                  rotate: -5,
                  backgroundColor: "rgba(var(--primary), 0.2)",
                }}
                transition={{ duration: 0.2 }}
              >
                <GraduationCap className="h-6 w-6 text-primary" />
              </motion.div>
              <h2 className="text-3xl font-bold">{`Formation`}</h2>
            </motion.div>

            <motion.div className="space-y-6" variants={containerVariants}>
              {educations.map((education, index) => (
                <motion.div
                  key={education.id}
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  whileHover="hover"
                  viewport={{ once: true, margin: "-50px" }}
                  custom={index}
                >
                  <Card className="relative overflow-hidden border-l-4 border-l-green-500/30 hover:border-l-green-500 transition-colors duration-300">
                    <CardHeader>
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        <div className="flex-1">
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                          >
                            <CardTitle className="text-xl mb-2">
                              {education.title}
                            </CardTitle>
                          </motion.div>
                          <motion.div
                            className="flex flex-col sm:flex-row sm:items-center gap-2 text-muted-foreground"
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{
                              duration: 0.4,
                              delay: index * 0.1 + 0.1,
                            }}
                          >
                            <div className="flex items-center gap-1">
                              <GraduationCap className="h-4 w-4" />
                              <span>{education.institution}</span>
                            </div>
                            <span className="hidden sm:inline">•</span>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              <span>{education.location}</span>
                            </div>
                          </motion.div>
                        </div>
                        <motion.div
                          className="flex flex-col items-end gap-2"
                          initial={{ opacity: 0, x: 20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{
                            duration: 0.4,
                            delay: index * 0.1 + 0.2,
                          }}
                        >
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {formatDate(education.startDate)} -{" "}
                              {education.isCurrently
                                ? "Présent"
                                : formatDate(education.endDate!)}
                            </span>
                          </div>
                          {education.isCurrently && (
                            <motion.div
                              variants={badgeVariants}
                              whileHover="hover"
                            >
                              <Badge variant="secondary">{`En cours`}</Badge>
                            </motion.div>
                          )}
                          {education.grade && (
                            <motion.div
                              variants={badgeVariants}
                              whileHover="hover"
                            >
                              <Badge variant="default">{education.grade}</Badge>
                            </motion.div>
                          )}
                        </motion.div>
                      </div>
                    </CardHeader>

                    <CardContent>
                      <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                      >
                        <CardDescription className="text-base leading-relaxed mb-4">
                          {education.description}
                        </CardDescription>
                      </motion.div>

                      {education.skills && education.skills.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{
                            duration: 0.5,
                            delay: index * 0.1 + 0.4,
                          }}
                        >
                          <h4 className="font-semibold mb-2">{`Compétences acquises :`}</h4>
                          <div className="flex flex-wrap gap-2">
                            {education.skills.map((skill, skillIndex) => (
                              <motion.div
                                key={skillIndex}
                                variants={badgeVariants}
                                initial="hidden"
                                whileInView="visible"
                                whileHover="hover"
                                viewport={{ once: true }}
                                transition={{ delay: skillIndex * 0.05 }}
                              >
                                <Badge variant="outline">{skill}</Badge>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </motion.section>
        </motion.div>

        {/* CTA Final */}
        <motion.div
          className="text-center mt-16 bg-muted/30 rounded-lg p-8"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          whileHover={{ scale: 1.02 }}
        >
          <motion.h2
            className="text-2xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {`Intéressé par mon profil ?`}
          </motion.h2>
          <motion.p
            className="text-muted-foreground mb-6 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {`Je suis disponible pour une alternance à partir de septembre 2024. N'hésitez pas à me contacter pour discuter d'opportunités de collaboration !`}
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button asChild size="lg">
                <Link href="/contact?service=Proposition%20d%27alternance">
                  {`Proposer une alternance`}
                </Link>
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button asChild variant="outline" size="lg">
                <Link href="/projects">{`Voir mes projets`}</Link>
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
