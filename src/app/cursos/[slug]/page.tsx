"use client";

// src/app/cursos/[slug]/page.tsx
import { ChevronDown, Trophy } from "lucide-react";
import { Target } from "lucide-react";
import { Users } from "lucide-react";
import { notFound } from "next/navigation";
import LessonCard from "@/components/LessonCard";
import { LessonCategory, lessons } from "@prisma/client";
import { useState, useEffect } from "react";
import styles from "./page.module.scss";
import VideoPlayer from "@/components/VideoPlayer";
import CourseDetailLoading from "@/components/CourseDetailLoading";

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const [category, setCategory] = useState<any>(null);
  const [activeLesson, setActiveLesson] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategory() {
      try {
        const { slug } = await params;
        const decodedSlug = decodeURIComponent(slug);

        const response = await fetch(`/api/categories/${decodedSlug}`);
        if (!response.ok) {
          notFound();
        }

        const categoryData = await response.json();
        setCategory(categoryData);

        // Definir a primeira aula como ativa por padrão
        if (categoryData.lessons.length > 0) {
          setActiveLesson(categoryData.lessons[0].id);
        }
      } catch (error) {
        console.error("Erro ao carregar categoria:", error);
        notFound();
      } finally {
        setLoading(false);
      }
    }

    fetchCategory();
  }, [params]);

  if (loading) {
    return <CourseDetailLoading />;
  }

  if (!category) {
    notFound();
  }

  const currentLesson = category.lessons.find(
    (lesson: { id: string }) => lesson.id === activeLesson,
  );

  const handlePreviousLesson = () => {
    const currentIndex = category.lessons.findIndex(
      (lesson: { id: string }) => lesson.id === activeLesson,
    );
    if (currentIndex > 0) {
      setActiveLesson(category.lessons[currentIndex - 1].id);
    }
  };

  const handleNextLesson = () => {
    const currentIndex = category.lessons.findIndex(
      (lesson: { id: string }) => lesson.id === activeLesson,
    );
    if (currentIndex < category.lessons.length - 1) {
      setActiveLesson(category.lessons[currentIndex + 1].id);
    }
  };

  if (!currentLesson) {
    return <div>Aula não encontrada</div>;
  }

  return (
    <>
      {/* Hero Section */}
      <div className="relative overflow-hidden pb-8 pt-20">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
        <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-secondary/20 blur-3xl" />

        <div className="container relative mx-auto px-4">
          <div className="max-w-4xl">
            <h1 className="mb-4 text-4xl font-bold md:text-5xl">
              <span className="animate-gradient bg-300% bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                {category.name}
              </span>
            </h1>
            <p className="mb-6 text-xl text-muted-foreground">
              {category.description}
            </p>

            {/* Course Stats */}
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-primary" />
                <span className="text-sm">Nível Radiante</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-secondary" />
                <span className="text-sm">10 Aulas</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <span className="text-sm">2.5k Alunos</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto mt-8 px-4 pb-12">
        <div className="grid gap-8 lg:grid-cols-[400px,1fr]">
          {/* Lessons Sidebar - Desktop */}
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <div className={`${styles.containerAside} rounded-2xl`}>
                <div className="rounded-2xl bg-[#160e1b] p-6">
                  <h2 className="mb-4 text-lg font-bold text-foreground">
                    Conteúdo do Curso
                  </h2>
                  <div className="max-h-[calc(100vh-250px)] space-y-3 overflow-y-auto px-4 py-2">
                    {category.lessons.map(
                      (lesson: {
                        id: string;
                        number: number | null;
                        title: string;
                        duration: number | null;
                        isLocked: boolean;
                      }) => (
                        <LessonCard
                          key={lesson.id}
                          number={lesson.number ?? 0}
                          title={lesson.title}
                          duration={lesson.duration ?? 0}
                          isCompleted={false}
                          isActive={lesson.id === activeLesson}
                          isLocked={lesson.isLocked}
                          onClick={() =>
                            !lesson.isLocked && setActiveLesson(lesson.id)
                          }
                        />
                      ),
                    )}
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Mobile Lessons Menu */}
          <div className="mb-6 lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`${styles.gamingButton} flex w-full items-center justify-between rounded-xl p-4`}
            >
              <span className="font-semibold">
                Aula {currentLesson?.number}: {currentLesson?.title}
              </span>
              <ChevronDown
                className={`h-5 w-5 transition-transform ${isMobileMenuOpen ? "rotate-180" : ""}`}
              />
            </button>

            {isMobileMenuOpen && (
              <div
                className={`${styles.containerAside} mt-4 space-y-3 rounded-xl`}
              >
                <div className="rounded-2xl bg-[#160e1b] p-4">
                  {category.lessons.map(
                    (lesson: {
                      id: string;
                      number: number | null;
                      title: string;
                      duration: number | null;
                      isLocked: boolean;
                      isCompleted: boolean;
                    }) => (
                      <LessonCard
                        key={lesson.id}
                        number={lesson.number ?? 0}
                        title={lesson.title}
                        duration={lesson.duration ?? 0}
                        isCompleted={lesson.isCompleted}
                        isActive={lesson.id === activeLesson}
                        isLocked={lesson.isLocked}
                        onClick={() => {
                          if (!lesson.isLocked) {
                            setActiveLesson(lesson.id);
                            setIsMobileMenuOpen(false);
                          }
                        }}
                      />
                    ),
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Video Player Section */}
          <main>
            <VideoPlayer
              title={currentLesson.title}
              description="Nesta aula, você aprenderá técnicas avançadas utilizadas pelos melhores jogadores de Valorant. Vamos cobrir conceitos fundamentais de posicionamento, timing e tomada de decisão que farão a diferença no seu gameplay. Prepare-se para elevar seu jogo ao próximo nível!"
              onPrevious={handlePreviousLesson}
              onNext={handleNextLesson}
              hasPrevious={!!activeLesson && Number(activeLesson) > 1}
              hasNext={
                !!activeLesson &&
                Number(activeLesson) < category.lessons.length &&
                !category.lessons[Number(activeLesson)]?.isLocked
              }
              videoUrl={currentLesson?.videoUrl}
              thumbnailUrl={currentLesson?.thumbnailUrl}
            />
          </main>
        </div>
      </div>
    </>
  );
}
