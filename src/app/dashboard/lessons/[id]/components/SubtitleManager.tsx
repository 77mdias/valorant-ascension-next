"use client";

import { type FormEvent, useEffect, useMemo, useState } from "react";
import type { VideoSubtitle } from "@prisma/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  createVideoSubtitle,
  deleteVideoSubtitle,
  updateVideoSubtitle,
} from "@/server/videoSubtitleActions";

interface SubtitleManagerProps {
  lessonId: string;
  initialSubtitles: VideoSubtitle[];
}

const sortSubtitles = (items: VideoSubtitle[]) =>
  [...items].sort((first, second) => {
    if (first.isDefault && !second.isDefault) return -1;
    if (!first.isDefault && second.isDefault) return 1;
    return first.label.localeCompare(second.label);
  });

const ACCEPTED_TYPES = ["text/vtt", "text/plain"];
const MAX_SIZE_BYTES = 2 * 1024 * 1024; // 2MB

const getLanguagePlaceholder = () => "pt-BR, en";

const isValidSubtitleFile = (file: File) => {
  const extension = file.name.toLowerCase().endsWith(".vtt");
  return extension || ACCEPTED_TYPES.includes(file.type);
};

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
};

const SubtitleManager = ({
  lessonId,
  initialSubtitles,
}: SubtitleManagerProps) => {
  const [subtitles, setSubtitles] = useState(() =>
    sortSubtitles(initialSubtitles),
  );
  const [formValues, setFormValues] = useState({
    label: "",
    language: "",
    isDefault: false,
    file: null as File | null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValues, setEditingValues] = useState({
    label: "",
    language: "",
    isDefault: false,
    file: null as File | null,
  });
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    setSubtitles(sortSubtitles(initialSubtitles));
  }, [initialSubtitles]);

  const sortedList = useMemo(() => sortSubtitles(subtitles), [subtitles]);

  const resetEditingState = () => {
    setEditingId(null);
    setEditingValues({ label: "", language: "", isDefault: false, file: null });
  };

  const validateFileOrThrow = (file: File | null) => {
    if (!file) {
      throw new Error("Envie um arquivo .vtt válido.");
    }

    if (!isValidSubtitleFile(file)) {
      throw new Error("Apenas arquivos .vtt são permitidos.");
    }

    if (file.size > MAX_SIZE_BYTES) {
      throw new Error(`Arquivo excede ${formatFileSize(MAX_SIZE_BYTES)}.`);
    }
  };

  const uploadSubtitle = async (file: File) => {
    validateFileOrThrow(file);
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/uploads/subtitle", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();
    if (!response.ok || !result?.url) {
      throw new Error(result?.error || "Falha ao enviar legenda.");
    }

    return result.url as string;
  };

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    const trimmedLabel = formValues.label.trim();
    const trimmedLanguage = formValues.language.trim();

    if (!trimmedLabel || !trimmedLanguage) {
      toast.error("Preencha idioma e rótulo da legenda.");
      return;
    }

    try {
      setIsSubmitting(true);
      validateFileOrThrow(formValues.file);
      const fileUrl = await uploadSubtitle(formValues.file!);

      const result = await createVideoSubtitle({
        lessonId,
        label: trimmedLabel,
        language: trimmedLanguage,
        fileUrl,
        isDefault: formValues.isDefault,
      });

      if (!result.success || !result.data) {
        throw new Error(result.error || "Não foi possível criar legenda.");
      }

      setSubtitles((previous) => sortSubtitles([...previous, result.data]));
      setFormValues({ label: "", language: "", isDefault: false, file: null });
      toast.success("Legenda adicionada com sucesso!");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Erro ao criar legenda.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartEdit = (subtitle: VideoSubtitle) => {
    setEditingId(subtitle.id);
    setEditingValues({
      label: subtitle.label,
      language: subtitle.language,
      isDefault: subtitle.isDefault,
      file: null,
    });
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;
    const trimmedLabel = editingValues.label.trim();
    const trimmedLanguage = editingValues.language.trim();

    if (!trimmedLabel || !trimmedLanguage) {
      toast.error("Preencha idioma e rótulo da legenda.");
      return;
    }

    try {
      setIsSavingEdit(true);
      const fileUrl = editingValues.file
        ? await uploadSubtitle(editingValues.file)
        : subtitles.find((item) => item.id === editingId)?.fileUrl;

      if (!fileUrl) {
        throw new Error("Arquivo de legenda é obrigatório.");
      }

      const result = await updateVideoSubtitle({
        id: editingId,
        lessonId,
        label: trimmedLabel,
        language: trimmedLanguage,
        fileUrl,
        isDefault: editingValues.isDefault,
      });

      if (!result.success || !result.data) {
        throw new Error(result.error || "Não foi possível atualizar legenda.");
      }

      setSubtitles((previous) =>
        sortSubtitles(
          previous.map((item) =>
            item.id === editingId
              ? {
                  ...item,
                  label: trimmedLabel,
                  language: trimmedLanguage,
                  fileUrl,
                  isDefault: editingValues.isDefault,
                }
              : item,
          ),
        ),
      );

      toast.success("Legenda atualizada!");
      resetEditingState();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Erro ao atualizar legenda.",
      );
    } finally {
      setIsSavingEdit(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja remover esta legenda?")) {
      return;
    }
    try {
      setDeletingId(id);
      const result = await deleteVideoSubtitle(id);
      if (!result.success) {
        throw new Error(result.error || "Não foi possível remover.");
      }
      setSubtitles((previous) => previous.filter((item) => item.id !== id));
      if (editingId === id) {
        resetEditingState();
      }
      toast.success("Legenda removida.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Erro ao remover legenda.",
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-white/10 bg-card/80 p-6">
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-[1fr,160px,200px]">
            <div className="space-y-2">
              <Label htmlFor="subtitle-label">Descrição</Label>
              <Input
                id="subtitle-label"
                value={formValues.label}
                onChange={(event) =>
                  setFormValues((state) => ({
                    ...state,
                    label: event.target.value,
                  }))
                }
                placeholder="Ex.: Português (Brasil)"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subtitle-language">Idioma</Label>
              <Input
                id="subtitle-language"
                value={formValues.language}
                onChange={(event) =>
                  setFormValues((state) => ({
                    ...state,
                    language: event.target.value,
                  }))
                }
                placeholder={getLanguagePlaceholder()}
                required
              />
              <p className="text-xs text-muted-foreground">
                Use código curto (ex.: pt-BR, en)
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="subtitle-file">Arquivo .vtt</Label>
              <Input
                id="subtitle-file"
                type="file"
                accept=".vtt,text/vtt"
                onChange={(event) =>
                  setFormValues((state) => ({
                    ...state,
                    file: event.target.files?.[0] ?? null,
                  }))
                }
                required
              />
              <p className="text-xs text-muted-foreground">
                Máx. {formatFileSize(MAX_SIZE_BYTES)} | Apenas .vtt
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <label className="inline-flex items-center gap-2 text-sm text-foreground">
              <input
                type="checkbox"
                checked={formValues.isDefault}
                onChange={(event) =>
                  setFormValues((state) => ({
                    ...state,
                    isDefault: event.target.checked,
                  }))
                }
              />
              Definir como padrão
            </label>
          </div>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full md:w-auto"
          >
            {isSubmitting ? "Adicionando..." : "Adicionar legenda"}
          </Button>
        </form>
      </Card>

      <Card className="border-white/10 bg-card/80 p-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              Legendas cadastradas
            </h2>
            <p className="text-sm text-muted-foreground">
              Gerencie idiomas, arquivos .vtt e defina a legenda padrão.
            </p>
          </div>
          <span className="text-sm font-semibold text-primary">
            {sortedList.length} registro{sortedList.length === 1 ? "" : "s"}
          </span>
        </div>

        {sortedList.length === 0 ? (
          <p className="mt-6 text-sm text-muted-foreground">
            Nenhuma legenda cadastrada para esta aula ainda.
          </p>
        ) : (
          <div className="mt-6 space-y-3">
            {sortedList.map((subtitle) => (
              <div
                key={subtitle.id}
                className="rounded-2xl border border-white/10 bg-background/60 p-4 shadow-inner"
              >
                {editingId === subtitle.id ? (
                  <div className="grid gap-4 md:grid-cols-[1fr,140px,180px]">
                    <div className="space-y-2">
                      <Label htmlFor={`edit-label-${subtitle.id}`}>
                        Descrição
                      </Label>
                      <Input
                        id={`edit-label-${subtitle.id}`}
                        value={editingValues.label}
                        onChange={(event) =>
                          setEditingValues((state) => ({
                            ...state,
                            label: event.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`edit-language-${subtitle.id}`}>
                        Idioma
                      </Label>
                      <Input
                        id={`edit-language-${subtitle.id}`}
                        value={editingValues.language}
                        onChange={(event) =>
                          setEditingValues((state) => ({
                            ...state,
                            language: event.target.value,
                          }))
                        }
                      />
                      <label className="inline-flex items-center gap-2 text-xs text-foreground">
                        <input
                          type="checkbox"
                          checked={editingValues.isDefault}
                          onChange={(event) =>
                            setEditingValues((state) => ({
                              ...state,
                              isDefault: event.target.checked,
                            }))
                          }
                        />
                        Definir como padrão
                      </label>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`edit-file-${subtitle.id}`}>
                        Substituir arquivo (.vtt)
                      </Label>
                      <Input
                        id={`edit-file-${subtitle.id}`}
                        type="file"
                        accept=".vtt,text/vtt"
                        onChange={(event) =>
                          setEditingValues((state) => ({
                            ...state,
                            file: event.target.files?.[0] ?? null,
                          }))
                        }
                      />
                      <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                        <span>Atual: {subtitle.label}</span>
                        <span className="text-primary">
                          {subtitle.isDefault ? "(Padrão)" : ""}
                        </span>
                      </div>
                      <div className="flex flex-col gap-2 sm:flex-row">
                        <Button
                          type="button"
                          size="sm"
                          onClick={handleSaveEdit}
                          disabled={isSavingEdit}
                        >
                          {isSavingEdit ? "Salvando..." : "Salvar"}
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={resetEditingState}
                          disabled={isSavingEdit}
                        >
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-3 md:grid-cols-[1fr,1fr,auto] md:items-center">
                    <div className="space-y-1">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">
                        Idioma
                      </p>
                      <p className="font-semibold text-foreground">
                        {subtitle.label}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {subtitle.language.toUpperCase()}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">
                        Arquivo
                      </p>
                      <a
                        href={subtitle.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm font-semibold text-primary hover:underline"
                      >
                        Ver arquivo
                      </a>
                      {subtitle.isDefault && (
                        <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-primary">
                          Padrão
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleStartEdit(subtitle)}
                      >
                        Editar
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(subtitle.id)}
                        disabled={deletingId === subtitle.id}
                      >
                        {deletingId === subtitle.id
                          ? "Removendo..."
                          : "Excluir"}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default SubtitleManager;
