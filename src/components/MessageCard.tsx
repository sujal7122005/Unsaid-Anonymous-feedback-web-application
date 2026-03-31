'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

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
import { Trash2 } from 'lucide-react'

type MessageCardData = {
  _id?: string
  title?: string
  content: string
  createdAt?: string | Date
}

type MessageCardProps = {
  message: MessageCardData
  onMessageDelete?: (messageId?: string) => void | Promise<void>
}

function formatMessageDate(createdAt?: string | Date) {
  if (!createdAt) {
    return 'Just now'
  }

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
  async function handleDeleteConfirm() {
    // TODO: Write delete logic here (API call, state update, etc.).
    await onMessageDelete?.(message?._id)
  }

  return (
    <Card className="mx-auto w-[95%] overflow-hidden rounded-b-lg border border-gray-300 bg-white shadow-[0_18px_50px_-30px_rgba(0,0,0,0.45)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_-30px_rgba(0,0,0,0.6)]">
      <CardHeader className="gap-4 border-b border-gray-100 bg-linear-to-r from-white via-gray-50 to-white px-6 py-5">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <CardDescription className="text-xs font-bold uppercase tracking-[0.26em] text-gray-500">
            
            </CardDescription>
            <CardTitle className="text-lg font-black tracking-tight text-black sm:text-2xl">
              {message.title || 'Anonymous Message'}
            </CardTitle>
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="h-10 rounded-xl px-3.5 text-sm font-semibold tracking-wide shadow-sm transition-all duration-200 hover:-translate-y-px hover:shadow-md"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete this message?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. If you continue, this message
                  will be permanently removed.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteConfirm}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <div className="inline-flex w-fit items-center rounded-full border border-gray-300 bg-white px-2 py-0 text-xs font-semibold text-gray-800 shadow-xs">
          Received {formatMessageDate(message.createdAt)}
        </div>
      </CardHeader>

      <CardContent className="px-6 py-5">
        <p className="whitespace-pre-wrap rounded-2xl border border-gray-500 bg-gray-50/90 p-4 text-base leading-7 font-medium text-gray-950 sm:text-[20px]">
          {message.content}
        </p>
      </CardContent>
    </Card>
  )
}

export default MessageCard