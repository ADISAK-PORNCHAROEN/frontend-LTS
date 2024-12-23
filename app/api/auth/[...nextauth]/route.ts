import NextAuth, { SessionStrategy } from "next-auth"
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from "bcrypt"
import { IUser } from "#/types/IResponse/IResponse"
import axios from "axios"

interface ApiResponse {
    success: boolean;
    message: string;
    data: IUser;
    error: null | string;
}

async function findUserByEmail(email: string): Promise<IUser | null> {
    try {
        const response = await axios.get<ApiResponse>(`/lts-user/findByEmail?email=${email}`, {
            baseURL: process.env.NEXT_PUBLIC_API_URL
        })
        return response.data.data
    } catch (error) {
        console.error('Error finding user:', error)
        return null
    }
}

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email', placeholder: 'john@doe.com' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials, req) {
                if (!credentials) return null
                const user = await findUserByEmail(credentials.email)

                if (
                    user &&
                    (await bcrypt.compare(credentials.password, user.password || ''))
                ) {
                    return {
                        id: user?.id?.toString() as string, // Cast id to string
                        name: user.name,
                        email: user.email
                    }
                } else {
                    throw new Error('Invalid email or password')
                }
            },
        })
    ],
    session: {
        strategy: 'jwt' as SessionStrategy,
    },
    callbacks: {
        jwt: async ({ token, user }: any) => {
            if (user) {
                token.id = user.id
            }
            return token
        },
        session: async ({ session, token }: any) => {
            if (session.user) {
                session.user.id = token.id
            }
            return session
        }
    },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }