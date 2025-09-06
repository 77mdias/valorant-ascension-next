// src/prisma/deleteUser.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function deleteUser(userId: string) {
  console.log(`Deletando usuário com ID: ${userId}`);
  await prisma.user.delete({
    where: { id: userId },
  });
}

deleteUser("0a8e9855-f23b-41f7-b5fb-d12b69b86fb0");
