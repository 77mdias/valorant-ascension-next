"use server";

import { db } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { ProfileUpdateSchema } from "@/schemas/profileSchemas";

/**
 * Busca o perfil completo do usuário logado
 * Inclui informações de assinatura se houver
 */
export async function getCurrentUserProfile() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    throw new Error("Não autenticado");
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      nickname: true,
      email: true,
      image: true,
      role: true,
      isActive: true,
      emailVerified: true,
      createdAt: true,
      updatedAt: true,
      subscriptions: {
        where: {
          status: "active",
        },
        orderBy: {
          currentPeriodEnd: "desc",
        },
        take: 1,
        select: {
          id: true,
          stripePriceId: true,
          status: true,
          currentPeriodStart: true,
          currentPeriodEnd: true,
          cancelAtPeriodEnd: true,
        },
      },
    },
  });

  if (!user) {
    throw new Error("Usuário não encontrado");
  }

  return {
    success: true,
    data: {
      ...user,
      subscription: user.subscriptions[0] || null,
    },
  };
}

/**
 * Atualiza o perfil do usuário logado
 * Apenas name, nickname e image podem ser atualizados
 */
export async function updateCurrentUserProfile(raw: unknown) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    throw new Error("Não autenticado");
  }

  // Valida os dados de entrada
  const validatedData = ProfileUpdateSchema.parse(raw);

  // Remove campos vazios (undefined) para não sobrescrever
  const updateData: {
    name?: string | null;
    nickname?: string | null;
    image?: string | null;
  } = {};
  if (validatedData.name !== undefined) {
    updateData.name = validatedData.name || null;
  }
  if (validatedData.nickname !== undefined) {
    updateData.nickname = validatedData.nickname || null;
  }
  if (validatedData.image !== undefined) {
    updateData.image = validatedData.image || null;
  }

  // Verifica se há algo para atualizar
  if (Object.keys(updateData).length === 0) {
    return {
      success: false,
      error: "Nenhum dado para atualizar",
    };
  }

  try {
    const updatedUser = await db.user.update({
      where: { id: session.user.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        nickname: true,
        email: true,
        image: true,
        role: true,
        updatedAt: true,
      },
    });

    // Revalidar as páginas que podem exibir dados do usuário
    revalidatePath("/perfil");
    revalidatePath("/");

    return {
      success: true,
      data: updatedUser,
      message: "Perfil atualizado com sucesso!",
    };
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error);

    // Tratar erros específicos do Prisma
    if (error && typeof error === "object" && "code" in error && error.code === "P2002") {
      return {
        success: false,
        error: "Este nickname já está em uso",
      };
    }

    return {
      success: false,
      error: "Erro ao atualizar perfil. Tente novamente.",
    };
  }
}
