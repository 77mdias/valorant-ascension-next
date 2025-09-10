"use client";

import { useState, useEffect } from "react";
import { listLessonCategories, deleteLessonCategory } from "@/server/lessonCategoryActions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import LessonCategoryForm from "@/components/forms/LessonCategoryForm";
import styles from "./CategoriesPage.module.scss";
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

  return (
    <div className={styles.categoriesContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>Categorias de Aulas</h1>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? "Cancelar" : "Adicionar Categoria"}
        </Button>
      </div>
      
      {showAddForm && (
        <Card className={styles.formCard}>
          <LessonCategoryForm 
            onSuccess={() => {
              setShowAddForm(false);
              loadCategories();
            }} 
          />
        </Card>
      )}
      
      {editingCategory && (
        <Card className={styles.formCard}>
          <LessonCategoryForm 
            initialData={editingCategory}
            onSuccess={() => {
              setEditingCategory(null);
              loadCategories();
            }} 
          />
        </Card>
      )}
      
      <Card className={styles.tableCard}>
        <div className={styles.tableContainer}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Nível</TableHead>
                <TableHead>Aulas</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className={styles.loadingCell}>
                    Carregando...
                  </TableCell>
                </TableRow>
              ) : categories.length > 0 ? (
                categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>
                      <div className={styles.categoryName}>
                        {category.icon && (
                          <span className={styles.categoryIcon}>{category.icon}</span>
                        )}
                        {category.name}
                      </div>
                    </TableCell>
                    <TableCell>{category.slug}</TableCell>
                    <TableCell>
                      <span className={`${styles.level} ${styles[`level${category.level}`]}`}>
                        {getLevelLabel(category.level)}
                      </span>
                    </TableCell>
                    <TableCell>{category.lessons?.length || 0}</TableCell>
                    <TableCell>
                      <div className={styles.actions}>
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
                  <TableCell colSpan={5} className={styles.emptyCell}>
                    Nenhuma categoria encontrada
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
