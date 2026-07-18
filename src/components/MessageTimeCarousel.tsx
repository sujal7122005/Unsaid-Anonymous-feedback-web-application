'use client'

import { CalendarClock, CalendarDays, Clock3 } from 'lucide-react'
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
    label: 'TODAY',
    note: 'Fresh anonymous messages from the current day.',
    icon: Clock3,
  },
  {
    key: 'lastDay',
    label: 'LAST DAY',
    note: 'Feedback from the previous 24 hours.',
    icon: CalendarClock,
  },
  {
    key: 'lastWeek',
    label: 'LAST WEEK',
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
    
    const intervalId = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % timeframeMeta.length)
    }, AUTO_SWITCH_MS)

    return () => window.clearInterval(intervalId)
  }, [])

  const activeTimeframe = timeframeMeta[activeIndex]
  const activeMessages = messagesByTimeframe[activeTimeframe.key]
  const loopedMessages = useMemo(() => [...activeMessages, ...activeMessages], [activeMessages])

  return (
    <section id="messages-carousel" className="w-full">
      <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8 space-y-4">
        <h2 className="font-sans-thin-caps text-[20px] border-b border-[#313131] pb-4 mb-2">
          LIVE CAROUSEL
        </h2>
        <h3 className="font-display text-[40px] sm:text-[60px] leading-[0.9] text-white">
          RANDOM ANONYMOUS MESSAGES,<br />
          ALWAYS MOVING.
        </h3>

        <div className="mt-8 flex flex-wrap gap-4">
          {timeframeMeta.map((item, index) => {
            const isActive = index === activeIndex
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`inline-flex items-center gap-2 rounded-[24px] border border-[#ffffff] px-4 py-2 font-mono-caps text-[12px] transition-colors ${
                  isActive
                    ? 'bg-[#ffffff] text-[#000000]'
                    : 'bg-transparent text-[#ffffff] hover:bg-[#313131]'
                }`}
                aria-pressed={isActive}
              >
                {item.label}
              </button>
            )
          })}
        </div>
      </div>

      <div className="relative mt-12 w-full overflow-hidden bg-[#131313] border-y border-[#313131]">
        <div
          key={activeTimeframe.key}
          className="carousel-track flex min-w-max items-center gap-6 px-4 py-12"
        >
          {loopedMessages.map((message, index) => (
            <article
              key={`${activeTimeframe.key}-${index}`}
              className="relative w-[300px] sm:w-[400px] shrink-0 rounded-[20px] border border-[#ffffff] bg-[#131313] p-8 transition-colors duration-150 hover:bg-[#313131]"
            >
              <div className="font-mono-caps text-[11px] text-[#3cffd0] mb-4">
                {activeTimeframe.label}
              </div>
              <p className="text-[20px] leading-[1.4] font-bold text-white">
                "{message}"
              </p>
            </article>
          ))}
        </div>
      </div>

      <style jsx>{`
        .carousel-track {
          animation: infinite-carousel 30s linear infinite;
        }
        @keyframes infinite-carousel {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .carousel-track { animation: none; transform: none; }
        }
      `}</style>
    </section>
  )
}