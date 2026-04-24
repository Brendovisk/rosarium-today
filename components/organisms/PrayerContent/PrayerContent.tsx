'use client'

import { useRef, useEffect } from 'react'
import { PrayerWord } from '@/components/molecules/PrayerWord'
import type { WordTimestamp } from '@/lib/prayers'

interface PrayerContentProps {
  words: readonly WordTimestamp[]
  activeWordIndex: number
  lastStartedIndex: number
  isLoading: boolean
  currentTime: number
  onWordClick: (time: number) => void
  prayerName: string
  stepLabel: string
}

export function PrayerContent({
  words,
  activeWordIndex,
  lastStartedIndex,
  isLoading,
  onWordClick,
  prayerName,
  stepLabel,
}: PrayerContentProps) {
  const wordRefsMap = useRef<Map<number, HTMLButtonElement>>(new Map())
  const prevActiveRef = useRef(-1)

  // Auto-scroll to active word when it changes
  useEffect(() => {
    if (activeWordIndex >= 0 && activeWordIndex !== prevActiveRef.current) {
      prevActiveRef.current = activeWordIndex
      wordRefsMap.current.get(activeWordIndex)?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    }
  }, [activeWordIndex])

  return (
    <div className="relative flex flex-col flex-1 overflow-hidden">
      {/* Top fade */}
      <div className="pointer-events-none absolute top-0 inset-x-0 h-24 z-10 bg-gradient-to-b from-[#0B0A08] to-transparent" />

      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-2xl px-12 py-24 text-center">
          {/* Prayer heading */}
          <div className="mb-12 animate-sacred-fade-in">
            <h1 className="font-[family-name:var(--font-cinzel)] text-3xl font-bold tracking-[0.2em] uppercase text-[#E8E2D8]">
              {prayerName}
            </h1>
            <p className="mt-3 text-[10px] tracking-[0.3em] uppercase text-[#3A3530]">
              {stepLabel}
            </p>
            <div className="mt-6 mx-auto h-px w-12 bg-gradient-to-r from-transparent via-[rgba(198,161,91,0.4)] to-transparent" />
          </div>

          {/* Prayer text */}
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="flex gap-2">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="size-1.5 rounded-full bg-[#C6A15B] animate-pulse"
                    style={{ animationDelay: `${i * 200}ms` }}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="font-[family-name:var(--font-eb-garamond)] text-[1.85rem] leading-[2.5] tracking-wide animate-sacred-fade-in">
              {words.map((w, i) => {
                const isActive = i === activeWordIndex
                const isPast =
                  i < lastStartedIndex || (i === lastStartedIndex && !isActive)
                const state = isActive ? 'active' : isPast ? 'past' : 'upcoming'
                return (
                  <PrayerWord
                    key={i}
                    word={w.word}
                    state={state}
                    onClick={() => onWordClick(w.start)}
                    wordRef={(el) => {
                      if (el) wordRefsMap.current.set(i, el)
                      else wordRefsMap.current.delete(i)
                    }}
                  />
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Bottom fade */}
      <div className="pointer-events-none absolute bottom-0 inset-x-0 h-24 z-10 bg-gradient-to-t from-[#0B0A08] to-transparent" />
    </div>
  )
}
