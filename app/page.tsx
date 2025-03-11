"use client";
import { useSession } from 'next-auth/react'
import React, { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Page() {
  const router = useRouter()
  const { data: session, status, update } = useSession()
  const [isLoading, setIsLoading] = useState(true)
  const user = session?.user;

  const Role = {
    admin: 'admin',
    professor: 'professor',
    member: 'member'
  }

  const handleRedirect = useCallback(async () => {
    if (session && status === 'authenticated') {
      try {
        setIsLoading(true)

        // await new Promise(resolve => setTimeout(resolve, 300))

        // await new Promise(resolve => setTimeout(resolve, 100))
        // await router.push('/api/auth/redirect')
        // await router.refresh()

      } catch (error) {
        console.error('Redirect error:', error)
      } finally {
        setIsLoading(false)
      }
    } else if (status === 'unauthenticated') {
      setIsLoading(false)
      await router.push('/signIn')
    }
  }, [session, status, router]);

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
    <div>

    </div>
  )
}