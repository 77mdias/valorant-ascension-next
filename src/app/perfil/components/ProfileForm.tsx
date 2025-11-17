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
    } catch (error: any) {
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
      <div className="bg-[var(--card-product)] rounded-lg p-6 border border-gray-800">
        <h3 className="text-lg font-semibold text-white mb-6">
          Editar Perfil
        </h3>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Nome */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-300">
              Nome completo
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Seu nome completo"
              className="border-gray-600 bg-[var(--all-black)] text-white placeholder-gray-500"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* Nickname */}
          <div className="space-y-2">
            <Label htmlFor="nickname" className="text-gray-300">
              Nickname
              <span className="text-gray-500 text-xs ml-2">
                (apenas letras, números, _ e -)
              </span>
            </Label>
            <Input
              id="nickname"
              type="text"
              placeholder="seu_nickname"
              className="border-gray-600 bg-[var(--all-black)] text-white placeholder-gray-500"
              {...register("nickname")}
            />
            {errors.nickname && (
              <p className="text-sm text-red-500">{errors.nickname.message}</p>
            )}
          </div>

          {/* URL da Imagem */}
          <div className="space-y-2">
            <Label htmlFor="image" className="text-gray-300">
              URL da Imagem de Perfil
            </Label>
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  id="image"
                  type="url"
                  placeholder="https://exemplo.com/imagem.jpg"
                  className="border-gray-600 bg-[var(--all-black)] text-white placeholder-gray-500"
                  {...register("image")}
                />
              </div>
              {imageUrl && (
                <div className="relative w-12 h-12 rounded-lg border border-gray-600 overflow-hidden bg-gray-800 flex items-center justify-center">
                  {imageUrl ? (
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
                  <ImageIcon className="w-6 h-6 text-gray-500 hidden" />
                </div>
              )}
            </div>
            {errors.image && (
              <p className="text-sm text-red-500">{errors.image.message}</p>
            )}
            <p className="text-xs text-gray-500">
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
              className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              Cancelar
            </Button>
          </div>

          {!isDirty && (
            <p className="text-sm text-gray-500 text-center">
              Faça alterações nos campos acima para salvar
            </p>
          )}
        </form>
      </div>

      <NotificationContainer />
    </>
  );
}
