'use client'
import MessageCard from '@/src/components/MessageCard'
import { authClient } from '@/src/lib/auth-client'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

function page() {
  const router = useRouter()

  const { data: session, isPending } = authClient.useSession()
  useEffect(() => {
    if (!session && !isPending) {
      router.replace('/login')
    }
  }, [session, isPending, router])

  if (!session) {
    return null
  }

  return (
    <>
    <h1 className='text-3xl my-4 mx-8'><b>Your Anonymous Messages : </b></h1>
    <MessageCard message={{ content: 'This is a test message', createdAt: new Date() }} />
    </>
  )
}

export default page