import { z } from "zod";

/**
 * Schema para atualização de perfil do usuário logado
 * Permite atualizar: name, nickname, image
 * Email e role não são editáveis pelo usuário
 */
export const ProfileUpdateSchema = z.object({
  name: z
    .string()
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres")
    .optional(),
  nickname: z
    .string()
    .min(3, "Nickname deve ter pelo menos 3 caracteres")
    .max(50, "Nickname deve ter no máximo 50 caracteres")
    .regex(/^[a-zA-Z0-9_-]+$/, "Nickname só pode conter letras, números, _ e -")
    .optional(),
  image: z
    .string()
    .url("URL de imagem inválida")
    .optional()
    .or(z.literal("")), // Permite string vazia para remover imagem
});

export type ProfileUpdateInput = z.infer<typeof ProfileUpdateSchema>;

/**
 * Schema para exibição de perfil completo
 * Inclui dados somente leitura
 */
export const ProfileDisplaySchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
  nickname: z.string().nullable(),
  email: z.string().email(),
  image: z.string().nullable(),
  role: z.enum(["ADMIN", "CUSTOMER", "PROFESSIONAL"]),
  isActive: z.boolean(),
  emailVerified: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type ProfileDisplay = z.infer<typeof ProfileDisplaySchema>;
