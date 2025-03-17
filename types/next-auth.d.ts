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
      fname: string
      lname: string
      role: string
      curriculumId: number
    } & DefaultSession["user"]
  }
}