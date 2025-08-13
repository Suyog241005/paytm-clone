import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import authConfig from "./auth.config"
import type { NextAuthConfig } from "next-auth"

const prisma = new PrismaClient()

const config: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  ...authConfig,
  events: {
    async createUser({ user }) {
      if (user.id) {
        await prisma.balance.create({
          data: {
            userId: user.id,
            amount: 20000,
            locked: 0,
          },
        })
      }
    },
  },
}

import type { Session } from "next-auth"

const nextAuth = NextAuth(config)
export const handlers = nextAuth.handlers
export const signIn:any = nextAuth.signIn
export const signOut = nextAuth.signOut
export const auth = nextAuth.auth as () => Promise<Session | null>