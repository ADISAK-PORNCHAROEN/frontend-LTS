import { createUserAccountApi, createUserApi, findProviderAndProviderAccountIdApi, findUserByEmailApi, updateUserAccountTokensApi } from "#/app/api/userApi"
import type { NextAuthOptions, SessionStrategy } from "next-auth"
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"

const ROLE = {
    isAdmin: 'admin',
    isMember: 'member'
}

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email', placeholder: 'john@doe.com' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials, req) {
                if (!credentials) return null
                const user = await findUserByEmailApi(credentials.email)

                if (
                    user &&
                    (await bcrypt.compare(credentials.password, user.password || ''))
                ) {
                    return {
                        id: user.id as number, // Cast id to string
                        name: user.name,
                        email: user.email,
                        role: user.role,
                        image: user.image
                    }
                } else {
                    throw new Error('Invalid email or password')
                }
            },
        }),
        // GoogleProvider({
        //     clientId: process.env.GOOGLE_CLIENT_ID as string,
        //     clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        //     authorization: {
        //         params: {
        //             prompt: "consent",
        //             access_type: "offline",
        //             response_type: "code",
        //         }
        //     }
        // })
    ],
    session: {
        strategy: 'jwt' as SessionStrategy,
        // maxAge: 2 * 60,
    },
    pages: {
        signIn: '/auth/signIn',
      },
    callbacks: {
        // signIn: async ({ user, account, profile }: any) => {
        //     try {
        //         if (account?.provider === 'google') {
        //             let dbUser = await findUserByEmailApi(user.email!);

        //             const userDataWithRole = {
        //                 ...profile,
        //                 role: ROLE.isMember // หรือค่า default role ที่คุณต้องการ
        //             };

        //             if (!dbUser) {
        //                 const userResponse = await createUserApi(userDataWithRole);
        //                 if (!userResponse || !userResponse.data) {
        //                     console.error('Failed to create user');
        //                     return false;
        //                 }
        //                 dbUser = userResponse.data; // ใช้ .data เพื่อเข้าถึง IUser
        //             }

        //             const existingAccount = await findProviderAndProviderAccountIdApi(
        //                 account.provider,
        //                 profile.sub
        //             );

        //             if (!existingAccount) {
        //                 if (account.access_token) {
        //                     await createUserAccountApi({
        //                         userId: dbUser.id,
        //                         type: account.type,
        //                         provider: account.provider,
        //                         providerAccountId: profile.sub,
        //                         accessToken: account.access_token,
        //                         refreshToken: account.refresh_token,
        //                         expiresAt: account.expires_at,
        //                         tokenType: account.token_type,
        //                         scope: account.scope,
        //                         idToken: account.id_token,
        //                         sessionState: account.session_state
        //                     });
        //                 }
        //             } else {
        //                 // หากบัญชีมีอยู่แล้ว ให้ทำการอัปเดต token ที่เกี่ยวข้อง
        //                 if (account.access_token) {
        //                     await updateUserAccountTokensApi({
        //                         id: existingAccount.id,
        //                         accessToken: account.access_token,
        //                         refreshToken: account.refresh_token,
        //                         expiresAt: account.expires_at,
        //                         tokenType: account.token_type,
        //                         scope: account.scope,
        //                         idToken: account.id_token,
        //                         sessionState: account.session_state
        //                     });
        //                 }
        //             }

        //             user.id = dbUser.id;
        //             user.role = dbUser.role;
        //             return true;
        //         }
        //         return true;
        //     } catch (error) {
        //         console.error('SignIn error:', error);
        //         return false;
        //     }
        // },

        jwt: async ({ token, user }: any) => {
            if (user) {
                token.id = user.id
                token.role = user.role
                token.image = user.image
            }
            return token
        },
        session: async ({ session, token }: any) => {
            if (session.user) {
                session.user.id = token.id
                session.user.role = token.role
                session.user.image = token.image
            }
            return session
        }
    },
}