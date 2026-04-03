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
      <nav className="flex flex-col gap-2 text-sm">
        <Link
          href="/dashboard"
          className="text-slate-200 transition-colors duration-200 hover:text-white"
        >
          Dashboard
        </Link>
      </nav>
    )
  }

  return (
    <nav className="flex flex-col gap-2 text-sm">
      <Link
        href="/signup"
        className="text-slate-200 transition-colors duration-200 hover:text-white"
      >
        Create account
      </Link>
      <Link
        href="/login"
        className="text-slate-200 transition-colors duration-200 hover:text-white"
      >
        Sign in
      </Link>
      
    </nav>
  )
}

export default HomeFooterAccountLinks
