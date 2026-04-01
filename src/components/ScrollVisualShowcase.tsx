'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

type VisualItem = {
  title: string
  description: string
  imageSrc: string
  imageAlt: string
  badge: string
}

const visuals: VisualItem[] = [
  {
    title: 'Shareable Profile Link',
    description: 'Post one unique URL and start collecting anonymous responses.',
    imageSrc: '/globe.svg',
    imageAlt: 'Shareable profile link illustration',
    badge: 'Reach',
  },
  {
    title: 'Clean Message Inbox',
    description: 'Read incoming feedback inside a focused private dashboard.',
    imageSrc: '/window.svg',
    imageAlt: 'Dashboard inbox illustration',
    badge: 'Inbox',
  },
  {
    title: 'Actionable Feedback Notes',
    description: 'Turn anonymous thoughts into clear next steps and growth.',
    imageSrc: '/file.svg',
    imageAlt: 'Feedback notes illustration',
    badge: 'Insights',
  },
]

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

export default function ScrollVisualShowcase() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const [progress, setProgress] = useState(0)
  const [reduceMotion, setReduceMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

    const syncMotionPreference = () => {
      setReduceMotion(mediaQuery.matches)
    }

    syncMotionPreference()
    mediaQuery.addEventListener('change', syncMotionPreference)

    return () => {
      mediaQuery.removeEventListener('change', syncMotionPreference)
    }
  }, [])

  useEffect(() => {
    if (reduceMotion) {
      setProgress(0.5)
      return
    }

    let frameId = 0

    const updateProgress = () => {
      frameId = 0

      const node = sectionRef.current
      if (!node) return

      const rect = node.getBoundingClientRect()
      const viewportHeight = window.innerHeight

      const distance = viewportHeight + rect.height
      const raw = (viewportHeight - rect.top) / distance
      const next = clamp(raw, 0, 1)

      setProgress(next)
    }

    const queueUpdate = () => {
      if (frameId !== 0) return
      frameId = window.requestAnimationFrame(updateProgress)
    }

    queueUpdate()
    window.addEventListener('scroll', queueUpdate, { passive: true })
    window.addEventListener('resize', queueUpdate)

    return () => {
      if (frameId !== 0) {
        window.cancelAnimationFrame(frameId)
      }
      window.removeEventListener('scroll', queueUpdate)
      window.removeEventListener('resize', queueUpdate)
    }
  }, [reduceMotion])

  return (
    <section
      ref={sectionRef}
      className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
    >
      <div className="space-y-2">
        <p className="text-xs font-semibold tracking-[0.16em] text-slate-500 uppercase">
          Product in Motion
        </p>
        <h2 className="text-2xl font-black text-slate-900 sm:text-3xl">
          Visual experience while you scroll
        </h2>
        <p className="max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base">
          Subtle parallax movement keeps the page modern while still feeling
          professional and easy to read.
        </p>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        {visuals.map((item, index) => {
          const offsetStrength = 26 + index * 8
          const rotationStrength = 6 + index * 2

          const translateY = reduceMotion ? 0 : (0.5 - progress) * offsetStrength
          const rotate = reduceMotion ? 0 : (progress - 0.5) * rotationStrength

          return (
            <article
              key={item.title}
              style={{
                transform: `translate3d(0, ${translateY}px, 0) rotate(${rotate}deg)`,
                transition: reduceMotion
                  ? 'none'
                  : 'transform 220ms cubic-bezier(0.22, 1, 0.36, 1)',
              }}
              className="group rounded-2xl border border-slate-200 bg-slate-50 p-5"
            >
              <div className="inline-flex rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-bold tracking-[0.12em] text-slate-600 uppercase">
                {item.badge}
              </div>

              <div className="mt-3 rounded-xl border border-slate-200 bg-white p-4">
                <Image
                  src={item.imageSrc}
                  alt={item.imageAlt}
                  width={72}
                  height={72}
                  className="h-16 w-16 transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              <h3 className="mt-4 text-base font-extrabold text-slate-900">
                {item.title}
              </h3>
              <p className="mt-2 text-sm text-slate-600">{item.description}</p>
            </article>
          )
        })}
      </div>
    </section>
  )
}