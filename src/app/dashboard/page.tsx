'use client'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import MessageCard from '@/src/components/MessageCard'
import { authClient } from '@/src/lib/auth-client'
import { Copy, Loader2, Plus, RefreshCcw, Trash2 } from 'lucide-react'
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

  const [acceptMessages, setAcceptMessages] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSwitchLoading, setIsSwitchLoading] = useState(false)
  const [isCustomLinksLoading, setIsCustomLinksLoading] = useState(false)
  const [isCreateLinkLoading, setIsCreateLinkLoading] = useState(false)
  const [deletingLinkId, setDeletingLinkId] = useState<string | null>(null)

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
  const activeCustomLink = customLinks.find((link) => link.id === activeInbox)

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
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-10">
      <section className="rounded-2xl border border-slate-300 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-black text-slate-900 sm:text-3xl">
          {session.user.name} Dashboard
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Manage your general link and up to {MAX_CUSTOM_LINKS} custom feedback links.
        </p>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-300 bg-white p-5">
          <p className="text-xs font-semibold tracking-[0.16em] text-slate-500 uppercase">
            General Link
          </p>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row">
            <input
              value={profileUrl}
              disabled
              className="h-10 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 text-sm text-slate-700"
            />
            <Button
              className="h-10"
              onClick={() => copyToClipboard(profileUrl, 'General link copied!')}
            >
              <Copy className="h-4 w-4" />
              Copy
            </Button>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-300 bg-white p-5">
          <p className="text-xs font-semibold tracking-[0.16em] text-slate-500 uppercase">
            Message Mode
          </p>
          <div className="mt-4 flex items-center justify-between rounded-xl border border-slate-300 bg-slate-50 p-3">
            <span className="text-sm font-semibold text-slate-800">Accept Anonymous Messages</span>
            <Switch
              checked={acceptMessages}
              onCheckedChange={handleSwitchChange}
              disabled={isSwitchLoading}
            />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-300 bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold tracking-[0.16em] text-slate-500 uppercase">
              Custom Links
            </p>
            <h2 className="text-xl font-black text-slate-900">Product Links</h2>
          </div>
          <span className="rounded-full border border-slate-300 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
            {customLinks.length}/{MAX_CUSTOM_LINKS} used
          </span>
        </div>

        <form onSubmit={handleCreateCustomLink} className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input
            value={customProductName}
            onChange={(event) => setCustomProductName(event.target.value)}
            placeholder="Product name"
            className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700"
          />
          <Button type="submit" disabled={isCreateLinkLoading || customLinks.length >= MAX_CUSTOM_LINKS}>
            {isCreateLinkLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            Create
          </Button>
        </form>

        {isCustomLinksLoading ? (
          <p className="mt-4 text-sm text-slate-600">Loading custom links...</p>
        ) : customLinks.length > 0 ? (
          <div className="mt-4 grid gap-3 lg:grid-cols-2">
            {customLinks.map((link) => {
              const customUrl = `${baseUrl}/u/${encodedUsername}/p/${encodeURIComponent(link.slug)}`

              return (
                <div key={link.id} className="rounded-xl border border-slate-300 bg-slate-50 p-3">
                  <p className="text-sm font-bold text-slate-900">{link.productName}</p>
                  <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                    <input
                      value={customUrl}
                      disabled
                      className="h-9 w-full rounded-lg border border-slate-300 bg-white px-3 text-xs text-slate-700"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="h-9"
                      onClick={() => copyToClipboard(customUrl, `${link.productName} link copied!`)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      className="h-9"
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
                </div>
              )
            })}
          </div>
        ) : (
          <p className="mt-4 text-sm text-slate-600">No custom links created yet.</p>
        )}
      </section>

      <section className="rounded-2xl border border-slate-300 bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold tracking-[0.16em] text-slate-500 uppercase">Inbox</p>
            <h2 className="text-xl font-black text-slate-900">
              {activeInbox === 'general' ? 'General Inbox' : activeCustomLink?.productName || 'Custom Inbox'}
            </h2>
          </div>
          <Button variant="outline" onClick={() => fetchMessages(true, activeInbox)}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCcw className="h-4 w-4" />}
            Refresh
          </Button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveInbox('general')}
            className={`rounded-full border px-3 py-1 text-xs font-semibold ${
              activeInbox === 'general'
                ? 'border-slate-900 bg-slate-900 text-white'
                : 'border-slate-300 bg-white text-slate-700'
            }`}
          >
            General
          </button>
          {customLinks.map((link) => (
            <button
              key={link.id}
              type="button"
              onClick={() => setActiveInbox(link.id)}
              className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                activeInbox === link.id
                  ? 'border-slate-900 bg-slate-900 text-white'
                  : 'border-slate-300 bg-white text-slate-700'
              }`}
            >
              {link.productName}
            </button>
          ))}
        </div>

        <Separator className="my-4" />

        {isLoading ? (
          <p className="text-sm text-slate-600">Loading messages...</p>
        ) : messages.length > 0 ? (
          <div className="grid gap-4 lg:grid-cols-2">
            {messages.map((message, index) => (
              <MessageCard
                key={message._id ?? `${message.createdAt}-${index}`}
                message={message}
                onMessageDelete={handleDeleteMessage}
              />
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-600">No messages in this inbox yet.</p>
        )}
      </section>
    </div>
  )
}

export default DashboardPage
