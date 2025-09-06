import { UserRole } from "@prisma/client";
import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      image?: string | null;
      role: UserRole;
      nickname?: string | null;
    };
  }

  interface User {
    id: string;
    email: string;
    image?: string | null;
    role: UserRole;
    nickname?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: UserRole;
    nickname?: string | null;
  }
}
