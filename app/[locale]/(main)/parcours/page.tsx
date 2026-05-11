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
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  getEducations,
  getExperiences,
  type Locale,
} from "@/lib/data";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

const cardVariants = {
  hidden: { opacity: 0, x: -30, scale: 0.95 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
  hover: {
    scale: 1.02,
    y: -5,
    transition: { duration: 0.2, ease: "easeInOut" as const },
  },
};

const badgeVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, ease: "easeOut" as const },
  },
  hover: { scale: 1.1, transition: { duration: 0.2 } },
};

export default function ParcoursPage() {
  const locale = useLocale() as Locale;
  const t = useTranslations("Parcours");
  const educations = getEducations(locale);
  const experiences = getExperiences(locale);

  const formatDate = (date: string) => {
    const d = new Date(date);
    if (isNaN(d.getTime())) return "";
    return new Intl.DateTimeFormat(locale === "fr" ? "fr-FR" : "en-US", {
      month: "long",
      year: "numeric",
    }).format(d);
  };

  return (
    <motion.div
      className="min-h-screen py-16 px-4"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="container mx-auto max-w-4xl">
        <motion.div className="text-center mb-16" variants={itemVariants}>
          <motion.h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl mb-4">
            {t("title")}
          </motion.h1>
          <motion.p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            {t("subtitle")}
          </motion.p>

          <motion.div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild>
              <Link href="/contact">{t("skills")}</Link>
            </Button>
            <Button variant="outline" asChild>
              <a href="/cv-matheuskopsguedes.pdf" target="_blank" rel="noopener noreferrer">
                <Download className="mr-2 h-4 w-4" />
                CV
              </a>
            </Button>
          </motion.div>
        </motion.div>

        <motion.div className="space-y-12" variants={containerVariants}>
          <motion.section variants={itemVariants}>
            <motion.div className="flex items-center gap-3 mb-8">
              <div className="p-2 rounded-lg bg-primary/10">
                <Briefcase className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-3xl font-bold">{t("experiences")}</h2>
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
                          <CardTitle className="text-xl mb-2">
                            {experience.title}
                          </CardTitle>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Briefcase className="h-4 w-4" />
                              {experience.companyUrl ? (
                                <a
                                  href={experience.companyUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="hover:text-primary flex items-center gap-1 transition-colors"
                                >
                                  {experience.company}
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              ) : (
                                <span>{experience.company}</span>
                              )}
                            </div>
                            <span className="hidden sm:inline">•</span>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              <span>{experience.location}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {formatDate(experience.startDate)} {t("to")}{" "}
                              {experience.isCurrently
                                ? t("current")
                                : experience.endDate
                                  ? formatDate(experience.endDate)
                                  : ""}
                            </span>
                          </div>
                          {experience.isCurrently && (
                            <Badge variant="secondary">{t("current")}</Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent>
                      <CardDescription className="text-base leading-relaxed mb-4 whitespace-pre-line">
                        {experience.description}
                      </CardDescription>

                      {experience.skills.length > 0 && (
                        <div>
                          <h4 className="font-semibold mb-2">
                            {t("skills")} :
                          </h4>
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
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </motion.section>

          <motion.section variants={itemVariants}>
            <motion.div className="flex items-center gap-3 mb-8">
              <div className="p-2 rounded-lg bg-primary/10">
                <GraduationCap className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-3xl font-bold">{t("educations")}</h2>
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
                          <CardTitle className="text-xl mb-2">
                            {education.title}
                          </CardTitle>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <GraduationCap className="h-4 w-4" />
                              <span>{education.institution}</span>
                            </div>
                            <span className="hidden sm:inline">•</span>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              <span>{education.location}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {formatDate(education.startDate)} {t("to")}{" "}
                              {education.isCurrently
                                ? t("current")
                                : education.endDate
                                  ? formatDate(education.endDate)
                                  : ""}
                            </span>
                          </div>
                          {education.isCurrently && (
                            <Badge variant="secondary">{t("current")}</Badge>
                          )}
                          {education.grade && (
                            <Badge variant="default">{education.grade}</Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent>
                      <CardDescription className="text-base leading-relaxed mb-4 whitespace-pre-line">
                        {education.description}
                      </CardDescription>

                      {education.skills.length > 0 && (
                        <div>
                          <h4 className="font-semibold mb-2">
                            {t("skills")} :
                          </h4>
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
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </motion.section>
        </motion.div>
      </div>
    </motion.div>
  );
}
