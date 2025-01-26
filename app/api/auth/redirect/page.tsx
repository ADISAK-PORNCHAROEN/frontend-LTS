'use client'

import { useCallback, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Backdrop, CircularProgress } from '@mui/material'

export default function SignIn() {
    const router = useRouter()
    const { data: session, status, update } = useSession()
    console.log("status", status)
    const [isLoading, setIsLoading] = useState(true)
    const user = session?.user;

    const Role = {
        admin: 'admin',
        member: 'member'
    }

    const handleRedirect = useCallback(async () => {
        if (session && status === 'authenticated') {
            try {
                setIsLoading(true)

                // ให้เวลา NextJS โหลด CSS และ assets ต่างๆ ก่อน
                await new Promise(resolve => setTimeout(resolve, 300))

                if (user?.role === Role.member) {
                    await router.push('/member')
                } else if (user?.role === Role.admin) {
                    await router.push('/admin/dashboard')
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
    }, [session, status, router, Role.member, Role.admin, user]);

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