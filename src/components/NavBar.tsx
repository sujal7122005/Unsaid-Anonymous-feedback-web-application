'use client'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { authClient } from '../lib/auth-client'
import toast from 'react-hot-toast'
import { LogOut } from 'lucide-react'
import Logo from './Logo'
const NAV_ITEMS = [
  { href: '/', label: 'Home' },
  { href: '/#how-it-works', label: 'How It Works' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
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

  return (
    <div className="w-full bg-[#131313] border-b border-[#313131] px-4 py-4 sm:px-6 lg:px-8">
      <header className="mx-auto flex w-full max-w-[1280px] items-center justify-between">
        
        {/* Brand Logo */}
        <Link href="/" className="group transition-transform hover:scale-[1.02]">
          <Logo />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-6 md:flex">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`font-mono-caps text-[12px] verge-link ${
                  active ? 'text-white border-b-[2px] border-[#3cffd0] pb-1' : 'text-[#949494]'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Auth Actions */}
        <div className="flex items-center gap-3">
          {!isPending && (
            <>
              {session?.user ? (
                <>
                  <div className="hidden sm:flex items-center gap-2 rounded-full border border-[#313131] bg-[#1a1a1a] pl-1 pr-3 py-1">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#3cffd0] text-[#000000] font-bold text-[10px] font-mono-caps">
                      {session.user.name ? session.user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <span className="font-mono-caps text-[10px] text-white">
                      {session.user.name?.toUpperCase() || 'USER'}
                    </span>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-1.5 rounded-[24px] border border-[#ffffff] bg-transparent px-4 py-1.5 font-mono-caps text-[10px] text-white transition-colors hover:bg-white hover:text-black"
                  >
                    <LogOut className="h-3 w-3" />
                    SIGN OUT
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="hidden sm:block font-mono-caps text-[12px] text-[#949494] verge-link"
                  >
                    SIGN IN
                  </Link>
                  <Link
                    href="/signup"
                    className="jelly-mint-pill"
                  >
                    GET STARTED
                  </Link>
                </>
              )}
            </>
          )}
        </div>
      </header>

      {/* Mobile Nav */}
      <div className="mt-4 flex overflow-x-auto pb-2 md:hidden">
        <nav className="flex items-center gap-6">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
            return (
              <Link
                key={`${item.href}-mobile`}
                href={item.href}
                className={`shrink-0 font-mono-caps text-[12px] verge-link ${
                  active ? 'text-white border-b-[2px] border-[#3cffd0] pb-1' : 'text-[#949494]'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}

export default NavBar