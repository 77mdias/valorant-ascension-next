import { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { db } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { UserRole } from "@prisma/client";
import { getServerSession } from "next-auth";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  providers: [
    // OAuth Providers
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
      httpOptions: {
        timeout: 20000, // 20 segundos - timeout aumentado
      },
    }),
    // Credentials Provider para login com email/senha
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await db.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user || !user.password) {
          return null;
        }

        // Verificar se o usuário está ativo
        if (!user.isActive) {
          throw new Error("EmailNotVerified");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password,
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          nickname: user.nickname,
          image: (user as any).image || (user as any).avatar || null,
          role: user.role,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 dias
    updateAge: 24 * 60 * 60, // Atualiza a cada 24h
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 dias
  },
  events: {
    async signIn({ user, account, profile }) {
      console.log("✅ SignIn event:", {
        provider: account?.provider,
        email: user.email,
        userId: user.id,
      });
    },
    async createUser({ user }) {
      console.log("🆕 User created:", {
        email: user.email,
        id: user.id,
      });
    },
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.role = (user as any).role;
        token.id = user.id;
        token.nickname =
          (user as any).nickname || user.name || user.email?.split("@")[0];
        token.name = user.name;
        token.image = user.image;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        (session.user as any).id = token.id as string;
        (session.user as any).role = token.role as UserRole;
        (session.user as any).nickname = token.nickname as string;
        session.user.name = token.name as string;
        session.user.image = token.image as string;
      }

      return session;
    },
    async signIn({ user, account, profile }) {
      // Para login OAuth (Google, GitHub)
      if (account?.provider !== "credentials") {
        console.log("🔍 OAuth SignIn:", {
          provider: account?.provider,
          email: user.email,
        });

        try {
          // Verificar se já existe um usuário com este email
          const existingUser = await db.user.findUnique({
            where: { email: user.email! },
            include: {
              accounts: true,
            },
          });

          if (existingUser) {
            console.log("👤 Usuário existente encontrado");

            // Verificar se já tem conta OAuth vinculada
            const hasOAuthAccount = existingUser.accounts.some(
              (acc) => acc.provider === account?.provider,
            );

            if (!hasOAuthAccount) {
              // Se tem conta por credenciais mas tenta OAuth, bloquear
              if (existingUser.password) {
                console.log("❌ Usuário tem senha, OAuth não permitido");
                return false; // Vai redirecionar para erro
              }
            }

            // Ativar usuário se veio pelo OAuth (email já verificado)
            if (!existingUser.isActive) {
              await db.user.update({
                where: { id: existingUser.id },
                data: {
                  isActive: true,
                  emailVerified: new Date(),
                  name: user.name,
                  image: user.image,
                },
              });
            }

            return true;
          } else {
            console.log("🆕 Criando novo usuário OAuth");

            // Criar novo usuário OAuth
            await db.user.create({
              data: {
                email: user.email!,
                name: user.name || user.email?.split("@")[0],
                nickname: user.name || user.email?.split("@")[0],
                image: user.image,
                role: UserRole.CUSTOMER,
                isActive: true,
                emailVerified: new Date(),
              },
            });

            return true;
          }
        } catch (error) {
          console.error("❌ Erro no signIn OAuth:", error);
          return false;
        }
      }

      // Para credentials, verificar se o usuário está ativo
      const dbUser = await db.user.findUnique({
        where: { email: user.email! },
      });

      return dbUser?.isActive ?? false;
    },
    async redirect({ url, baseUrl }) {
      console.log("🔍 NextAuth redirect callback:", { url, baseUrl });

      // Se a URL é relativa, adiciona o baseUrl
      if (url.startsWith("/")) {
        const redirectUrl = `${baseUrl}${url}`;
        console.log("🔍 URL relativa, redirecionando para:", redirectUrl);
        return redirectUrl;
      }

      // Se a URL é do mesmo domínio, permite
      if (url.startsWith(baseUrl)) {
        console.log("🔍 URL do mesmo domínio, permitindo:", url);
        return url;
      }

      // Se a URL contém callbackUrl, extrai e usa
      if (url.includes("callbackUrl=")) {
        const urlObj = new URL(url);
        const callbackUrl = urlObj.searchParams.get("callbackUrl");
        if (callbackUrl) {
          const finalUrl = callbackUrl.startsWith("/")
            ? `${baseUrl}${callbackUrl}`
            : callbackUrl;
          console.log(
            "🔍 CallbackUrl encontrada, redirecionando para:",
            finalUrl,
          );
          return finalUrl;
        }
      }

      // Verificar se é uma URL de callback do Stripe
      if (url.includes("session_id=") && url.includes("/pedido/")) {
        console.log("🔍 URL de callback do Stripe detectada:", url);
        return url;
      }

      // Se não, volta para o baseUrl
      console.log("🔍 Redirecionando para baseUrl:", baseUrl);
      return baseUrl;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error", // Redirecionar para página de erro dedicada
    signOut: "/", // Redirecionar para home após logout
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// Helpers para server-side
export const getCurrentUser = async () => {
  const session = await getServerSession(authOptions);
  return session?.user;
};

export const requireAuth = async () => {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
};
