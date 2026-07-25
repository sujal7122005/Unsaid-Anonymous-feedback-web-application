'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useState } from 'react'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Loader2, Star, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'

type MessageCardData = {
  _id?: string
  content: string
  createdAt: string | Date
  sentiment?: string
  isStarred?: boolean
}

type MessageCardProps = {
  message: MessageCardData
  onMessageDelete?: (messageId?: string) => void | Promise<void>
  onStarToggle?: (messageId: string, newState: boolean) => void
}

type DeleteMessageResponse = {
  success: boolean
  message: string
}

type StarMessageResponse = {
  success: boolean
  message: string
  isStarred: boolean
}

const SENTIMENT_CONFIG: Record<string, { label: string; color: string; bgColor: string; borderColor: string }> = {
  positive: { label: 'POSITIVE', color: '#3cffd0', bgColor: 'rgba(60, 255, 208, 0.1)', borderColor: '#3cffd0' },
  constructive: { label: 'CONSTRUCTIVE', color: '#fef08a', bgColor: 'rgba(254, 240, 138, 0.1)', borderColor: '#fef08a' },
  negative: { label: 'NEGATIVE', color: '#5200ff', bgColor: 'rgba(82, 0, 255, 0.15)', borderColor: '#5200ff' },
  neutral: { label: 'NEUTRAL', color: '#949494', bgColor: 'rgba(148, 148, 148, 0.1)', borderColor: '#949494' },
}

function formatMessageDate(createdAt: string | Date) {
  const date = new Date(createdAt)
  if (Number.isNaN(date.getTime())) {
    return 'Just now'
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
}

export function MessageCard({ message, onMessageDelete, onStarToggle }: MessageCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [isStarring, setIsStarring] = useState(false)
  const [starred, setStarred] = useState(message.isStarred ?? false)

  const sentiment = message.sentiment || 'neutral'
  const sentimentInfo = SENTIMENT_CONFIG[sentiment] || SENTIMENT_CONFIG.neutral

  async function handleStarToggle() {
    if (!message?._id || isStarring) return

    setIsStarring(true)

    try {
      const response = await fetch('/api/Star-Message', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messageId: message._id }),
      })

      const data: StarMessageResponse = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to update star')
      }

      setStarred(data.isStarred)
      onStarToggle?.(message._id, data.isStarred)
      toast.success(data.message, { duration: 1500 })
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to update star'
      toast.error(errorMessage)
    } finally {
      setIsStarring(false)
    }
  }

  async function handleDeleteConfirm() {
    if (!message?._id) {
      toast.error('Message id is missing')
      return
    }

    setIsDeleting(true)

    try {
      const response = await fetch('/api/Delete-Message', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messageId: message._id }),
      })

      const data: DeleteMessageResponse = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to delete message')
      }

      await onMessageDelete?.(message._id)
      toast.success(data.message || 'Message deleted successfully')
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to delete message'
      toast.error(errorMessage)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Card className="w-full overflow-hidden rounded-[20px] border border-[#ffffff] bg-[#131313] shadow-none">
      <CardHeader className="gap-4 border-b border-[#313131] px-5 py-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <CardDescription className="font-mono-caps text-[11px] text-[#3cffd0]">
              ANONYMOUS MESSAGE
            </CardDescription>
            <CardTitle className="font-display text-[40px] uppercase text-white leading-[0.9]">
              MESSAGE
            </CardTitle>
          </div>

          <div className="flex items-center gap-2">
            {/* Star Toggle */}
            <button
              type="button"
              onClick={handleStarToggle}
              disabled={isStarring}
              className={`flex items-center justify-center rounded-[24px] border px-3 py-2 transition-colors ${
                starred
                  ? 'border-[#fef08a] bg-[#fef08a] text-black'
                  : 'border-[#313131] bg-transparent text-[#949494] hover:border-[#fef08a] hover:text-[#fef08a]'
              }`}
              title={starred ? 'Unstar message' : 'Star message'}
            >
              {isStarring ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Star className={`h-4 w-4 ${starred ? 'fill-current' : ''}`} />
              )}
            </button>

            {/* Delete Button */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button
                  type="button"
                  disabled={isDeleting}
                  className="flex items-center gap-2 rounded-[24px] border border-[#5200ff] bg-transparent text-[#5200ff] px-4 py-2 font-mono-caps text-[11px] hover:bg-[#5200ff] hover:text-white transition-colors"
                >
                  {isDeleting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                  {isDeleting ? 'DELETING...' : 'DELETE'}
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-[#131313] border-[#ffffff] rounded-[20px] text-white">
                <AlertDialogHeader>
                  <AlertDialogTitle className="font-display text-[40px] uppercase text-white leading-[0.9]">DELETE THIS MESSAGE?</AlertDialogTitle>
                  <AlertDialogDescription className="font-sans text-[14px] text-[#949494]">
                    THIS ACTION CANNOT BE UNDONE. IF YOU CONTINUE, THIS MESSAGE
                    WILL BE PERMANENTLY REMOVED.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="rounded-[24px] border border-[#313131] bg-transparent text-white font-mono-caps text-[11px] hover:bg-[#313131] hover:text-white">
                    CANCEL
                  </AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleDeleteConfirm} 
                    disabled={isDeleting}
                    className="rounded-[24px] bg-[#5200ff] text-white font-mono-caps text-[11px] hover:bg-[#5200ff]/80"
                  >
                    CONTINUE
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Sentiment Badge */}
          <span
            className="inline-flex items-center rounded-[2px] px-2.5 py-1 font-mono-caps text-[10px]"
            style={{
              color: sentimentInfo.color,
              backgroundColor: sentimentInfo.bgColor,
              border: `1px solid ${sentimentInfo.borderColor}`,
            }}
          >
            {sentimentInfo.label}
          </span>

          {/* Timestamp */}
          <span className="inline-flex items-center rounded-[2px] border border-[#313131] bg-[#131313] px-2.5 py-1 font-mono-caps text-[10px] text-[#949494]">
            RECEIVED {formatMessageDate(message.createdAt).toUpperCase()}
          </span>

          {/* Starred indicator */}
          {starred && (
            <span className="inline-flex items-center rounded-[2px] border border-[#fef08a] bg-transparent px-2.5 py-1 font-mono-caps text-[10px] text-[#fef08a]">
              ★ STARRED
            </span>
          )}
        </div>
      </CardHeader>

      <CardContent className="px-5 py-4">
        <p className="whitespace-pre-wrap rounded-[2px] border border-[#313131] bg-[#131313] p-4 text-[16px] leading-7 font-sans text-white">
          {message.content}
        </p>
      </CardContent>
    </Card>
  )
}

export default MessageCard