"use client";

import { type FormEvent, useEffect, useMemo, useState } from "react";
import type { VideoTimestamp } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  createVideoTimestamp,
  deleteVideoTimestamp,
  updateVideoTimestamp,
} from "@/server/videoTimestampActions";
import { formatSeconds, parseTimecode } from "@/lib/time";

interface TimestampManagerProps {
  lessonId: string;
  initialTimestamps: VideoTimestamp[];
  lessonDuration?: number | null;
}

const sortTimestamps = (items: VideoTimestamp[]) =>
  [...items].sort((a, b) => a.time - b.time);

const getTimeInputFromSeconds = (seconds: number) => formatSeconds(seconds);

const TimestampManager = ({
  lessonId,
  initialTimestamps,
  lessonDuration,
}: TimestampManagerProps) => {
  const [timestamps, setTimestamps] = useState(() =>
    sortTimestamps(initialTimestamps),
  );
  const [formValues, setFormValues] = useState({ label: "", time: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValues, setEditingValues] = useState({
    label: "",
    time: "",
  });
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    setTimestamps(sortTimestamps(initialTimestamps));
  }, [initialTimestamps]);

  const sortedList = useMemo(() => sortTimestamps(timestamps), [timestamps]);

  const parseSecondsOrThrow = (value: string) => {
    const parsed = parseTimecode(value);
    if (parsed === null) {
      throw new Error("Tempo inválido. Use mm:ss ou apenas segundos.");
    }
    if (
      typeof lessonDuration === "number" &&
      lessonDuration >= 0 &&
      parsed > lessonDuration
    ) {
      throw new Error(
        "Timestamp não pode ultrapassar a duração registrada da aula.",
      );
    }
    return parsed;
  };

  const resetEditingState = () => {
    setEditingId(null);
    setEditingValues({ label: "", time: "" });
  };

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) {
      return;
    }

    const trimmedLabel = formValues.label.trim();
    if (!trimmedLabel) {
      toast.error("Informe uma descrição para o timestamp.");
      return;
    }

    try {
      setIsSubmitting(true);
      const timeInSeconds = parseSecondsOrThrow(formValues.time);
      const result = await createVideoTimestamp({
        lessonId,
        label: trimmedLabel,
        time: timeInSeconds,
      });

      if (!result.success || !result.data) {
        throw new Error(result.error || "Falha ao criar timestamp.");
      }

      setTimestamps((prev) => sortTimestamps([...prev, result.data]));
      setFormValues({ label: "", time: "" });
      toast.success("Timestamp adicionado!");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Erro ao criar timestamp.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartEdit = (timestamp: VideoTimestamp) => {
    setEditingId(timestamp.id);
    setEditingValues({
      label: timestamp.label,
      time: getTimeInputFromSeconds(timestamp.time),
    });
  };

  const handleSaveEdit = async () => {
    if (!editingId) {
      return;
    }
    const trimmedLabel = editingValues.label.trim();
    if (!trimmedLabel) {
      toast.error("Informe uma descrição para o timestamp.");
      return;
    }

    try {
      setIsSavingEdit(true);
      const timeInSeconds = parseSecondsOrThrow(editingValues.time);
      const result = await updateVideoTimestamp({
        id: editingId,
        lessonId,
        label: trimmedLabel,
        time: timeInSeconds,
      });

      if (!result.success || !result.data) {
        throw new Error(result.error || "Falha ao atualizar timestamp.");
      }

      setTimestamps((prev) =>
        sortTimestamps(
          prev.map((item) =>
            item.id === editingId
              ? { ...item, label: trimmedLabel, time: timeInSeconds }
              : item,
          ),
        ),
      );
      toast.success("Timestamp atualizado!");
      resetEditingState();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Erro ao atualizar timestamp.",
      );
    } finally {
      setIsSavingEdit(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja remover este timestamp?")) {
      return;
    }
    try {
      setDeletingId(id);
      const result = await deleteVideoTimestamp(id);
      if (!result.success) {
        throw new Error(result.error || "Não foi possível remover.");
      }
      setTimestamps((prev) => prev.filter((item) => item.id !== id));
      if (editingId === id) {
        resetEditingState();
      }
      toast.success("Timestamp removido.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Erro ao remover timestamp.",
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-white/10 bg-card/80 p-6">
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-[1fr,220px]">
            <div className="space-y-2">
              <Label htmlFor="timestamp-label">Descrição</Label>
              <Input
                id="timestamp-label"
                value={formValues.label}
                onChange={(event) =>
                  setFormValues((state) => ({
                    ...state,
                    label: event.target.value,
                  }))
                }
                placeholder="Ex.: Execução de split B"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timestamp-time">
                Tempo (segundos ou mm:ss/mm:ss)
              </Label>
              <Input
                id="timestamp-time"
                value={formValues.time}
                onChange={(event) =>
                  setFormValues((state) => ({
                    ...state,
                    time: event.target.value,
                  }))
                }
                placeholder="Ex.: 1:30"
                required
              />
              <p className="text-xs text-muted-foreground">
                {lessonDuration
                  ? `Duração registrada: ${formatSeconds(lessonDuration)}`
                  : "Use segundos ou padrões mm:ss / hh:mm:ss."}
              </p>
            </div>
          </div>
          <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto">
            {isSubmitting ? "Adicionando..." : "Adicionar timestamp"}
          </Button>
        </form>
      </Card>

      <Card className="border-white/10 bg-card/80 p-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              Timestamps cadastrados
            </h2>
            <p className="text-sm text-muted-foreground">
              Clique em editar para ajustar descrição ou tempo.
            </p>
          </div>
          <span className="text-sm font-semibold text-primary">
            {sortedList.length} registro{sortedList.length === 1 ? "" : "s"}
          </span>
        </div>

        {sortedList.length === 0 ? (
          <p className="mt-6 text-sm text-muted-foreground">
            Nenhum timestamp cadastrado para esta aula ainda.
          </p>
        ) : (
          <div className="mt-6 space-y-3">
            {sortedList.map((timestamp) => (
              <div
                key={timestamp.id}
                className="rounded-2xl border border-white/10 bg-background/60 p-4 shadow-inner"
              >
                {editingId === timestamp.id ? (
                  <div className="grid gap-4 md:grid-cols-[1fr,200px,auto]">
                    <div className="space-y-2">
                      <Label htmlFor={`edit-label-${timestamp.id}`}>
                        Descrição
                      </Label>
                      <Input
                        id={`edit-label-${timestamp.id}`}
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
                      <Label htmlFor={`edit-time-${timestamp.id}`}>
                        Tempo
                      </Label>
                      <Input
                        id={`edit-time-${timestamp.id}`}
                        value={editingValues.time}
                        onChange={(event) =>
                          setEditingValues((state) => ({
                            ...state,
                            time: event.target.value,
                          }))
                        }
                      />
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
                ) : (
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">
                        Tempo
                      </p>
                      <p className="font-mono text-xl font-semibold text-primary">
                        {formatSeconds(timestamp.time)}
                      </p>
                    </div>
                    <p className="flex-1 text-base font-medium text-foreground">
                      {timestamp.label}
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleStartEdit(timestamp)}
                      >
                        Editar
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(timestamp.id)}
                        disabled={deletingId === timestamp.id}
                      >
                        {deletingId === timestamp.id ? "Removendo..." : "Excluir"}
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

export default TimestampManager;
