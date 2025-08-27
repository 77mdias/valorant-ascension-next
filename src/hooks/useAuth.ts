"use client";

import { useSession } from "next-auth/react";
import { UserRole } from "@prisma/client";

export function useAuth() {
  const { data: session, status } = useSession();

  return {
    user: session?.user,
    isLoading: status === "loading",
    isAuthenticated: !!session?.user,
    isAdmin: (session?.user as any).role === UserRole.ADMIN,
    isSeller: (session?.user as any).role === UserRole.PROFESSIONAL,
    isCustomer: (session?.user as any).role === UserRole.CUSTOMER,
    session,
    status,
  };
}
