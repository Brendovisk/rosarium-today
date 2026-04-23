'use client'

import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import {
  PRAYERS,
  VOICES,
  getAudioUrl,
  getTimestampUrl,
  type VoiceKey,
  type WordTimestamp,
  type Prayer,
} from '@/lib/prayers'

function formatTime(s: number): string {
  const m = Math.floor(s / 60)
  return `${m}:${Math.floor(s % 60).toString().padStart(2, '0')}`
}

function PlayIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
      <path d="M4 3.2v11.6L15 9z" />
    </svg>
  )
}

function PauseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
      <rect x="3.5" y="2.5" width="4" height="13" rx="1.5" />
      <rect x="10.5" y="2.5" width="4" height="13" rx="1.5" />
    </svg>
  )
}

export function PrayerPlayer() {
  const [selectedPrayerId, setSelectedPrayerId] = useState(PRAYERS[0].id)
  const [selectedVoice, setSelectedVoice] = useState<VoiceKey>('latin/male')
  const [words, setWords] = useState<WordTimestamp[]>([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  const audioRef = useRef<HTMLAudioElement>(null)
  const wordRefsMap = useRef<Map<number, HTMLButtonElement>>(new Map())
  const rafRef = useRef<number | undefined>(undefined)
  const scrolledToRef = useRef(-1)

  const selectedPrayer = PRAYERS.find(p => p.id === selectedPrayerId)!

  // Load timestamps
  useEffect(() => {
    setIsLoading(true)
    setWords([])
    fetch(getTimestampUrl(selectedPrayer, selectedVoice))
      .then(r => r.json())
      .then((data: WordTimestamp[]) => {
        setWords(data)
        setIsLoading(false)
      })
      .catch(() => setIsLoading(false))
  }, [selectedPrayer, selectedVoice])

  // Reload audio when prayer/voice changes
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.pause()
    audio.load()
    setIsPlaying(false)
    setCurrentTime(0)
    setDuration(0)
    scrolledToRef.current = -1
  }, [selectedPrayerId, selectedVoice])

  // RAF loop for smooth time tracking while playing
  const tick = useCallback(() => {
    if (audioRef.current) setCurrentTime(audioRef.current.currentTime)
    rafRef.current = requestAnimationFrame(tick)
  }, [])

  useEffect(() => {
    if (isPlaying) {
      rafRef.current = requestAnimationFrame(tick)
    } else {
      if (rafRef.current !== undefined) cancelAnimationFrame(rafRef.current)
    }
    return () => {
      if (rafRef.current !== undefined) cancelAnimationFrame(rafRef.current)
    }
  }, [isPlaying, tick])

  // Which word is actively being spoken right now
  const activeWordIndex = useMemo(() => {
    for (let i = 0; i < words.length; i++) {
      if (currentTime >= words[i].start && currentTime <= words[i].end) return i
    }
    return -1
  }, [words, currentTime])

  // Index of the last word whose start time has passed
  const lastStartedIndex = useMemo(() => {
    let idx = -1
    for (let i = 0; i < words.length; i++) {
      if (currentTime >= words[i].start) idx = i
      else break
    }
    return idx
  }, [words, currentTime])

  // Auto-scroll to active word, but only when it changes
  useEffect(() => {
    if (activeWordIndex >= 0 && activeWordIndex !== scrolledToRef.current) {
      scrolledToRef.current = activeWordIndex
      wordRefsMap.current.get(activeWordIndex)?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    }
  }, [activeWordIndex])

  const handlePlayPause = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    if (isPlaying) {
      audio.pause()
    } else {
      audio.play().catch(() => {})
    }
  }, [isPlaying])

  const handleWordClick = useCallback((start: number) => {
    const audio = audioRef.current
    if (!audio) return
    audio.currentTime = start
    audio.play().catch(() => {})
  }, [])

  const handleScrub = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current
    if (!audio) return
    const t = parseFloat(e.target.value)
    audio.currentTime = t
    setCurrentTime(t)
  }, [])

  const handlePrayerSelect = useCallback((prayer: Prayer) => {
    if (prayer.id === selectedPrayerId) return
    setSelectedPrayerId(prayer.id)
  }, [selectedPrayerId])

  const voiceLabel = VOICES.find(v => v.key === selectedVoice)?.label ?? ''

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#080808] text-white">
      {/* Header */}
      <header className="flex shrink-0 items-center justify-between border-b border-white/[0.07] px-6 py-3">
        <div className="flex items-center gap-2.5">
          <span className="text-lg text-amber-500/80">✝</span>
          <span className="text-sm font-semibold tracking-[0.12em] text-white/90 uppercase">
            Rosarium
          </span>
        </div>
        <div className="flex gap-1">
          {VOICES.map(v => (
            <button
              key={v.key}
              onClick={() => setSelectedVoice(v.key)}
              className={[
                'rounded px-3.5 py-1.5 text-xs font-medium tracking-wide transition-all',
                selectedVoice === v.key
                  ? 'bg-amber-500/15 text-amber-400 ring-1 ring-amber-500/30'
                  : 'text-white/35 hover:text-white/65 hover:bg-white/5',
              ].join(' ')}
            >
              {v.label}
            </button>
          ))}
        </div>
      </header>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="flex w-52 shrink-0 flex-col border-r border-white/[0.07] bg-[#0c0c0c]">
          <p className="px-5 pt-5 pb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/25">
            Prayers
          </p>
          <nav className="flex-1 overflow-y-auto px-2 pb-4">
            {PRAYERS.map(prayer => (
              <button
                key={prayer.id}
                onClick={() => handlePrayerSelect(prayer)}
                className={[
                  'w-full rounded px-3 py-2.5 text-left text-sm transition-all',
                  selectedPrayerId === prayer.id
                    ? 'bg-amber-500/10 font-medium text-amber-400'
                    : 'text-white/45 hover:bg-white/[0.04] hover:text-white/75',
                ].join(' ')}
              >
                {prayer.name}
              </button>
            ))}
          </nav>
        </aside>

        {/* Lyrics */}
        <main className="flex-1 overflow-y-auto">
          {/* Top fade */}
          <div className="pointer-events-none sticky top-0 h-16 bg-gradient-to-b from-[#080808] to-transparent" />

          <div className="mx-auto max-w-2xl px-14 pb-10" style={{ marginTop: '-64px' }}>
            <div className="pt-20 pb-6">
              <h1 className="text-[2.75rem] font-bold leading-tight tracking-tight text-white">
                {selectedPrayer.name}
              </h1>
              <p className="mt-1 text-xs uppercase tracking-[0.2em] text-white/25">{voiceLabel}</p>
            </div>

            {isLoading ? (
              <p className="text-2xl font-light text-white/15">Loading…</p>
            ) : (
              <div className="text-[1.75rem] font-light leading-[2.4] tracking-wide">
                {words.map((w, i) => {
                  const isActive = i === activeWordIndex
                  const isPast =
                    i < lastStartedIndex ||
                    (i === lastStartedIndex && !isActive && currentTime > w.end)
                  return (
                    <button
                      key={i}
                      ref={el => {
                        if (el) wordRefsMap.current.set(i, el)
                        else wordRefsMap.current.delete(i)
                      }}
                      onClick={() => handleWordClick(w.start)}
                      className="mr-[0.35em] inline cursor-pointer transition-opacity hover:opacity-60"
                    >
                      <span
                        style={
                          isActive
                            ? { color: '#f59e0b' }
                            : isPast
                            ? { color: 'rgba(255,255,255,0.78)' }
                            : { color: 'rgba(255,255,255,0.16)' }
                        }
                      >
                        {w.word.trim()}
                      </span>
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* Bottom fade */}
          <div className="pointer-events-none sticky bottom-0 h-16 bg-gradient-to-t from-[#080808] to-transparent" />
        </main>
      </div>

      {/* Player bar */}
      <footer className="shrink-0 border-t border-white/[0.07] bg-[#0c0c0c] px-6 py-3">
        <div className="flex items-center gap-8">
          {/* Info */}
          <div className="w-44 shrink-0">
            <p className="truncate text-sm font-medium text-white/90">{selectedPrayer.name}</p>
            <p className="mt-0.5 text-xs text-white/30">{voiceLabel}</p>
          </div>

          {/* Controls */}
          <div className="flex flex-1 flex-col items-center gap-2">
            <button
              onClick={handlePlayPause}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-black transition-transform hover:scale-105 active:scale-95"
            >
              {isPlaying ? <PauseIcon /> : <PlayIcon />}
            </button>

            <div className="flex w-full max-w-md items-center gap-3">
              <span className="w-8 text-right text-[11px] tabular-nums text-white/30">
                {formatTime(currentTime)}
              </span>
              <div className="relative flex-1">
                <input
                  type="range"
                  min={0}
                  max={duration || 1}
                  step={0.01}
                  value={currentTime}
                  onChange={handleScrub}
                  className="h-1 w-full cursor-pointer appearance-none rounded-full bg-white/15 accent-amber-400 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                />
                {/* Fill track */}
                <div
                  className="pointer-events-none absolute inset-y-0 left-0 my-auto h-1 rounded-full bg-amber-500/70"
                  style={{ width: duration ? `${(currentTime / duration) * 100}%` : '0%' }}
                />
              </div>
              <span className="w-8 text-[11px] tabular-nums text-white/30">
                {formatTime(duration)}
              </span>
            </div>
          </div>

          <div className="w-44 shrink-0" />
        </div>
      </footer>

      <audio
        ref={audioRef}
        src={getAudioUrl(selectedPrayer, selectedVoice)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
        onLoadedMetadata={e => setDuration((e.target as HTMLAudioElement).duration)}
        onTimeUpdate={e => {
          if (!isPlaying) setCurrentTime((e.target as HTMLAudioElement).currentTime)
        }}
      />
    </div>
  )
}
