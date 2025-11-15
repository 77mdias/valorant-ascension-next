"use client";

import { useState, useEffect } from "react";
import { DashboardNavSelect } from "@/components/dashboard/DashboardNavSelect";
import { listLessons, deleteLesson } from "@/server/lessonsActions";
import { listLessonCategories } from "@/server/lessonCategoryActions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import LessonForm from "@/components/forms/LessonForm";
import styles from "./scss/LessonsPage.module.scss";
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
import { lessons as PrismaLesson, lessonCategory as PrismaCategory } from "@prisma/client";

export default function LessonsPage() {
  const [lessons, setLessons] = useState<PrismaLesson[]>([]);
  const [categories, setCategories] = useState<PrismaCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingLesson, setEditingLesson] = useState<PrismaLesson | null>(null);
  
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
  const formatDuration = (seconds?: number | null) => {
    if (!seconds) return "N/A";
    const minutes = Math.floor(seconds / 60);
    return `${minutes} min`;
  };

  // Obter nome da categoria
  const getCategoryName = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    return category ? category.name : "N/A";
  };

  // Rotas do dashboard para navegação

  const mapLessonToFormValues = (lesson: PrismaLesson) => ({
    id: lesson.id,
    title: lesson.title,
    description: lesson.description ?? undefined,
    videoUrl: lesson.videoUrl ?? undefined,
    thumbnailUrl: lesson.thumbnailUrl ?? undefined,
    duration: lesson.duration ?? undefined,
    categoryId: lesson.categoryId,
    createdById: lesson.createdById,
    isLive: lesson.isLive,
    isCompleted: lesson.isCompleted,
    isLocked: lesson.isLocked,
    number: lesson.number ?? undefined,
  });

  return (
    <div className="w-full max-w-7xl mx-auto p-2 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4">
        <DashboardNavSelect currentRoute="/dashboard/lessons" />
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? "Cancelar" : "Adicionar Aula"}
        </Button>
      </div>

      {showAddForm && (
        <Card className="mb-4">
          <LessonForm 
            onSuccess={() => {
              setShowAddForm(false);
              loadData();
            }} 
          />
        </Card>
      )}

      {editingLesson && (
        <Card className="mb-4">
          <LessonForm 
            initialData={mapLessonToFormValues(editingLesson)}
            onSuccess={() => {
              setEditingLesson(null);
              loadData();
            }} 
          />
        </Card>
      )}

      <Card className="overflow-x-auto shadow-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[180px] text-lg">Título</TableHead>
              <TableHead className="min-w-[140px] text-lg">Categoria</TableHead>
              <TableHead className="min-w-[100px] text-lg">Duração</TableHead>
              <TableHead className="min-w-[100px] text-lg">Status</TableHead>
              <TableHead className="min-w-[160px] text-lg">Criado em</TableHead>
              <TableHead className="min-w-[120px] text-lg">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Carregando...</TableCell>
              </TableRow>
            ) : lessons.length > 0 ? (
              lessons.map((lesson) => (
                <TableRow key={lesson.id} className="hover:bg-muted/40">
                  <TableCell className="font-semibold flex items-center gap-2">
                    {/* SEÇÃO COMENTADA PARA EVITAR ERRO DE RENDERIZAÇÃO e também não faz muito sentido carregar imagem aqui.}
                    {lesson.thumbnailUrl && (
                      <img 
                        src={lesson.thumbnailUrl} 
                        alt={lesson.title} 
                        className="w-10 h-10 rounded object-cover border border-border mr-2" 
                      />
                    )} */}
                    <span>{lesson.title}</span>
                    {lesson.isLocked && (
                      <span className="ml-2 px-2 py-1 rounded bg-destructive/20 text-destructive text-xs font-bold">Bloqueada</span>
                    )}
                  </TableCell>
                  <TableCell>{getCategoryName(lesson.categoryId)}</TableCell>
                  <TableCell>{formatDuration(lesson.duration)}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs font-bold ${lesson.isLive ? "bg-green-500/20 text-green-600" : "bg-muted/30 text-muted-foreground"}`}>
                      {lesson.isLive ? "Ao vivo" : "Gravada"}
                    </span>
                  </TableCell>
                  <TableCell>{formatDate(lesson.createdAt)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
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
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Nenhuma aula encontrada</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
