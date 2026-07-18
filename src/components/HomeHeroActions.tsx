'use client'

import { useSyncExternalStore } from 'react'
import Link from 'next/link'
import { authClient } from '@/src/lib/auth-client'

const emptySubscribe = () => () => {}

function HomeHeroActions() {
  const { data: session, isPending } = authClient.useSession()
  const isHydrated = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  )

  if (!isHydrated || isPending) {
    return null
  }

  if (session?.user) {
    return (
      <div className="flex flex-col gap-4 sm:flex-row">
        <Link
          href="/dashboard"
          className="jelly-mint-pill"
        >
          GO TO DASHBOARD
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row">
      <Link
        href="/signup"
        className="jelly-mint-pill"
      >
        START FOR FREE
      </Link>
      <Link
        href="/login"
        className="dark-slate-pill"
      >
        SIGN IN
      </Link>
    </div>
  )
}

export default HomeHeroActions
