'use client'

import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { authClient } from '@/src/lib/auth-client'

function HomeHeroActions() {
  const { data: session, isPending } = authClient.useSession()

  if (isPending) {
    return null
  }

  if (session?.user) {
    return (
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/dashboard"
          className="group inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-black hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
        >
          Go to Dashboard
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
        </Link>
      </div>
    )
  }

  return (
    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
      <Link
        href="/signup"
        className="group inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-black hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
      >
        Start for Free
        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
      </Link>
      <Link
        href="/login"
        className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-800 transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-400 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
      >
        Sign In
      </Link>
    </div>
  )
}

export default HomeHeroActions
