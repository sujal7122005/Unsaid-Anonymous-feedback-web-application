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
import { Button } from '@/components/ui/button'
import { Loader2, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'

type MessageCardData = {
  _id?: string
  content: string
  createdAt: string | Date
}

type MessageCardProps = {
  message: MessageCardData
  onMessageDelete?: (messageId?: string) => void | Promise<void>
}

type DeleteMessageResponse = {
  success: boolean
  message: string
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

export function MessageCard({ message, onMessageDelete }: MessageCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)

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

        <div className="inline-flex w-fit items-center rounded-[2px] border border-[#313131] bg-[#131313] px-2.5 py-1 font-mono-caps text-[10px] text-[#949494]">
          RECEIVED {formatMessageDate(message.createdAt).toUpperCase()}
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