"use client";

import { useState, useEffect } from "react";
import { listLessons, deleteLesson } from "@/server/lessonsActions";
import { listLessonCategories } from "@/server/lessonCategoryActions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import LessonForm from "@/components/forms/LessonForm";
import styles from "./LessonsPage.module.scss";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function LessonsPage() {
  const [lessons, setLessons] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingLesson, setEditingLesson] = useState<any>(null);
  
  // Carregar dados
  const loadData = async () => {
    setLoading(true);
    try {
      const lessonsRes = await listLessons();
      const categoriesRes = await listLessonCategories();
      
      if (lessonsRes.success && categoriesRes.success) {
        setLessons(lessonsRes.data || []);
        setCategories(categoriesRes.data || []);
      } else {
        toast({
          title: "Erro",
          description: "Falha ao carregar dados",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      toast({
        title: "Erro",
        description: "Falha ao carregar dados",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Manipular exclusão de aula
  const handleDeleteLesson = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta aula?")) {
      return;
    }
    
    try {
      const result = await deleteLesson(id);
      if (result.success) {
        toast({
          title: "Sucesso",
          description: "Aula excluída com sucesso",
        });
        loadData(); // Recarregar lista
      } else {
        toast({
          title: "Erro",
          description: result.error || "Falha ao excluir aula",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erro ao excluir aula:", error);
      toast({
        title: "Erro",
        description: "Falha ao excluir aula",
        variant: "destructive",
      });
    }
  };

  // Formatação de data
  const formatDate = (date: string | Date) => {
    if (!date) return "N/A";
    return format(new Date(date), "dd/MM/yyyy HH:mm", { locale: ptBR });
  };

  // Formatar duração
  const formatDuration = (seconds: number) => {
    if (!seconds) return "N/A";
    const minutes = Math.floor(seconds / 60);
    return `${minutes} min`;
  };

  // Obter nome da categoria
  const getCategoryName = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    return category ? category.name : "N/A";
  };

  return (
    <div className={styles.lessonsContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>Aulas</h1>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? "Cancelar" : "Adicionar Aula"}
        </Button>
      </div>
      
      {showAddForm && (
        <Card className={styles.formCard}>
          <LessonForm 
            onSuccess={() => {
              setShowAddForm(false);
              loadData();
            }} 
          />
        </Card>
      )}
      
      {editingLesson && (
        <Card className={styles.formCard}>
          <LessonForm 
            initialData={editingLesson}
            onSuccess={() => {
              setEditingLesson(null);
              loadData();
            }} 
          />
        </Card>
      )}
      
      <Card className={styles.tableCard}>
        <div className={styles.tableContainer}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Duração</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Criado em</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className={styles.loadingCell}>
                    Carregando...
                  </TableCell>
                </TableRow>
              ) : lessons.length > 0 ? (
                lessons.map((lesson) => (
                  <TableRow key={lesson.id}>
                    <TableCell>
                      <div className={styles.lessonTitle}>
                        {lesson.thumbnailUrl && (
                          <img 
                            src={lesson.thumbnailUrl} 
                            alt={lesson.title} 
                            className={styles.thumbnailPreview} 
                          />
                        )}
                        <div>
                          {lesson.title}
                          {lesson.isLocked && (
                            <span className={styles.lockedBadge}>Bloqueada</span>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getCategoryName(lesson.categoryId)}</TableCell>
                    <TableCell>{formatDuration(lesson.duration)}</TableCell>
                    <TableCell>
                      <span className={`${styles.status} ${lesson.isLive ? styles.statusLive : ''}`}>
                        {lesson.isLive ? "Ao vivo" : "Gravada"}
                      </span>
                    </TableCell>
                    <TableCell>{formatDate(lesson.createdAt)}</TableCell>
                    <TableCell>
                      <div className={styles.actions}>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setEditingLesson(lesson)}
                        >
                          Editar
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleDeleteLesson(lesson.id)}
                        >
                          Excluir
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className={styles.emptyCell}>
                    Nenhuma aula encontrada
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
