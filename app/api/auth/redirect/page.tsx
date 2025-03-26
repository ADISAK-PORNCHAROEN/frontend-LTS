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
        isAdmin: "admin",
        isCoordinator: "program_coordinator",
        isInstructor: "instructor"
    }

    const handleRedirect = useCallback(async () => {
        if (session && status === 'authenticated') {
            try {
                setIsLoading(true)

                await new Promise(resolve => setTimeout(resolve, 300))

                if (user?.role === Role.isInstructor) {
                    await router.push('/instructor/dashboard')
                } else if (user?.role === Role.isAdmin) {
                    await router.push('/admin/dashboard')
                } else if (user?.role === Role.isCoordinator) {
                    await router.push('/coordinator/dashboard')
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
    }, [session, status, user?.role, Role.isInstructor, Role.isAdmin, Role.isCoordinator, router]);

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