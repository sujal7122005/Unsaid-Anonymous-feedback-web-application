'use client'
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
    <div>page</div>
  )
}

export default page