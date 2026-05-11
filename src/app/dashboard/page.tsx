'use client'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import MessageCard from '@/src/components/MessageCard'
import { authClient } from '@/src/lib/auth-client'
import {
  ArrowRight,
  Copy,
  Inbox,
  Link2,
  Loader2,
  Plus,
  RefreshCcw,
  ShieldCheck,
  Sparkles,
  Trash2,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'

type MessageCardData = {
  _id?: string
  content: string
  createdAt: string | Date
}

type CustomLinkData = {
  id: string
  productName: string
  slug: string
  createdAt: string | Date
}

const MAX_CUSTOM_LINKS = 2

function DashboardPage() {
  const [messages, setMessages] = useState<MessageCardData[]>([])
  const [customLinks, setCustomLinks] = useState<CustomLinkData[]>([])
  const [activeInbox, setActiveInbox] = useState<string>('general')
  const [customProductName, setCustomProductName] = useState('')
  const [publicFeedToken, setPublicFeedToken] = useState<string | null>(null)

  const [acceptMessages, setAcceptMessages] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSwitchLoading, setIsSwitchLoading] = useState(false)
  const [isCustomLinksLoading, setIsCustomLinksLoading] = useState(false)
  const [isCreateLinkLoading, setIsCreateLinkLoading] = useState(false)
  const [deletingLinkId, setDeletingLinkId] = useState<string | null>(null)
  const [isPublicFeedLoading, setIsPublicFeedLoading] = useState(false)
  const [isPublicFeedRegenerating, setIsPublicFeedRegenerating] = useState(false)

  const router = useRouter()
  const { data: session, isPending } = authClient.useSession()

  useEffect(() => {
    if (!session && !isPending) {
      router.replace('/login')
    }
  }, [session, isPending, router])

  useEffect(() => {
    if (session && !isPending) {
      fetchStatusAcceptMessages()
      fetchCustomLinks()
      fetchPublicFeedToken()
    }
  }, [session, isPending])

  const copyToClipboard = async (value: string, successMessage: string) => {
    if (!value) {
      toast.error('Link is not ready yet', { duration: 2000 })
      return
    }

    try {
      await navigator.clipboard.writeText(value)
      toast.success(successMessage, { duration: 2000 })
    } catch {
      toast.error('Could not copy link', { duration: 2000 })
    }
  }

  const fetchStatusAcceptMessages = async () => {
    setIsSwitchLoading(true)
    try {
      const response = await fetch('/api/Accepting-Messages')
      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to fetch settings')
      }

      setAcceptMessages(Boolean(data.isAcceptingMessages))
    } catch {
      toast.error('Failed to fetch settings', { duration: 2000 })
    } finally {
      setIsSwitchLoading(false)
    }
  }

  const fetchCustomLinks = async () => {
    setIsCustomLinksLoading(true)
    try {
      const response = await fetch('/api/Custom-Links')
      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to fetch custom links')
      }

      const links = Array.isArray(data.customLinks) ? data.customLinks : []
      setCustomLinks(links)

      setActiveInbox((previousInbox) => {
        if (previousInbox === 'general') {
          return previousInbox
        }

        const exists = links.some((link: CustomLinkData) => link.id === previousInbox)
        return exists ? previousInbox : 'general'
      })
    } catch {
      toast.error('Failed to fetch custom links', { duration: 2000 })
    } finally {
      setIsCustomLinksLoading(false)
    }
  }

  const fetchPublicFeedToken = async () => {
    setIsPublicFeedLoading(true)

    try {
      const response = await fetch('/api/Public-Feed')
      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to fetch public feed token')
      }

      setPublicFeedToken(data.publicFeedToken || null)
    } catch {
      toast.error('Failed to fetch public feed token', { duration: 2000 })
    } finally {
      setIsPublicFeedLoading(false)
    }
  }

  const handleRegeneratePublicFeedToken = async () => {
    setIsPublicFeedRegenerating(true)

    try {
      const response = await fetch('/api/Public-Feed', { method: 'POST' })
      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to regenerate token')
      }

      setPublicFeedToken(data.publicFeedToken || null)
      toast.success('Public feed token regenerated', { duration: 2000 })
    } catch {
      toast.error('Failed to regenerate token', { duration: 2000 })
    } finally {
      setIsPublicFeedRegenerating(false)
    }
  }

  const fetchMessages = useCallback(
    async (refresh: boolean = false, inboxTarget: string = activeInbox) => {
      setIsLoading(true)

      try {
        const query = new URLSearchParams()

        if (inboxTarget === 'general') {
          query.set('inbox', 'general')
        } else {
          query.set('inbox', 'custom')
          query.set('customLinkId', inboxTarget)
        }

        const response = await fetch(`/api/Get-Messages?${query.toString()}`)
        const data = await response.json()

        if (response.status === 404) {
          setMessages([])
          return
        }

        if (!response.ok || !data.success) {
          throw new Error(data.message || 'Failed to fetch messages')
        }

        setMessages(Array.isArray(data.messages) ? data.messages : [])

        if (refresh) {
          toast.success('Messages refreshed!', { duration: 2000 })
        }
      } catch {
        toast.error('Failed to fetch messages', { duration: 2000 })
      } finally {
        setIsLoading(false)
      }
    },
    [activeInbox],
  )

  useEffect(() => {
    if (session && !isPending) {
      fetchMessages()
    }
  }, [session, isPending, fetchMessages])

  if (!session) {
    return null
  }

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
  const encodedUsername = encodeURIComponent(session.user.name ?? '')
  const profileUrl = `${baseUrl}/u/${encodedUsername}`
  const publicFeedUrl = publicFeedToken
    ? `${baseUrl}/u/${encodedUsername}/messages?token=${encodeURIComponent(publicFeedToken)}`
    : ''
  const activeCustomLink = customLinks.find((link) => link.id === activeInbox)
  const totalInboxes = 1 + customLinks.length
  const customLinksRemaining = Math.max(0, MAX_CUSTOM_LINKS - customLinks.length)
  const inboxTitle =
    activeInbox === 'general' ? 'General Inbox' : activeCustomLink?.productName || 'Custom Inbox'

  const handleCreateCustomLink = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const productName = customProductName.trim()

    if (productName.length < 2) {
      toast.error('Product name must be at least 2 characters', { duration: 2000 })
      return
    }

    if (customLinks.length >= MAX_CUSTOM_LINKS) {
      toast.error(`You can create up to ${MAX_CUSTOM_LINKS} custom links`, { duration: 2000 })
      return
    }

    setIsCreateLinkLoading(true)

    try {
      const response = await fetch('/api/Custom-Links', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productName }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to create custom link')
      }

      setCustomProductName('')
      toast.success(data.message || 'Custom link created', { duration: 2000 })

      await fetchCustomLinks()
      if (data.customLink?.id) {
        setActiveInbox(data.customLink.id)
      }
    } catch {
      toast.error('Failed to create custom link', { duration: 2000 })
    } finally {
      setIsCreateLinkLoading(false)
    }
  }

  const handleDeleteCustomLink = async (link: CustomLinkData) => {
    const shouldDelete = window.confirm(
      `Delete ${link.productName} link? This will remove messages in that custom inbox.`,
    )

    if (!shouldDelete) {
      return
    }

    setDeletingLinkId(link.id)

    try {
      const response = await fetch('/api/Custom-Links', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ linkId: link.id }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to delete custom link')
      }

      toast.success(data.message || 'Custom link deleted', { duration: 2000 })

      const nextInbox = activeInbox === link.id ? 'general' : activeInbox
      setActiveInbox(nextInbox)
      await fetchCustomLinks()

      if (nextInbox === 'general') {
        await fetchMessages(false, 'general')
      }
    } catch {
      toast.error('Failed to delete custom link', { duration: 2000 })
    } finally {
      setDeletingLinkId(null)
    }
  }

  const handleSwitchChange = async (checked: boolean) => {
    setIsSwitchLoading(true)
    try {
      const response = await fetch('/api/Accepting-Messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ acceptingMessages: checked }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to update settings')
      }

      const updatedValue =
        typeof data.userData?.isAcceptingMessages === 'boolean'
          ? data.userData.isAcceptingMessages
          : checked

      setAcceptMessages(updatedValue)
      toast.success('Preferences updated!', { duration: 2000 })
    } catch {
      toast.error('Failed to update settings', { duration: 2000 })
    } finally {
      setIsSwitchLoading(false)
    }
  }

  const handleDeleteMessage = (messageId?: string) => {
    if (!messageId) return
    setMessages((prev) => prev.filter((message) => message._id !== messageId))
  }

  return (
    <div className="relative min-h-[calc(100vh-4rem)] bg-[#f2f5f9] py-8 sm:py-10">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-12 -left-16 h-64 w-64 rounded-full bg-cyan-100/75 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-24 -right-20 h-72 w-72 rounded-full bg-indigo-100/70 blur-3xl"
      />

      <div className="mx-auto max-w-7xl space-y-6 px-4 sm:px-6 lg:px-10">
        <section className="rounded-3xl border border-slate-200/90 bg-white/90 p-6 shadow-[0_18px_45px_-32px_rgba(15,23,42,0.35)] backdrop-blur-sm sm:p-8">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold tracking-[0.14em] text-slate-600 uppercase">
                <Sparkles className="h-3.5 w-3.5" />
                Workspace Overview
              </p>
              <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                {session.user.name} Dashboard
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-600 sm:text-base">
                Manage your profile link, control anonymous message intake, and organize product-specific inboxes in one professional workspace.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-xs font-semibold tracking-[0.12em] text-slate-500 uppercase">Total Inboxes</p>
                <p className="mt-1 text-2xl font-black text-slate-900">{totalInboxes}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-xs font-semibold tracking-[0.12em] text-slate-500 uppercase">Custom Links</p>
                <p className="mt-1 text-2xl font-black text-slate-900">
                  {customLinks.length}/{MAX_CUSTOM_LINKS}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-xs font-semibold tracking-[0.12em] text-slate-500 uppercase">Message Mode</p>
                <p className="mt-1 text-2xl font-black text-slate-900">
                  {acceptMessages ? 'On' : 'Off'}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 xl:grid-cols-[1.25fr_0.75fr]">
          <article className="rounded-3xl border border-slate-200/90 bg-white/90 p-6 shadow-[0_16px_35px_-28px_rgba(15,23,42,0.35)] backdrop-blur-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold tracking-[0.14em] text-slate-500 uppercase">General Link</p>
                <h2 className="mt-1 text-xl font-black text-slate-900">Public Profile URL</h2>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                <ShieldCheck className="h-3.5 w-3.5" />
                Active
              </span>
            </div>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <input
                value={profileUrl}
                disabled
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700"
              />
              <Button
                className="h-11 px-4"
                onClick={() => copyToClipboard(profileUrl, 'General link copied!')}
              >
                <Copy className="h-4 w-4" />
                Copy Link
              </Button>
            </div>
          </article>

          <article className="rounded-3xl border border-slate-200/90 bg-white/90 p-6 shadow-[0_16px_35px_-28px_rgba(15,23,42,0.35)] backdrop-blur-sm">
            <p className="text-xs font-semibold tracking-[0.14em] text-slate-500 uppercase">Message Mode</p>
            <h2 className="mt-1 text-xl font-black text-slate-900">Anonymous Intake</h2>

            <div className="mt-4 flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div>
                <p className="text-sm font-bold text-slate-900">Accept Anonymous Messages</p>
                <p className="text-xs text-slate-600">
                  {acceptMessages ? 'Your inbox is open to new anonymous messages.' : 'Your inbox is paused for new anonymous messages.'}
                </p>
              </div>
              <Switch
                checked={acceptMessages}
                onCheckedChange={handleSwitchChange}
                disabled={isSwitchLoading}
              />
            </div>
          </article>
        </section>

        <section className="rounded-3xl border border-slate-200/90 bg-white/90 p-6 shadow-[0_16px_35px_-28px_rgba(15,23,42,0.35)] backdrop-blur-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold tracking-[0.14em] text-slate-500 uppercase">Public JSON Feed</p>
              <h2 className="mt-1 text-2xl font-black text-slate-900">Embeddable Messages Endpoint</h2>
              <p className="mt-1 text-sm text-slate-600">
                Use this link to fetch your latest 10 anonymous messages for external websites.
              </p>
            </div>
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
              Rate limited
            </span>
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <input
              value={isPublicFeedLoading ? 'Loading...' : publicFeedUrl}
              disabled
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700"
            />
            <Button
              className="h-11 px-4"
              onClick={() => copyToClipboard(publicFeedUrl, 'Public feed link copied!')}
              disabled={isPublicFeedLoading}
            >
              <Copy className="h-4 w-4" />
              Copy Feed Link
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-11 border-slate-300 bg-white px-4 text-slate-700 hover:bg-slate-100"
              onClick={handleRegeneratePublicFeedToken}
              disabled={isPublicFeedRegenerating}
            >
              {isPublicFeedRegenerating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCcw className="h-4 w-4" />
              )}
              Regenerate
            </Button>
          </div>

          <p className="mt-3 text-xs text-slate-600">
            Keep this link private. Regenerating the token will disable the previous link.
          </p>
        </section>

        <section className="rounded-3xl border border-slate-200/90 bg-white/90 p-6 shadow-[0_16px_35px_-28px_rgba(15,23,42,0.35)] backdrop-blur-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold tracking-[0.14em] text-slate-500 uppercase">Custom Links</p>
              <h2 className="mt-1 text-2xl font-black text-slate-900">Product-specific Inboxes</h2>
              <p className="mt-1 text-sm text-slate-600">
                Create targeted links to collect feedback for specific products, launches, or campaigns.
              </p>
            </div>
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
              {customLinks.length}/{MAX_CUSTOM_LINKS} used • {customLinksRemaining} left
            </span>
          </div>

          <form onSubmit={handleCreateCustomLink} className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto]">
            <input
              value={customProductName}
              onChange={(event) => setCustomProductName(event.target.value)}
              placeholder="e.g. Portfolio Website, SaaS Beta, Resume"
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700"
            />
            <Button
              type="submit"
              className="h-11 px-4"
              disabled={isCreateLinkLoading || customLinks.length >= MAX_CUSTOM_LINKS}
            >
              {isCreateLinkLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              Create Link
            </Button>
          </form>

          {isCustomLinksLoading ? (
            <p className="mt-4 text-sm text-slate-600">Loading custom links...</p>
          ) : customLinks.length > 0 ? (
            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              {customLinks.map((link) => {
                const customUrl = `${baseUrl}/u/${encodedUsername}/p/${encodeURIComponent(link.slug)}`

                return (
                  <article key={link.id} className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-base font-black text-slate-900">{link.productName}</p>
                        <p className="mt-0.5 inline-flex items-center gap-1 text-xs font-medium text-slate-600">
                          <Link2 className="h-3.5 w-3.5" />
                          /p/{link.slug}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setActiveInbox(link.id)}
                        className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                          activeInbox === link.id
                            ? 'border-slate-900 bg-slate-900 text-white'
                            : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400'
                        }`}
                      >
                        {activeInbox === link.id ? 'Active Inbox' : 'Open Inbox'}
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                      <input
                        value={customUrl}
                        disabled
                        className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-700"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        className="h-10 border-slate-300 bg-white px-3 text-slate-700 hover:bg-slate-100"
                        onClick={() => copyToClipboard(customUrl, `${link.productName} link copied!`)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        className="h-10 px-3"
                        onClick={() => handleDeleteCustomLink(link)}
                        disabled={deletingLinkId === link.id}
                      >
                        {deletingLinkId === link.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </article>
                )
              })}
            </div>
          ) : (
            <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-600">
              No custom links created yet. Create your first product link to start collecting focused feedback.
            </div>
          )}
        </section>

        <section className="rounded-3xl border border-slate-200/90 bg-white/90 p-6 shadow-[0_16px_35px_-28px_rgba(15,23,42,0.35)] backdrop-blur-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold tracking-[0.14em] text-slate-500 uppercase">Inbox</p>
              <h2 className="mt-1 text-2xl font-black text-slate-900">{inboxTitle}</h2>
              <p className="mt-1 text-sm text-slate-600">
                {isLoading ? 'Refreshing messages...' : `${messages.length} message${messages.length === 1 ? '' : 's'} currently visible`}
              </p>
            </div>
            <Button
              variant="outline"
              className="h-10"
              onClick={() => fetchMessages(true, activeInbox)}
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCcw className="h-4 w-4" />}
              Refresh
            </Button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setActiveInbox('general')}
              className={`inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                activeInbox === 'general'
                  ? 'border-slate-900 bg-slate-900 text-white'
                  : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400'
              }`}
            >
              <Inbox className="h-3.5 w-3.5" />
              General
            </button>
            {customLinks.map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => setActiveInbox(link.id)}
                className={`inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                  activeInbox === link.id
                    ? 'border-slate-900 bg-slate-900 text-white'
                    : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400'
                }`}
              >
                <Link2 className="h-3.5 w-3.5" />
                {link.productName}
              </button>
            ))}
          </div>

          <Separator className="my-5 bg-slate-200" />

          {isLoading ? (
            <p className="text-sm text-slate-600">Loading messages...</p>
          ) : messages.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {messages.map((message, index) => (
                <MessageCard
                  key={message._id ?? `${message.createdAt}-${index}`}
                  message={message}
                  onMessageDelete={handleDeleteMessage}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-600">
              No messages in this inbox yet. Share your link to start receiving anonymous feedback.
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

export default DashboardPage
