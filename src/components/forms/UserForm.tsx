"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserInput, UserSchema } from "@/schemas/user";
import { z } from "zod";
// Enum de roles conforme schema.prisma
const UserRoleEnum = z.enum(["ADMIN", "CUSTOMER", "PROFESSIONAL"]);
import { createUser, updateUser } from "@/server/userActions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

interface UserFormProps {
  initialData?: Partial<UserInput> & { id?: string };
  onSuccess?: () => void;
}

export default function UserForm({ initialData, onSuccess }: UserFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const isEdit = !!initialData?.id;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<UserInput>({
    resolver: zodResolver(UserSchema),
    defaultValues: {
      branchId: initialData?.branchId || "",
      nickname: initialData?.nickname || "",
      email: initialData?.email || "",
      password: "",
      role: initialData?.role || "CUSTOMER",
      isActive: initialData?.isActive ?? false,
    },
  });

  const watchedRole = watch("role");
  const watchedIsActive = watch("isActive");

  async function onSubmit(data: UserInput) {
    setIsLoading(true);
    
    try {
      let result;
      
      if (isEdit) {
        result = await updateUser({ id: initialData!.id, ...data });
      } else {
        result = await createUser(data);
      }

      if (result.success) {
        toast.success(isEdit ? "Usuário atualizado com sucesso!" : "Usuário criado com sucesso!");
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
        <div className="space-y-2">
          <Label htmlFor="branchId">Branch *</Label>
          <Input
            id="branchId"
            {...register("branchId")}
            placeholder="ID do branch"
            disabled={isLoading}
          />
          {errors.branchId && (
            <p className="text-sm text-red-500">{errors.branchId.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="nickname">Apelido *</Label>
          <Input
            id="nickname"
            {...register("nickname")}
            placeholder="Apelido do usuário"
            disabled={isLoading}
          />
          {errors.nickname && (
            <p className="text-sm text-red-500">{errors.nickname.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            {...register("email")}
            placeholder="email@exemplo.com"
            disabled={isLoading}
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">
            {isEdit ? "Nova Senha (opcional)" : "Senha *"}
          </Label>
          <Input
            id="password"
            type="password"
            {...register("password")}
            placeholder={isEdit ? "Deixe em branco para manter atual" : "Mínimo 6 caracteres"}
            disabled={isLoading}
          />
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">Função</Label>
          <Select
            value={watchedRole}
            onValueChange={(value: string) => setValue("role", value as keyof typeof UserRoleEnum.enum)}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma função" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(UserRoleEnum.enum).map((role) => (
                <SelectItem key={role} value={role}>{role}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.role && (
            <p className="text-sm text-red-500">{errors.role.message}</p>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="isActive"
            checked={watchedIsActive}
            onCheckedChange={(checked: boolean) => setValue("isActive", checked)}
            disabled={isLoading}
          />
          <Label htmlFor="isActive">Usuário ativo</Label>
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