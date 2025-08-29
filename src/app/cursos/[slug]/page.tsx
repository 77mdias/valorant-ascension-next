"use server";

// src/app/cursos/[categoryName]/page.tsx
import { db } from "@/lib/prisma";
import { notFound } from "next/navigation";

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  // Decodificar o nome da categoria da URL
  const { slug } = await params;

  const decodedSlug = decodeURIComponent(slug);

  // Buscar categoria pelo nome
  const category = await db.lessonCategory.findFirst({
    where: { slug: decodedSlug },
    include: {
      lessons: {
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!category) {
    notFound();
  }

  return (
    <div>
      <h1>{category.name}</h1>
      <div className="grid gap-4">
        {category.lessons.map((lesson) => (
          <div key={lesson.id}>
            <h2>{lesson.title}</h2>
            <p>{lesson.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
