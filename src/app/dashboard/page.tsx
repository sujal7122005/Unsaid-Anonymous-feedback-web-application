'use client'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import MessageCard from '@/src/components/MessageCard'
import { authClient } from '@/src/lib/auth-client'
import {
  Copy,
  Link2,
  Loader2,
  MessageSquareText,
  RefreshCcw,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

type MessageCardData = {
  _id?: string
  content: string
  createdAt: string | Date
}

function DashboardPage() {
  const [messages, setMessages] = useState<MessageCardData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const [acceptMessages, setAcceptMessages] = useState(false);

  const router = useRouter()

  const { data: session, isPending } = authClient.useSession()
  useEffect(() => {
    if (!session && !isPending) {
      router.replace('/login')
    }
  }, [session, isPending, router])

  useEffect(() => {
    if (session && !isPending) {
      fetchStatusAcceptMessages();
      fetchMessages();
    }
  }, [session, isPending]);

  if (!session) {
    return null
  }

  const BaseUrl = window.location.protocol + '//' + window.location.host
  const encodedUsername = encodeURIComponent(session.user.name ?? '')
  const profileUrl = `${BaseUrl}/u/${encodedUsername}`
  const totalMessages = messages.length

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl)
      toast.success('Profile URL copied to clipboard!', { duration: 2000 })
    } catch {
      toast.error('Could not copy the profile URL', { duration: 2000 })
    }
  }

  const handleDeleteMessage = (messageId?: string) => {
    if (!messageId) return;
    setMessages((prevMessages) => prevMessages.filter((message) => message._id !== messageId));
  };

  const fetchStatusAcceptMessages = async () => {
    setIsSwitchLoading(true)
    try {
      const response = await fetch('/api/Accepting-Messages');
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to fetch settings')
      }

      setAcceptMessages(Boolean(data.isAcceptingMessages));
    } catch {
      toast.error('Failed to fetch settings', { duration: 2000 })
    } finally {
      setIsSwitchLoading(false)
    }
  }

  const handleSwitchChange = async (checked: boolean) => {
    setIsSwitchLoading(true);
    try {
      const response = await fetch('/api/Accepting-Messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ acceptingMessages: checked })
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to update settings')
      }

      const updatedValue =
        typeof data.userData?.isAcceptingMessages === 'boolean'
          ? data.userData.isAcceptingMessages
          : checked;
      setAcceptMessages(updatedValue);
      toast.success('Preferences updated!', { duration: 2000 });
    } catch {
      toast.error('Failed to update settings', { duration: 2000 });
    } finally {
      setIsSwitchLoading(false);
    }
  };

  const fetchMessages = async (refresh: boolean = false) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/Get-Messages');
      const data = await response.json();

      if (response.status === 404) {
        setMessages([]);
        return;
      }

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to fetch messages')
      }

      setMessages(Array.isArray(data.messages) ? data.messages : []);

      if (refresh) {
        toast.success('Messages refreshed!', { duration: 2000 });
      }
    } catch {
      toast.error('Failed to fetch messages', { duration: 2000 });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-linear-to-b from-slate-100 via-zinc-100 to-stone-200 px-4 py-8 sm:px-6 lg:px-10">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-28 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-cyan-300/30 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-6 right-0 h-56 w-56 rounded-full bg-amber-200/40 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl space-y-6">
        <section className="animate-in fade-in-0 slide-in-from-top-4 duration-700 rounded-3xl border border-white/70 bg-white/80 p-6 shadow-[0_24px_70px_-36px_rgba(15,23,42,0.45)] backdrop-blur-sm sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-300/80 bg-white/80 px-3 py-1 text-xs font-semibold tracking-[0.18em] text-slate-600 uppercase">
                <Sparkles className="h-3.5 w-3.5" />
                Creator Workspace
              </div>
              <h1 className="text-3xl leading-tight font-black tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                {session?.user?.name || 'User'}'s Dashboard
              </h1>
              <p className="max-w-2xl text-sm text-slate-600 sm:text-base">
                Share your public link, control message privacy, and monitor your
                incoming anonymous feedback in one place.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="rounded-2xl border border-slate-300/70 bg-white/90 px-4 py-3 shadow-sm">
                <p className="text-xs font-semibold tracking-[0.16em] text-slate-500 uppercase">
                  Inbox Size
                </p>
                <p className="mt-1 text-2xl font-black text-slate-900">
                  {totalMessages}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-300/70 bg-white/90 px-4 py-3 shadow-sm">
                <p className="text-xs font-semibold tracking-[0.16em] text-slate-500 uppercase">
                  Message Mode
                </p>
                <p className="mt-1 text-sm font-bold text-slate-900 sm:text-base">
                  {acceptMessages ? 'Accepting' : 'Paused'}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid animate-in fade-in-0 slide-in-from-bottom-4 duration-700 gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)]">
          <div className="rounded-3xl border border-slate-300/70 bg-white/90 p-6 shadow-[0_18px_55px_-34px_rgba(15,23,42,0.4)] backdrop-blur-sm sm:p-7">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold tracking-[0.18em] text-slate-500 uppercase">
                  Public Profile Link
                </p>
                <h2 className="mt-2 text-xl font-black text-slate-900 sm:text-2xl">
                  Copy Your Unique Link
                </h2>
              </div>
              <div className="rounded-xl border border-slate-300 bg-slate-50 p-2 text-slate-700">
                <Link2 className="h-4 w-4" />
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <input
                type="text"
                value={profileUrl}
                disabled
                className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 shadow-inner"
              />
              <Button
                onClick={copyToClipboard}
                className="h-11 min-w-32 rounded-xl px-4 text-sm font-bold"
              >
                <Copy className="h-4 w-4" />
                Copy Link
              </Button>
            </div>

            <p className="mt-3 text-xs text-slate-500 sm:text-sm">
              Anyone with this URL can send you anonymous feedback. Keep sharing
              it where your audience is active.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-300/70 bg-white/90 p-6 shadow-[0_18px_55px_-34px_rgba(15,23,42,0.4)] backdrop-blur-sm sm:p-7">
            <p className="text-xs font-semibold tracking-[0.18em] text-slate-500 uppercase">
              Privacy Controls
            </p>
            <h2 className="mt-2 text-xl font-black text-slate-900 sm:text-2xl">
              Message Preferences
            </h2>

            <div className="mt-5 flex items-center justify-between rounded-2xl border border-slate-300 bg-slate-50 p-4">
              <div>
                <p className="text-sm font-bold text-slate-900">
                  Accept Anonymous Messages
                </p>
                <p className="text-xs text-slate-500">
                  Turn this off any time to pause new submissions.
                </p>
              </div>
              <Switch
                checked={acceptMessages}
                onCheckedChange={handleSwitchChange}
                disabled={isSwitchLoading}
              />
            </div>

            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 sm:text-sm">
              <ShieldCheck className="h-4 w-4" />
              Status: {acceptMessages ? 'Live and accepting' : 'Paused for now'}
            </div>
          </div>
        </section>

        <section className="animate-in fade-in-0 slide-in-from-bottom-6 duration-700 rounded-3xl border border-slate-300/70 bg-white/90 p-5 shadow-[0_22px_65px_-40px_rgba(15,23,42,0.45)] backdrop-blur-sm sm:p-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold tracking-[0.18em] text-slate-500 uppercase">
                Inbox
              </p>
              <h2 className="mt-1 text-2xl font-black text-slate-900">
                Anonymous Messages
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <span className="rounded-full border border-slate-300 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700 sm:text-sm">
                {totalMessages} total
              </span>
              <Button
                variant="outline"
                className="h-10 rounded-xl px-4"
                onClick={(e) => {
                  e.preventDefault();
                  fetchMessages(true);
                }}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCcw className="h-4 w-4" />
                )}
                Refresh
              </Button>
            </div>
          </div>

          <Separator className="my-5 bg-slate-300/70" />

          {isLoading ? (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {[1, 2].map((item) => (
                <div
                  key={item}
                  className="h-44 animate-pulse rounded-2xl border border-slate-300/70 bg-slate-100"
                />
              ))}
            </div>
          ) : messages.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {messages.map((message, index) => (
                <MessageCard
                  key={message._id ?? `${message.createdAt}-${index}`}
                  message={message}
                  onMessageDelete={handleDeleteMessage}
                />
              ))}
            </div>
          ) : (
            <div className="flex min-h-52 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/80 px-6 text-center">
              <MessageSquareText className="h-9 w-9 text-slate-500" />
              <h3 className="mt-4 text-lg font-bold text-slate-800">
                No messages yet
              </h3>
              <p className="mt-1 max-w-md text-sm text-slate-600">
                Your inbox is ready. Share your profile link and responses will
                start appearing here.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default DashboardPage