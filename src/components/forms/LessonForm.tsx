"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LessonInput, LessonSchema } from "@/schemas/lesson";
import { createLesson, updateLesson } from "@/server/lessonsActions";
import { listLessonCategories } from "@/server/lessonCategoryActions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

interface LessonFormProps {
  initialData?: Partial<LessonInput> & { id?: string };
  defaultCategoryId?: string;
  onSuccess?: () => void;
}

export default function LessonForm({ initialData, defaultCategoryId, onSuccess }: LessonFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const isEdit = !!initialData?.id;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LessonInput>({
    resolver: zodResolver(LessonSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      content: initialData?.content || "",
      videoUrl: initialData?.videoUrl || "",
      thumbnailUrl: initialData?.thumbnailUrl || "",
      duration: initialData?.duration || 0,
      categoryId: initialData?.categoryId || defaultCategoryId || "",
    },
  });

  const watchedCategoryId = watch("categoryId");

  // Carregar categorias
  useEffect(() => {
    async function loadCategories() {
      const result = await listLessonCategories({ isActive: true });
      if (result.success) {
        setCategories(result.data);
      }
    }
    loadCategories();
  }, []);

  async function onSubmit(data: LessonInput) {
    setIsLoading(true);
    
    try {
      let result;
      
      if (isEdit) {
        result = await updateLesson({ id: initialData!.id, ...data });
      } else {
        result = await createLesson(data);
      }

      if (result.success) {
        toast.success(isEdit ? "Aula atualizada com sucesso!" : "Aula criada com sucesso!");
        onSuccess?.();
      } else {
        toast.error("Erro ao processar solicitação");
      }
    } catch (error) {
      toast.error("Erro inesperado ao processar solicitação");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="title">Título *</Label>
          <Input
            id="title"
            {...register("title")}
            placeholder="Título da aula"
            disabled={isLoading}
          />
          {errors.title && (
            <p className="text-sm text-red-500">{errors.title.message}</p>
          )}
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="description">Descrição *</Label>
          <Textarea
            id="description"
            {...register("description")}
            placeholder="Descrição da aula..."
            disabled={isLoading}
            rows={3}
          />
          {errors.description && (
            <p className="text-sm text-red-500">{errors.description.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="categoryId">Categoria *</Label>
          <Select
            value={watchedCategoryId}
            onValueChange={(value) => setValue("categoryId", value)}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma categoria" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.categoryId && (
            <p className="text-sm text-red-500">{errors.categoryId.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="videoUrl">URL do Vídeo</Label>
          <Input
            id="videoUrl"
            {...register("videoUrl")}
            placeholder="https://exemplo.com/video.mp4"
            disabled={isLoading}
          />
          {errors.videoUrl && (
            <p className="text-sm text-red-500">{errors.videoUrl.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="thumbnailUrl">URL da Thumbnail</Label>
          <Input
            id="thumbnailUrl"
            {...register("thumbnailUrl")}
            placeholder="https://exemplo.com/thumb.jpg"
            disabled={isLoading}
          />
          {errors.thumbnailUrl && (
            <p className="text-sm text-red-500">{errors.thumbnailUrl.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="duration">Duração (segundos)</Label>
          <Input
            id="duration"
            type="number"
            {...register("duration", { valueAsNumber: true })}
            placeholder="0"
            disabled={isLoading}
            min="0"
          />
          {errors.duration && (
            <p className="text-sm text-red-500">{errors.duration.message}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button
          type="submit"
          disabled={isLoading}
          className="min-w-[120px]"
        >
          {isLoading ? "Salvando..." : (isEdit ? "Atualizar" : "Criar")}
        </Button>
      </div>
    </form>
  );
}