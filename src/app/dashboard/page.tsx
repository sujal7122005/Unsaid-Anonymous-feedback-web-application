'use client'

import { Switch } from '@/components/ui/switch'
import MessageCard from '@/src/components/MessageCard'
import { authClient } from '@/src/lib/auth-client'
import {
  ArrowRight,
  Bell,
  BellOff,
  Copy,
  Inbox,
  Link2,
  Loader2,
  Plus,
  RefreshCcw,
  ShieldCheck,
  Sparkles,
  Star,
  Trash2,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'

type MessageCardData = {
  _id?: string
  content: string
  createdAt: string | Date
  sentiment?: string
  isStarred?: boolean
}

type CustomLinkData = {
  id: string
  productName: string
  slug: string
  createdAt: string | Date
}

type SentimentSummary = {
  positive: number
  constructive: number
  negative: number
  neutral: number
}

const MAX_CUSTOM_LINKS = 2

const SENTIMENT_COLORS: Record<string, string> = {
  positive: '#3cffd0',
  constructive: '#fef08a',
  negative: '#5200ff',
  neutral: '#949494',
}

function DashboardPage() {
  const [messages, setMessages] = useState<MessageCardData[]>([])
  const [customLinks, setCustomLinks] = useState<CustomLinkData[]>([])
  const [activeInbox, setActiveInbox] = useState<string>('general')
  const [customProductName, setCustomProductName] = useState('')
  const [publicFeedToken, setPublicFeedToken] = useState<string | null>(null)

  const [acceptMessages, setAcceptMessages] = useState(false)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [sentimentSummary, setSentimentSummary] = useState<SentimentSummary>({ positive: 0, constructive: 0, negative: 0, neutral: 0 })
  const [sentimentFilter, setSentimentFilter] = useState<string | null>(null)
  const [starredFilter, setStarredFilter] = useState(false)

  const [isLoading, setIsLoading] = useState(false)
  const [isSwitchLoading, setIsSwitchLoading] = useState(false)
  const [isEmailSwitchLoading, setIsEmailSwitchLoading] = useState(false)
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
      fetchEmailNotifications()
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

  const fetchEmailNotifications = async () => {
    try {
      const response = await fetch('/api/Email-Notifications')
      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to fetch email settings')
      }

      setEmailNotifications(Boolean(data.emailNotifications))
    } catch {
      // Default to true on failure
      setEmailNotifications(true)
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

        if (starredFilter) {
          query.set('starred', 'true')
        }

        if (sentimentFilter) {
          query.set('sentiment', sentimentFilter)
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

        if (data.sentimentSummary) {
          setSentimentSummary(data.sentimentSummary)
        }

        if (refresh) {
          toast.success('Messages refreshed!', { duration: 2000 })
        }
      } catch {
        toast.error('Failed to fetch messages', { duration: 2000 })
      } finally {
        setIsLoading(false)
      }
    },
    [activeInbox, starredFilter, sentimentFilter],
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

  // Sentiment summary calculations
  const totalSentimentMessages = sentimentSummary.positive + sentimentSummary.constructive + sentimentSummary.negative + sentimentSummary.neutral
  const sentimentPercentage = (type: keyof SentimentSummary) => {
    if (totalSentimentMessages === 0) return 0
    return Math.round((sentimentSummary[type] / totalSentimentMessages) * 100)
  }

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

  const handleEmailNotificationChange = async (checked: boolean) => {
    setIsEmailSwitchLoading(true)
    try {
      const response = await fetch('/api/Email-Notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emailNotifications: checked }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to update email settings')
      }

      setEmailNotifications(Boolean(data.emailNotifications))
      toast.success(data.message || 'Email settings updated!', { duration: 2000 })
    } catch {
      toast.error('Failed to update email settings', { duration: 2000 })
    } finally {
      setIsEmailSwitchLoading(false)
    }
  }

  const handleDeleteMessage = (messageId?: string) => {
    if (!messageId) return
    setMessages((prev) => prev.filter((message) => message._id !== messageId))
  }

  const handleStarToggle = (messageId: string, newState: boolean) => {
    setMessages((prev) =>
      prev.map((message) =>
        message._id === messageId ? { ...message, isStarred: newState } : message
      )
    )
  }

  return (
    <div className="relative min-h-[calc(100vh-80px)] bg-[#131313] py-12">
      <div className="mx-auto max-w-7xl space-y-12 px-4 sm:px-6 lg:px-10">
        
        {/* Workspace Overview */}
        <section className="rounded-[20px] border border-[#313131] bg-[#131313] p-8">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <p className="inline-flex items-center gap-2 rounded-[2px] border border-[#313131] bg-[#131313] px-3 py-1 font-mono-caps text-[10px] text-[#3cffd0]">
                <Sparkles className="h-3.5 w-3.5" />
                WORKSPACE OVERVIEW
              </p>
              <h1 className="mt-4 font-display text-[60px] sm:text-[70px] uppercase text-white leading-[0.9]">
                {session.user.name} DASHBOARD
              </h1>
              <p className="mt-2 max-w-2xl font-mono-caps text-[12px] text-[#949494] leading-relaxed">
                MANAGE YOUR PROFILE LINK, CONTROL ANONYMOUS MESSAGE INTAKE, AND ORGANIZE PRODUCT-SPECIFIC INBOXES IN ONE PROFESSIONAL WORKSPACE.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-[2px] border border-[#313131] bg-[#131313] px-4 py-3">
                <p className="font-mono-caps text-[10px] text-[#949494]">TOTAL INBOXES</p>
                <p className="mt-1 font-display text-[30px] text-white leading-none">{totalInboxes}</p>
              </div>
              <div className="rounded-[2px] border border-[#313131] bg-[#131313] px-4 py-3">
                <p className="font-mono-caps text-[10px] text-[#949494]">CUSTOM LINKS</p>
                <p className="mt-1 font-display text-[30px] text-white leading-none">
                  {customLinks.length}/{MAX_CUSTOM_LINKS}
                </p>
              </div>
              <div className="rounded-[2px] border border-[#313131] bg-[#131313] px-4 py-3">
                <p className="font-mono-caps text-[10px] text-[#949494]">MESSAGE MODE</p>
                <p className="mt-1 font-display text-[30px] text-[#3cffd0] leading-none">
                  {acceptMessages ? 'ON' : 'OFF'}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Settings Row: Profile URL + Message Mode + Email Alerts */}
        <section className="grid gap-8 xl:grid-cols-3">
          <article className="rounded-[20px] border border-[#313131] bg-[#131313] p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-mono-caps text-[11px] text-[#949494]">GENERAL LINK</p>
                <h2 className="mt-1 font-display text-[40px] uppercase text-white leading-[0.9]">PUBLIC PROFILE URL</h2>
              </div>
              <span className="inline-flex items-center gap-1 rounded-[2px] border border-[#3cffd0] bg-transparent px-2.5 py-1 font-mono-caps text-[10px] text-[#3cffd0]">
                <ShieldCheck className="h-3.5 w-3.5" />
                ACTIVE
              </span>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <input
                value={profileUrl}
                disabled
                className="h-11 w-full rounded-[2px] border border-[#313131] bg-[#131313] px-3 font-mono-caps text-[12px] text-[#949494]"
              />
              <button
                className="dark-slate-pill h-11 px-6 whitespace-nowrap flex items-center justify-center gap-2"
                onClick={() => copyToClipboard(profileUrl, 'General link copied!')}
              >
                <Copy className="h-4 w-4" />
                COPY LINK
              </button>
            </div>
          </article>

          <article className="rounded-[20px] border border-[#313131] bg-[#131313] p-8">
            <p className="font-mono-caps text-[11px] text-[#949494]">MESSAGE MODE</p>
            <h2 className="mt-1 font-display text-[40px] uppercase text-white leading-[0.9]">ANONYMOUS INTAKE</h2>

            <div className="mt-6 flex items-center justify-between rounded-[2px] border border-[#313131] bg-[#131313] p-4">
              <div>
                <p className="font-mono-caps text-[12px] text-white">ACCEPT ANONYMOUS MESSAGES</p>
                <p className="font-sans text-[12px] text-[#949494] mt-1">
                  {acceptMessages ? 'Your inbox is open to new messages.' : 'Your inbox is paused.'}
                </p>
              </div>
              <Switch
                checked={acceptMessages}
                onCheckedChange={handleSwitchChange}
                disabled={isSwitchLoading}
                className="data-[state=checked]:bg-[#3cffd0]"
              />
            </div>
          </article>

          <article className="rounded-[20px] border border-[#313131] bg-[#131313] p-8">
            <p className="font-mono-caps text-[11px] text-[#949494]">NOTIFICATIONS</p>
            <h2 className="mt-1 font-display text-[40px] uppercase text-white leading-[0.9]">EMAIL ALERTS</h2>

            <div className="mt-6 flex items-center justify-between rounded-[2px] border border-[#313131] bg-[#131313] p-4">
              <div className="flex items-center gap-3">
                {emailNotifications ? (
                  <Bell className="h-5 w-5 text-[#3cffd0]" />
                ) : (
                  <BellOff className="h-5 w-5 text-[#949494]" />
                )}
                <div>
                  <p className="font-mono-caps text-[12px] text-white">NEW MESSAGE EMAILS</p>
                  <p className="font-sans text-[12px] text-[#949494] mt-1">
                    {emailNotifications ? 'Get notified when a message arrives.' : 'Email alerts are paused.'}
                  </p>
                </div>
              </div>
              <Switch
                checked={emailNotifications}
                onCheckedChange={handleEmailNotificationChange}
                disabled={isEmailSwitchLoading}
                className="data-[state=checked]:bg-[#3cffd0]"
              />
            </div>
          </article>
        </section>

        {/* Public Feed Section */}
        <section className="rounded-[20px] border border-[#313131] bg-[#131313] p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-mono-caps text-[11px] text-[#949494]">PUBLIC JSON FEED</p>
              <h2 className="mt-1 font-display text-[40px] uppercase text-white leading-[0.9]">EMBEDDABLE MESSAGES ENDPOINT</h2>
              <p className="mt-1 font-mono-caps text-[11px] text-[#949494]">
                USE THIS LINK TO FETCH YOUR LATEST 10 ANONYMOUS MESSAGES FOR EXTERNAL WEBSITES.
              </p>
            </div>
            <span className="rounded-[2px] border border-[#313131] bg-transparent px-3 py-1 font-mono-caps text-[10px] text-[#949494]">
              RATE LIMITED
            </span>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <input
              value={isPublicFeedLoading ? 'LOADING...' : publicFeedUrl}
              disabled
              className="h-11 w-full rounded-[2px] border border-[#313131] bg-[#131313] px-3 font-mono-caps text-[12px] text-[#949494]"
            />
            <button
              className="dark-slate-pill h-11 px-6 flex items-center justify-center gap-2 whitespace-nowrap"
              onClick={() => copyToClipboard(publicFeedUrl, 'Public feed link copied!')}
              disabled={isPublicFeedLoading}
            >
              <Copy className="h-4 w-4" />
              COPY FEED LINK
            </button>
            <button
              type="button"
              className="h-11 border border-[#ffffff] rounded-[24px] bg-transparent px-6 font-mono-caps text-[11px] text-white hover:bg-[#ffffff] hover:text-black flex items-center justify-center gap-2 whitespace-nowrap transition-colors"
              onClick={handleRegeneratePublicFeedToken}
              disabled={isPublicFeedRegenerating}
            >
              {isPublicFeedRegenerating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCcw className="h-4 w-4" />
              )}
              REGENERATE
            </button>
          </div>

          <p className="mt-3 font-mono-caps text-[10px] text-[#5200ff]">
            KEEP THIS LINK PRIVATE. REGENERATING THE TOKEN WILL DISABLE THE PREVIOUS LINK.
          </p>
        </section>

        {/* Custom Links Section */}
        <section className="rounded-[20px] border border-[#313131] bg-[#131313] p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-mono-caps text-[11px] text-[#949494]">CUSTOM LINKS</p>
              <h2 className="mt-1 font-display text-[40px] uppercase text-white leading-[0.9]">PRODUCT-SPECIFIC INBOXES</h2>
              <p className="mt-1 font-mono-caps text-[11px] text-[#949494]">
                CREATE TARGETED LINKS TO COLLECT FEEDBACK FOR SPECIFIC PRODUCTS, LAUNCHES, OR CAMPAIGNS.
              </p>
            </div>
            <span className="rounded-[2px] border border-[#313131] bg-transparent px-3 py-1 font-mono-caps text-[10px] text-[#949494]">
              {customLinks.length}/{MAX_CUSTOM_LINKS} USED • {customLinksRemaining} LEFT
            </span>
          </div>

          <form onSubmit={handleCreateCustomLink} className="mt-6 grid gap-3 sm:grid-cols-[1fr_auto]">
            <input
              value={customProductName}
              onChange={(event) => setCustomProductName(event.target.value)}
              placeholder="E.G. PORTFOLIO WEBSITE, SAAS BETA, RESUME"
              className="h-11 w-full rounded-[2px] border border-[#313131] bg-[#131313] px-3 font-mono-caps text-[12px] text-white placeholder-[#313131] focus:border-[#3cffd0] focus:ring-0 outline-none transition-colors"
            />
            <button
              type="submit"
              className={`h-11 px-6 flex items-center justify-center gap-2 whitespace-nowrap transition-colors ${
                isCreateLinkLoading || customLinks.length >= MAX_CUSTOM_LINKS
                  ? "border border-[#313131] rounded-[24px] text-[#949494] font-mono-caps text-[11px] cursor-not-allowed bg-transparent"
                  : "jelly-mint-pill"
              }`}
              disabled={isCreateLinkLoading || customLinks.length >= MAX_CUSTOM_LINKS}
            >
              {isCreateLinkLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              CREATE LINK
            </button>
          </form>

          {isCustomLinksLoading ? (
            <p className="mt-4 font-mono-caps text-[11px] text-[#949494]">LOADING CUSTOM LINKS...</p>
          ) : customLinks.length > 0 ? (
            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              {customLinks.map((link) => {
                const customUrl = `${baseUrl}/u/${encodedUsername}/p/${encodeURIComponent(link.slug)}`

                return (
                  <article key={link.id} className="rounded-[2px] border border-[#313131] bg-[#131313] p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-display text-[24px] uppercase text-white leading-none">{link.productName}</p>
                        <p className="mt-2 inline-flex items-center gap-1 font-mono-caps text-[10px] text-[#949494]">
                          <Link2 className="h-3.5 w-3.5" />
                          /P/{link.slug.toUpperCase()}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setActiveInbox(link.id)}
                        className={`inline-flex items-center gap-1 rounded-[24px] border px-3 py-1 font-mono-caps text-[10px] transition-colors ${
                          activeInbox === link.id
                            ? 'border-[#3cffd0] bg-[#3cffd0] text-black'
                            : 'border-[#ffffff] bg-transparent text-white hover:bg-[#ffffff] hover:text-black'
                        }`}
                      >
                        {activeInbox === link.id ? 'ACTIVE INBOX' : 'OPEN INBOX'}
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                      <input
                        value={customUrl}
                        disabled
                        className="h-10 w-full rounded-[2px] border border-[#313131] bg-[#131313] px-3 font-mono-caps text-[10px] text-[#949494]"
                      />
                      <button
                        type="button"
                        className="h-10 border border-[#ffffff] rounded-[24px] bg-transparent px-4 font-mono-caps text-[10px] text-white hover:bg-[#ffffff] hover:text-black flex items-center justify-center transition-colors"
                        onClick={() => copyToClipboard(customUrl, `${link.productName} link copied!`)}
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        className="h-10 rounded-[24px] bg-[#5200ff] px-4 text-white hover:bg-[#5200ff]/80 flex items-center justify-center transition-colors disabled:opacity-50"
                        onClick={() => handleDeleteCustomLink(link)}
                        disabled={deletingLinkId === link.id}
                      >
                        {deletingLinkId === link.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </article>
                )
              })}
            </div>
          ) : (
            <div className="mt-6 rounded-[2px] border border-dashed border-[#313131] bg-[#131313] p-5 font-mono-caps text-[11px] text-[#949494] text-center">
              NO CUSTOM LINKS CREATED YET. CREATE YOUR FIRST PRODUCT LINK TO START COLLECTING FOCUSED FEEDBACK.
            </div>
          )}
        </section>

        {/* Messages Section */}
        <section className="rounded-[20px] border border-[#313131] bg-[#131313] p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-mono-caps text-[11px] text-[#949494]">INBOX</p>
              <h2 className="mt-1 font-display text-[40px] uppercase text-white leading-[0.9]">{inboxTitle}</h2>
              <p className="mt-1 font-mono-caps text-[11px] text-[#949494]">
                {isLoading ? 'REFRESHING MESSAGES...' : `${messages.length} MESSAGE${messages.length === 1 ? '' : 'S'} CURRENTLY VISIBLE`}
              </p>
            </div>
            <button
              className="h-10 border border-[#ffffff] rounded-[24px] bg-transparent px-6 font-mono-caps text-[11px] text-white hover:bg-[#ffffff] hover:text-black flex items-center justify-center gap-2 whitespace-nowrap transition-colors"
              onClick={() => fetchMessages(true, activeInbox)}
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCcw className="h-4 w-4" />}
              REFRESH
            </button>
          </div>

          {/* Sentiment Summary Bar */}
          {totalSentimentMessages > 0 && (
            <div className="mt-6 rounded-[2px] border border-[#313131] bg-[#131313] p-4">
              <p className="font-mono-caps text-[10px] text-[#949494] mb-3">SENTIMENT OVERVIEW</p>
              
              {/* Progress bar */}
              <div className="flex h-2 w-full overflow-hidden rounded-full bg-[#313131]">
                {sentimentSummary.positive > 0 && (
                  <div
                    className="h-full transition-all duration-300"
                    style={{ width: `${sentimentPercentage('positive')}%`, backgroundColor: '#3cffd0' }}
                  />
                )}
                {sentimentSummary.constructive > 0 && (
                  <div
                    className="h-full transition-all duration-300"
                    style={{ width: `${sentimentPercentage('constructive')}%`, backgroundColor: '#fef08a' }}
                  />
                )}
                {sentimentSummary.negative > 0 && (
                  <div
                    className="h-full transition-all duration-300"
                    style={{ width: `${sentimentPercentage('negative')}%`, backgroundColor: '#5200ff' }}
                  />
                )}
                {sentimentSummary.neutral > 0 && (
                  <div
                    className="h-full transition-all duration-300"
                    style={{ width: `${sentimentPercentage('neutral')}%`, backgroundColor: '#949494' }}
                  />
                )}
              </div>

              {/* Legend */}
              <div className="mt-3 flex flex-wrap gap-4">
                {(['positive', 'constructive', 'negative', 'neutral'] as const).map((type) => (
                  <div key={type} className="flex items-center gap-1.5">
                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: SENTIMENT_COLORS[type] }} />
                    <span className="font-mono-caps text-[10px] text-[#949494]">
                      {type.toUpperCase()} {sentimentPercentage(type)}% ({sentimentSummary[type]})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Inbox + Sentiment + Starred Filter Pills */}
          <div className="mt-6 flex flex-wrap gap-2">
            {/* Inbox filters */}
            <button
              type="button"
              onClick={() => { setActiveInbox('general'); setStarredFilter(false); setSentimentFilter(null) }}
              className={`inline-flex items-center gap-1 rounded-[24px] border px-4 py-1.5 font-mono-caps text-[11px] transition-colors ${
                activeInbox === 'general' && !starredFilter
                  ? 'border-[#3cffd0] bg-[#3cffd0] text-black'
                  : 'border-[#ffffff] bg-transparent text-white hover:bg-[#ffffff] hover:text-black'
              }`}
            >
              <Inbox className="h-3.5 w-3.5" />
              GENERAL
            </button>
            {customLinks.map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => { setActiveInbox(link.id); setStarredFilter(false); setSentimentFilter(null) }}
                className={`inline-flex items-center gap-1 rounded-[24px] border px-4 py-1.5 font-mono-caps text-[11px] transition-colors ${
                  activeInbox === link.id && !starredFilter
                    ? 'border-[#3cffd0] bg-[#3cffd0] text-black'
                    : 'border-[#ffffff] bg-transparent text-white hover:bg-[#ffffff] hover:text-black'
                }`}
              >
                <Link2 className="h-3.5 w-3.5" />
                {link.productName.toUpperCase()}
              </button>
            ))}

            {/* Divider */}
            <div className="w-px h-8 bg-[#313131] mx-1 self-center" />

            {/* Starred filter */}
            <button
              type="button"
              onClick={() => { setStarredFilter(!starredFilter); setSentimentFilter(null) }}
              className={`inline-flex items-center gap-1 rounded-[24px] border px-4 py-1.5 font-mono-caps text-[11px] transition-colors ${
                starredFilter
                  ? 'border-[#fef08a] bg-[#fef08a] text-black'
                  : 'border-[#313131] bg-transparent text-[#949494] hover:border-[#fef08a] hover:text-[#fef08a]'
              }`}
            >
              <Star className={`h-3.5 w-3.5 ${starredFilter ? 'fill-current' : ''}`} />
              STARRED
            </button>

            {/* Sentiment filters */}
            {(['positive', 'constructive', 'negative', 'neutral'] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => {
                  setSentimentFilter(sentimentFilter === type ? null : type)
                  setStarredFilter(false)
                }}
                className={`inline-flex items-center gap-1 rounded-[24px] border px-3 py-1.5 font-mono-caps text-[10px] transition-colors ${
                  sentimentFilter === type
                    ? `bg-transparent text-white`
                    : 'border-[#313131] bg-transparent text-[#949494] hover:text-white hover:border-[#949494]'
                }`}
                style={sentimentFilter === type ? { borderColor: SENTIMENT_COLORS[type], color: SENTIMENT_COLORS[type] } : undefined}
              >
                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: SENTIMENT_COLORS[type] }} />
                {type.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="my-8 h-px w-full bg-[#313131]" />

          {isLoading ? (
            <p className="font-mono-caps text-[11px] text-[#949494]">LOADING MESSAGES...</p>
          ) : messages.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {messages.map((message, index) => (
                <MessageCard
                  key={message._id ?? `${message.createdAt}-${index}`}
                  message={message}
                  onMessageDelete={handleDeleteMessage}
                  onStarToggle={handleStarToggle}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-[2px] border border-dashed border-[#313131] bg-[#131313] p-8 font-mono-caps text-[11px] text-[#949494] text-center">
              {starredFilter
                ? 'NO STARRED MESSAGES. STAR YOUR IMPORTANT MESSAGES TO FIND THEM HERE.'
                : sentimentFilter
                  ? `NO ${sentimentFilter.toUpperCase()} MESSAGES IN THIS INBOX.`
                  : 'NO MESSAGES IN THIS INBOX YET. SHARE YOUR LINK TO START RECEIVING ANONYMOUS FEEDBACK.'}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

export default DashboardPage
