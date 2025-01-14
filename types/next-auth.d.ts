// types/next-auth.d.ts
import "next-auth"
import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface User {
    id: number
  }
  interface Session {
    user: {
      id: number
      role: string
      image: string
    } & DefaultSession["user"]
  }
}