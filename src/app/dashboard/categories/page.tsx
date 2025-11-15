"use client";

import { useState, useEffect } from "react";
import { DashboardNavSelect } from "@/components/dashboard/DashboardNavSelect";
import {
  listLessonCategories,
  deleteLessonCategory,
} from "@/server/lessonCategoryActions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import LessonCategoryForm from "@/components/forms/LessonCategoryForm";
import styles from "./scss/CategoriesPage.module.scss";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  lessonCategory as PrismaCategory,
  lessons as PrismaLesson,
} from "@prisma/client";

type CategoryWithLessons = PrismaCategory & { lessons: PrismaLesson[] };

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryWithLessons[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCategory, setEditingCategory] =
    useState<CategoryWithLessons | null>(null);

  // Carregar categorias
  const loadCategories = async () => {
    setLoading(true);
    try {
      const { success, data } = await listLessonCategories();
      if (success && data) {
        setCategories(data);
      } else {
        toast({
          title: "Erro",
          description: "Falha ao carregar categorias",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erro ao carregar categorias:", error);
      toast({
        title: "Erro",
        description: "Falha ao carregar categorias",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  // Manipular exclusão de categoria
  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta categoria?")) {
      return;
    }

    try {
      const result = await deleteLessonCategory(id);
      if (result.success) {
        toast({
          title: "Sucesso",
          description: "Categoria excluída com sucesso",
        });
        loadCategories(); // Recarregar lista
      } else {
        toast({
          title: "Erro",
          description: result.error || "Falha ao excluir categoria",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erro ao excluir categoria:", error);
      toast({
        title: "Erro",
        description: "Falha ao excluir categoria",
        variant: "destructive",
      });
    }
  };

  // Mapear nível para texto mais amigável
  const getLevelLabel = (level: string) => {
    const levels: Record<string, string> = {
      INICIANTE: "Iniciante",
      INTERMEDIARIO: "Intermediário",
      AVANCADO: "Avançado",
      IMORTAL: "Imortal",
    };
    return levels[level] || level;
  };

  // Rotas do dashboard para navegação

  const mapCategoryToFormValues = (category: CategoryWithLessons) => ({
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description ?? undefined,
    icon: category.icon ?? undefined,
    level: category.level,
  });

  return (
    <div className="mx-auto w-full max-w-7xl p-2 md:p-6">
      <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <DashboardNavSelect currentRoute="/dashboard/categories" />
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? "Cancelar" : "Adicionar Categoria"}
        </Button>
      </div>

      {showAddForm && (
        <Card className="mb-4">
          <LessonCategoryForm
            onSuccess={() => {
              setShowAddForm(false);
              loadCategories();
            }}
          />
        </Card>
      )}

      {editingCategory && (
        <Card className="mb-4">
          <LessonCategoryForm
            initialData={mapCategoryToFormValues(editingCategory)}
            onSuccess={() => {
              setEditingCategory(null);
              loadCategories();
            }}
          />
        </Card>
      )}

      <Card className="overflow-x-auto shadow-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[180px] text-lg">Nome</TableHead>
              <TableHead className="min-w-[140px] text-lg">Slug</TableHead>
              <TableHead className="min-w-[120px] text-lg">Nível</TableHead>
              <TableHead className="min-w-[100px] text-lg">Aulas</TableHead>
              <TableHead className="min-w-[120px] text-lg">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="py-8 text-center text-muted-foreground"
                >
                  Carregando...
                </TableCell>
              </TableRow>
            ) : categories.length > 0 ? (
              categories.map((category) => (
                <TableRow key={category.id} className="hover:bg-muted/40">
                  <TableCell className="flex items-center gap-2 font-semibold">
                    {category.icon && (
                      <span className="mr-2 text-xl">{category.icon}</span>
                    )}
                    <span>{category.name}</span>
                  </TableCell>
                  <TableCell>{category.slug}</TableCell>
                  <TableCell>
                    <span
                      className={`rounded bg-muted/30 px-2 py-1 text-xs font-bold text-muted-foreground`}
                    >
                      {getLevelLabel(category.level)}
                    </span>
                  </TableCell>
                  <TableCell>{category.lessons?.length || 0}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingCategory(category)}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteCategory(category.id)}
                        disabled={category.lessons?.length > 0}
                        title={
                          category.lessons?.length > 0
                            ? "Categoria possui aulas vinculadas"
                            : ""
                        }
                      >
                        Excluir
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="py-8 text-center text-muted-foreground"
                >
                  Nenhuma categoria encontrada
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
