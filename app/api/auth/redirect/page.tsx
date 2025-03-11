'use client'

import { useCallback, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Backdrop, CircularProgress } from '@mui/material'

export default function SignIn() {
    const router = useRouter()
    const { data: session, status, update } = useSession()
    const [isLoading, setIsLoading] = useState(true)
    const user = session?.user;

    const Role = {
        isAdmin: 'admin',
        isProfessor: 'professor',
        isMember: 'member'
    }

    const handleRedirect = useCallback(async () => {
        if (session && status === 'authenticated') {
            try {
                setIsLoading(true)

                // ให้เวลา NextJS โหลด CSS และ assets ต่างๆ ก่อน
                await new Promise(resolve => setTimeout(resolve, 300))

                if (user?.role === Role.isMember) {
                    await router.push('/member')
                } else if (user?.role === Role.isAdmin) {
                    await router.push('/admin/dashboard')
                } else if (user?.role === Role.isProfessor) {
                    await router.push('/professor/dashboard')
                }

                // รอให้การ navigate เสร็จสมบูรณ์
                await new Promise(resolve => setTimeout(resolve, 100))
                await router.refresh()

            } catch (error) {
                console.error('Redirect error:', error)
            } finally {
                setIsLoading(false)
            }
        } else if (status === 'unauthenticated') {
            setIsLoading(false)
        }
    }, [session, status, user?.role, Role.isMember, Role.isAdmin, Role.isProfessor, router]);

    useEffect(() => {
        handleRedirect()
    }, [session, status, handleRedirect])

    if (!isLoading && status === 'unauthenticated') {
        const asyncFunction = async () => {
            await new Promise(resolve => setTimeout(resolve, 300))
            await router.push('/signIn')

            await new Promise(resolve => setTimeout(resolve, 100))
            await router.refresh()
        }
        asyncFunction();
    }

    return (
        <>
            <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                open={true}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </>
    )
}