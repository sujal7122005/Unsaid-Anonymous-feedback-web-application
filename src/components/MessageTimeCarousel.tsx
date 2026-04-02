'use client'

import { CalendarClock, CalendarDays, Clock3, MessageSquareText } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

type TimeframeKey = 'today' | 'lastDay' | 'lastWeek'

type TimeframeMeta = {
  key: TimeframeKey
  label: string
  note: string
  icon: typeof Clock3
}

const timeframeMeta: TimeframeMeta[] = [
  {
    key: 'today',
    label: 'Today',
    note: 'Fresh anonymous messages from the current day.',
    icon: Clock3,
  },
  {
    key: 'lastDay',
    label: 'Last Day',
    note: 'Feedback from the previous 24 hours.',
    icon: CalendarClock,
  },
  {
    key: 'lastWeek',
    label: 'Last Week',
    note: 'Highlights collected across the last 7 days.',
    icon: CalendarDays,
  },
]

const messagePool: Record<TimeframeKey, string[]> = {
  today: [
    'Your communication style feels very clear and respectful.',
    'I like how quickly you turn feedback into action items.',
    'The product feels smoother after your latest UI update.',
    'Great initiative on keeping the team aligned this week.',
    'Your explanations make difficult ideas easier to follow.',
    'The dashboard is noticeably cleaner and easier to use now.',
    'You are consistent, and that builds real trust with users.',
    'Your recent improvements made onboarding feel much simpler.',
    'You are open to criticism, which is a strong leadership trait.',
  ],
  lastDay: [
    'The messaging flow is simple and does not confuse new users.',
    'I appreciate how professionally you handle suggestions.',
    'The visual design looks modern without feeling noisy.',
    'Your updates are frequent and usually solve practical pain points.',
    'The verification process gives confidence in account security.',
    'You respond to edge cases faster than most teams.',
    'The project quality keeps improving week by week.',
    'The anonymous format helps people share honest thoughts safely.',
    'I noticed better spacing and readability after the recent changes.',
  ],
  lastWeek: [
    'This platform makes feedback collection much less awkward.',
    'You balance product speed with thoughtful implementation.',
    'The concept is strong and already feels useful in real scenarios.',
    'I trust this app more because of the OTP-based verification.',
    'The overall experience feels clean and focused on what matters.',
    'The team appears to iterate quickly based on user input.',
    'Navigation is easy, even for someone seeing it for the first time.',
    'Anonymous messaging is handled in a way that still feels safe.',
    'The app has a clear purpose and communicates it effectively.',
  ],
}

const CARDS_PER_TIMEFRAME = 6
const AUTO_SWITCH_MS = 5500

function shuffleArray<T>(items: T[]): T[] {
  const copy = [...items]

  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = copy[i]
    copy[i] = copy[j]
    copy[j] = temp
  }

  return copy
}

function buildRandomizedMessages() {
  return {
    today: shuffleArray(messagePool.today).slice(0, CARDS_PER_TIMEFRAME),
    lastDay: shuffleArray(messagePool.lastDay).slice(0, CARDS_PER_TIMEFRAME),
    lastWeek: shuffleArray(messagePool.lastWeek).slice(0, CARDS_PER_TIMEFRAME),
  }
}

export default function MessageTimeCarousel() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [messagesByTimeframe, setMessagesByTimeframe] = useState(() => ({
    today: messagePool.today.slice(0, CARDS_PER_TIMEFRAME),
    lastDay: messagePool.lastDay.slice(0, CARDS_PER_TIMEFRAME),
    lastWeek: messagePool.lastWeek.slice(0, CARDS_PER_TIMEFRAME),
  }))

  useEffect(() => {
    setMessagesByTimeframe(buildRandomizedMessages())
  }, [])

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % timeframeMeta.length)
    }, AUTO_SWITCH_MS)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [])

  const activeTimeframe = timeframeMeta[activeIndex]
  const activeMessages = messagesByTimeframe[activeTimeframe.key]

  const loopedMessages = useMemo(
    () => [...activeMessages, ...activeMessages],
    [activeMessages],
  )

  return (
    <section
      id="messages-carousel"
      className="animate-in fade-in-0 slide-in-from-bottom-4 duration-700 w-full min-h-155 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:min-h-170 sm:p-8"
    >
      <div className="space-y-2">
        <p className="text-xs font-semibold tracking-[0.16em] text-slate-500 uppercase">
          Live Message Carousel
        </p>
        <h2 className="text-2xl font-black text-slate-900 sm:text-3xl">
          Random anonymous messages, always moving
        </h2>
        <p className="max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base">
          Auto-rotating view across Today, Last Day, and Last Week to preview
          how feedback keeps flowing in real time.
        </p>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {timeframeMeta.map((item, index) => {
          const Icon = item.icon
          const isActive = index === activeIndex

          return (
            <button
              key={item.key}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold tracking-wide transition-all duration-300 sm:text-sm ${
                isActive
                  ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
                  : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50'
              }`}
              aria-pressed={isActive}
            >
              <Icon className="h-3.5 w-3.5" />
              {item.label}
            </button>
          )
        })}
      </div>

      <p className="mt-3 text-xs font-medium text-slate-500 sm:text-sm">
        {activeTimeframe.note}
      </p>

      <div className="relative mt-5 min-h-75 overflow-hidden rounded-2xl border border-slate-200 bg-linear-to-r from-slate-100 via-white to-slate-100 sm:min-h-85">
        <div className="pointer-events-none absolute top-0 left-0 z-10 h-full w-10 bg-linear-to-r from-white to-transparent sm:w-16" />
        <div className="pointer-events-none absolute top-0 right-0 z-10 h-full w-10 bg-linear-to-l from-white to-transparent sm:w-16" />

        <div
          key={activeTimeframe.key}
          className="carousel-track flex min-w-max items-center gap-3 px-3 py-8 sm:gap-4 sm:px-4 sm:py-10"
        >
          {loopedMessages.map((message, index) => (
            <article
              key={`${activeTimeframe.key}-${index}`}
              className="relative w-70 min-h-47.5 shrink-0 overflow-hidden rounded-2xl border border-slate-300 bg-white p-5 shadow-[0_16px_35px_-18px_rgba(15,23,42,0.55)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_45px_-18px_rgba(15,23,42,0.7)] sm:w-80 sm:min-h-53.75 sm:p-6"
            >
              <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-linear-to-r from-cyan-400 via-blue-500 to-emerald-400" />

              <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-800 uppercase">
                <MessageSquareText className="h-3.5 w-3.5" />
                {activeTimeframe.label}
              </div>

              <p className="mt-3 text-sm leading-relaxed font-semibold text-slate-900 sm:text-base">
                {message}
              </p>
            </article>
          ))}
        </div>
      </div>

      <style jsx>{`
        .carousel-track {
          animation: infinite-carousel 26s linear infinite;
        }

        @keyframes infinite-carousel {
          0% {
            transform: translateX(0);
          }

          100% {
            transform: translateX(-50%);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .carousel-track {
            animation: none;
            transform: none;
          }
        }
      `}</style>
    </section>
  )
}