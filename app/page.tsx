"use client";
import { useSession } from 'next-auth/react'
import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Page() {
  const {data: session, status} = useSession()
  const router = useRouter()

  // useEffect(() => {
  //   if (status === 'authenticated') {
  //     router.push('/profile')
  //   } else {
  //     router.push('/signIn')
  //   }
  // })
  
  return (
    <div>

    </div>
  )
}