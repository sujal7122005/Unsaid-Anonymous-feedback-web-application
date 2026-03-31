'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { authClient } from '../lib/auth-client'
import toast from 'react-hot-toast'

function NavBar() {
    const router = useRouter()
    const pathname = usePathname()
    const { data: session, isPending } = authClient.useSession()

  const shouldHideNavBar =
    pathname === '/signup' ||
    pathname === '/login' ||
    pathname.startsWith('/verify-email')

  if (shouldHideNavBar) {
    return null
  }

    async function handleSignOut(){
        try {
            const result = await authClient.signOut()

            if (result?.error) {
                toast.error(result.error.message || 'Failed to sign out', { duration: 2000 })
                return
            }

            toast.success('Signed out successfully', { duration: 2000 })
            router.push('/login')
            router.refresh()
        } catch {
            toast.error('Failed to sign out', { duration: 2000 })
        }
    }

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200/80 bg-white/75 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="group inline-flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-gray-300 bg-white text-sm font-black tracking-widest text-black shadow-sm transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-md">
            U
          </span>
          <div className="leading-tight">
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gray-500">Unsaid</p>
            <p className="text-sm font-bold text-black">Anonymous Feedback</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 rounded-full border border-gray-200 bg-white/90 p-1 shadow-sm md:flex">
          <Link
            href="/"
            className="rounded-full px-4 py-2 text-sm font-semibold text-gray-600 transition-all duration-200 hover:bg-gray-100 hover:text-black"
          >
            Home
          </Link>
          <Link
            href="/dashboard"
            className="rounded-full px-4 py-2 text-sm font-semibold text-gray-600 transition-all duration-200 hover:bg-gray-100 hover:text-black"
          >
            Dashboard
          </Link>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          {!isPending && (
            <>
              {session?.user ? (
                <>
                  <div className="hidden items-center gap-2 rounded-full border border-gray-200 bg-white/90 px-3 py-1.5 shadow-sm sm:inline-flex">
                    <span className="h-2 w-2 rounded-full bg-green-500" />
                    <span className="max-w-32 truncate text-sm font-semibold text-gray-700">{session.user.name}</span>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:-translate-y-px hover:bg-gray-900 hover:shadow-lg"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/signup"
                    className="hidden rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-black shadow-sm transition-all duration-200 hover:-translate-y-px hover:border-gray-300 hover:shadow-md sm:inline-flex"
                  >
                    Sign Up
                  </Link>
                  <Link
                    href="/login"
                    className="rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:-translate-y-px hover:bg-gray-900 hover:shadow-lg"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export default NavBar