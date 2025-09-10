import { z } from "zod";

// Schema para criação de usuário (Aluno)
export const UserSchema = z.object({
  nickname: z.string().min(2, "Nickname deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  role: z.enum(["ADMIN", "CUSTOMER", "PROFESSIONAL"]).optional(),
  isActive: z.boolean().optional(),
  branchId: z.string().optional(),
});

export const UpdateUserSchema = UserSchema.partial().extend({
  id: z.string().uuid(),
});

export const UserFilterSchema = z.object({
  search: z.string().optional(),
  role: z.enum(["ADMIN", "CUSTOMER", "PROFESSIONAL"]).optional(),
  isActive: z.boolean().optional(),
});

export type UserInput = z.infer<typeof UserSchema>;
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;
export type UserFilter = z.infer<typeof UserFilterSchema>;
