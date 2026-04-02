'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { authClient } from '../lib/auth-client'
import toast from 'react-hot-toast'
import { House, LayoutDashboard, LogOut, UserRound } from 'lucide-react'

const NAV_ITEMS = [
  {
    href: '/',
    label: 'Home',
    icon: House,
  },
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
]

function NavBar() {
  const pathname = usePathname()
  const { data: session, isPending } = authClient.useSession()

  const shouldHideNavBar =
    pathname === '/signup' ||
    pathname === '/login' ||
    pathname.startsWith('/verify-email') ||
    pathname.startsWith('/u/')

  if (shouldHideNavBar) {
    return null
  }

  async function handleSignOut() {
    try {
      const result = await authClient.signOut()

      if (result?.error) {
        toast.error(result.error.message || 'Failed to sign out', { duration: 2000 })
        return
      }

      toast.success('Signed out successfully', { duration: 3000 })
      window.location.assign('/')
    } catch {
      toast.error('Failed to sign out', { duration: 2000 })
    }
  }

  function isItemActive(href: string) {
    if (href === '/') {
      return pathname === '/'
    }

    return pathname.startsWith(href)
  }

  const displayName = session?.user?.name || 'User'
  const avatarLabel = displayName.charAt(0).toUpperCase()

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/75 backdrop-blur-xl">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-linear-to-r from-cyan-100/35 via-white/0 to-amber-100/35"
      />

      <div className="relative mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="group inline-flex items-center gap-3 rounded-2xl px-1 py-1 transition-all duration-300 hover:bg-white/70">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-linear-to-br from-slate-900 to-slate-700 text-sm font-black tracking-widest text-white shadow-[0_10px_28px_-18px_rgba(0,0,0,0.85)] transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-[0_14px_28px_-18px_rgba(0,0,0,0.95)]">
            U
          </span>
          <div className="leading-tight">
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-500">Unsaid</p>
            <p className="text-sm font-bold text-slate-900">Anonymous Feedback</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 rounded-full border border-slate-200 bg-white/90 p-1 shadow-sm md:flex">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            const active = isItemActive(item.href)

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                  active
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          {!isPending && (
            <>
              {session?.user ? (
                <>
                  <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white/95 px-2.5 py-1.5 shadow-sm sm:inline-flex">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-xs font-black text-slate-700">
                      {avatarLabel}
                    </span>
                    <span className="max-w-32 truncate text-sm font-semibold text-slate-700">{displayName}</span>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-px hover:bg-black hover:shadow-lg"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/signup"
                    className="hidden rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm transition-all duration-300 hover:-translate-y-px hover:border-slate-300 hover:shadow-md sm:inline-flex"
                  >
                    Sign Up
                  </Link>
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-px hover:bg-black hover:shadow-lg"
                  >
                    <UserRound className="h-3.5 w-3.5" />
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