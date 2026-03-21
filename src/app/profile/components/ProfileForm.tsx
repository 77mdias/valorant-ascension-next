"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProfileUpdateSchema, ProfileUpdateInput } from "@/schemas/profileSchemas";
import { updateCurrentUserProfile } from "@/server/profileActions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNotification } from "@/components/ui/notification";
import { Loader2, Save, Image as ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";

interface ProfileFormProps {
  currentData: {
    name: string;
    nickname: string;
    image: string;
  };
}

export default function ProfileForm({ currentData }: ProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { NotificationContainer, showNotification } = useNotification();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    watch,
    reset,
  } = useForm<ProfileUpdateInput>({
    resolver: zodResolver(ProfileUpdateSchema),
    defaultValues: currentData,
  });

  const imageUrl = watch("image");

  const onSubmit = async (data: ProfileUpdateInput) => {
    setIsLoading(true);

    try {
      const result = await updateCurrentUserProfile(data);

      if (result.success) {
        showNotification({
          type: "success",
          message: result.message || "Perfil atualizado com sucesso!",
        });

        // Resetar o form com os novos valores
        reset(data);

        // Forçar refresh dos dados
        router.refresh();
      } else {
        showNotification({
          type: "error",
          message: result.error || "Erro ao atualizar perfil",
        });
      }
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      showNotification({
        type: "error",
        message: "Erro inesperado ao atualizar perfil. Tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="bg-card rounded-lg p-6 border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-6">
          Editar Perfil
        </h3>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Nome */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-muted-foreground">
              Nome completo
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Seu nome completo"
              className="border-border bg-background text-foreground placeholder:text-muted-foreground"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* Nickname */}
          <div className="space-y-2">
            <Label htmlFor="nickname" className="text-muted-foreground">
              Nickname
              <span className="text-muted-foreground text-xs ml-2">
                (apenas letras, números, _ e -)
              </span>
            </Label>
            <Input
              id="nickname"
              type="text"
              placeholder="seu_nickname"
              className="border-border bg-background text-foreground placeholder:text-muted-foreground"
              {...register("nickname")}
            />
            {errors.nickname && (
              <p className="text-sm text-red-500">{errors.nickname.message}</p>
            )}
          </div>

          {/* URL da Imagem */}
          <div className="space-y-2">
            <Label htmlFor="image" className="text-muted-foreground">
              URL da Imagem de Perfil
            </Label>
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  id="image"
                  type="url"
                  placeholder="https://exemplo.com/imagem.jpg"
                  className="border-border bg-background text-foreground placeholder:text-muted-foreground"
                  {...register("image")}
                />
              </div>
              {imageUrl && (
                <div className="relative w-12 h-12 rounded-lg border border-border overflow-hidden bg-muted flex items-center justify-center">
                  {imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={imageUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                        (e.target as HTMLImageElement).nextElementSibling?.classList.remove("hidden");
                      }}
                    />
                  ) : null}
                  <ImageIcon className="w-6 h-6 text-muted-foreground hidden" />
                </div>
              )}
            </div>
            {errors.image && (
              <p className="text-sm text-red-500">{errors.image.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Cole a URL de uma imagem hospedada online (ex: Imgur, Cloudinary)
            </p>
          </div>

          {/* Botões */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              type="submit"
              disabled={isLoading || !isDirty}
              className="flex-1 bg-gradient-to-r from-primary via-secondary to-accent hover:opacity-90 transition-opacity"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Alterações
                </>
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              disabled={isLoading || !isDirty}
              onClick={() => reset()}
              className="flex-1 border-border text-muted-foreground hover:bg-muted"
            >
              Cancelar
            </Button>
          </div>

          {!isDirty && (
            <p className="text-sm text-muted-foreground text-center">
              Faça alterações nos campos acima para salvar
            </p>
          )}
        </form>
      </div>

      <NotificationContainer />
    </>
  );
}
