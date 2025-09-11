"use client";

import { useState, useEffect } from "react";
import { DashboardNavSelect } from "@/components/dashboard/DashboardNavSelect";
import { listLessonCategories, deleteLessonCategory } from "@/server/lessonCategoryActions";
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

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  
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
      "INICIANTE": "Iniciante",
      "INTERMEDIARIO": "Intermediário",
      "AVANCADO": "Avançado",
      "IMORTAL": "Imortal",
    };
    return levels[level] || level;
  };

  // Rotas do dashboard para navegação

  return (
    <div className="w-full max-w-7xl mx-auto p-2 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4">
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
            initialData={editingCategory}
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
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Carregando...</TableCell>
              </TableRow>
            ) : categories.length > 0 ? (
              categories.map((category) => (
                <TableRow key={category.id} className="hover:bg-muted/40">
                  <TableCell className="font-semibold flex items-center gap-2">
                    {category.icon && (
                      <span className="mr-2 text-xl">{category.icon}</span>
                    )}
                    <span>{category.name}</span>
                  </TableCell>
                  <TableCell>{category.slug}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs font-bold bg-muted/30 text-muted-foreground`}>
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
                        title={category.lessons?.length > 0 ? "Categoria possui aulas vinculadas" : ""}
                      >
                        Excluir
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Nenhuma categoria encontrada</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
