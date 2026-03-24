import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { db } from "./db";

// Dynamic import for bcryptjs to avoid bundling issues
const comparePassword = async (password: string, hash: string) => {
  const { compare } = await import("bcryptjs");
  return compare(password, hash);
};

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },
  providers: [
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
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          return null;
        }

        const passwordMatch = await comparePassword(
          credentials.password,
          user.password
        );

        if (!passwordMatch) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
    async signIn({ user, account }) {
      // Allow credentials sign in
      if (account?.provider === "credentials") {
        return true;
      }
      // For OAuth providers, check if user exists
      if (user.email) {
        const existingUser = await db.user.findUnique({
          where: { email: user.email },
        });
        if (existingUser) {
          return true;
        }
        // Create new user for OAuth
        await db.user.create({
          data: {
            email: user.email,
            name: user.name,
            image: user.image,
            role: "CUSTOMER",
          },
        });
      }
      return true;
    },
  },
  events: {
    async createUser({ user }) {
      // Create default address entry for new users
      // This is handled by the database relations
    },
  },
};

// Extend next-auth types
declare module "next-auth" {
  interface User {
    role?: string;
  }
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
      role?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role?: string;
  }
}
