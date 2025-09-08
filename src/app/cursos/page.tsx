"use server";

import { db } from "@/lib/prisma";
import styles from "@/scss/components/CourseCard.module.scss";
import Header from "@/components/Header";
import CourseCard from "@/components/CourseCard";

// import TestimonialCarousel from "@/components/TestimonialCarousel";
import { Button } from "@/components/ui/button";
import {
  Target,
  Brain,
  Zap,
  Users,
  Sparkles,
  Trophy,
  Gamepad2,
  Shield,
} from "lucide-react";
import heroBg from "../../../public/hero-bg.jpg";
import Image from "next/image";
import StatsSection from "@/components/StatsSection";
import TestimonialCarousel from "@/components/TestimonialCarousel";
import CoursePageLoading from "@/components/CoursePageLoading";
import ProjectInfoCompact from "@/components/ProjectInfoCompact";

const Courses = async () => {
  const lessons = await db.lessonCategory.findMany({
    include: {
      lessons: true,
    },
  });
  console.log(lessons);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden pb-20 pt-24">
        <div className="absolute inset-0">
          <Image
            src={heroBg}
            alt="Hero Background"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/60 to-background/90"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent"></div>
        </div>
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent"></div>
        <div className="absolute left-10 top-20 h-72 w-72 rounded-full bg-primary/20 blur-3xl"></div>
        <div className="absolute bottom-10 right-10 h-96 w-96 rounded-full bg-secondary/20 blur-3xl"></div>

        <div className="container relative mx-auto px-4">
          <div className="animate-slide-up mx-auto max-w-4xl space-y-6 text-center">
            <h1 className="text-4xl font-bold leading-tight md:text-6xl">
              Escolha Seu Curso e{" "}
              <span
                className={`${styles.bgGradientPrimary} bg-clip-text text-transparent`}
              >
                Evolua no Valorant
              </span>
            </h1>

            <p className="mx-auto max-w-2xl text-lg text-muted-foreground md:text-xl">
              Treinos práticos, aulas ao vivo e conteúdo exclusivo para todos os
              níveis — do básico ao imortal.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row text-lg">
              <Button
                size="lg"
                className={`${styles.bgGradientPrimary} ${styles.buttonPrimary} px-8 text-primary-foreground transition-all duration-300`}
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Ser um Aluno
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary/30 px-8 transition-all duration-300 hover:border-primary hover:bg-primary/10"
              >
                Ver Cursos
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Course Catalog */}
      <section id="courses" className="relative py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Nossos{" "}
              <span
                className={`${styles.bgGradientPrimary} bg-clip-text text-transparent`}
              >
                Cursos
              </span>
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Treinamento especializado para cada aspecto do jogo
            </p>
          </div>

          {/* Category Lesson Cards */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {lessons.map((lesson) => (
              <CourseCard
                key={lesson.id}
                title={lesson.name}
                description={lesson.description}
                level={lesson.level}
                icon={lesson.icon || "target"}
                categorySlug={lesson.slug}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Academy Highlights */}
      <StatsSection />

      {/* Testimonials */}
      <TestimonialCarousel />

      {/* Final CTA */}
      <section className="relative overflow-hidden py-20">
        <div className="bg-gradient-accent absolute inset-0 opacity-10"></div>
        <div className="container relative mx-auto px-4">
          <div className="to-accent-orange/20 mx-auto max-w-3xl space-y-8 rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/20 via-secondary/20 p-12 text-center">
            <Trophy className={`${styles.accentOrange} mx-auto h-16 w-16`} />
            <h2 className="text-3xl font-bold md:text-5xl">
              Pronto para{" "}
              <span
                className={`${styles.bgGradientAccent} bg-clip-text text-transparent`}
              >
                Dominar o Valorant?
              </span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Junte-se a mais de 500 alunos que já estão evoluindo com a NeXT
              Academy
            </p>
            <Button
              size="lg"
              className={`${styles.bgGradientAccent} ${styles.buttonAccent} px-12 py-6 text-lg text-primary-foreground`}
            >
              Começar Agora
            </Button>
          </div>
        </div>
      </section>

      {/* Project Info */}
      <ProjectInfoCompact />
    </div>
  );
};

export default Courses;
