'use client'

import Link from 'next/link'
import { authClient } from '@/src/lib/auth-client'

function HomeFooterAccountLinks() {
  const { data: session, isPending } = authClient.useSession()

  if (isPending) {
    return null
  }

  if (session?.user) {
    return (
      <Link
        href="/dashboard"
        className="font-sans-thin-caps text-[16px] text-white verge-link"
      >
        DASHBOARD
      </Link>
    )
  }

  return (
    <>
      <Link
        href="/signup"
        className="font-sans-thin-caps text-[16px] text-white verge-link"
      >
        CREATE ACCOUNT
      </Link>
      <Link
        href="/login"
        className="font-sans-thin-caps text-[16px] text-white verge-link"
      >
        SIGN IN
      </Link>
    </>
  )
}

export default HomeFooterAccountLinks
