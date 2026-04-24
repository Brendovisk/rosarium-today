'use client'

import { useState, useRef, useCallback, useMemo, useEffect } from 'react'
import type { RefObject } from 'react'
import { fetchTimestamps, getAudioUrl } from '@/lib/prayers'
import type { PrayerKey, WordTimestamp, VoiceGender } from '@/lib/prayers'
import type { Locale } from '@/i18n.config'
import { PLAYBACK_RATES } from '@/lib/constants/playback'
import type { PlaybackRate } from '@/lib/constants/playback'

export type { PlaybackRate }
export { PLAYBACK_RATES }

interface UseRosaryPlayerParams {
  prayerKey: PrayerKey | null
  locale: Locale
  voiceGender: VoiceGender
  onEnded?: () => void
}

export interface UseRosaryPlayerReturn {
  audioRef: RefObject<HTMLAudioElement | null>
  words: readonly WordTimestamp[]
  isPlaying: boolean
  currentTime: number
  duration: number
  isLoading: boolean
  activeWordIndex: number
  lastStartedIndex: number
  playbackRate: PlaybackRate
  togglePlayPause: () => void
  seekToWord: (startTime: number) => void
  seekTo: (time: number) => void
  setPlaybackRate: (rate: PlaybackRate) => void
}

export function useRosaryPlayer({
  prayerKey,
  locale,
  voiceGender,
  onEnded,
}: UseRosaryPlayerParams): UseRosaryPlayerReturn {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const rafRef = useRef<number | undefined>(undefined)
  const scrolledWordRef = useRef(-1)
  const onEndedRef = useRef(onEnded)

  const [words, setWords] = useState<readonly WordTimestamp[]>([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [playbackRate, setPlaybackRateState] = useState<PlaybackRate>(1.0)

  // Keep the callback ref stable so we don't need it in deps
  useEffect(() => {
    onEndedRef.current = onEnded
  }, [onEnded])

  // Load timestamps when prayer/locale/gender changes
  useEffect(() => {
    if (!prayerKey) {
      setWords([])
      setIsLoading(false)
      return
    }

    let cancelled = false
    setIsLoading(true)
    setWords([])

    fetchTimestamps(prayerKey, locale, voiceGender).then((data) => {
      if (!cancelled) {
        setWords(data)
        setIsLoading(false)
      }
    })

    return () => {
      cancelled = true
    }
  }, [prayerKey, locale, voiceGender])

  // Reset audio state when prayer/locale/gender changes
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.pause()
    audio.load()
    setIsPlaying(false)
    setCurrentTime(0)
    setDuration(0)
    scrolledWordRef.current = -1
  }, [prayerKey, locale, voiceGender])

  // Apply playback rate to audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate
    }
  }, [playbackRate])

  // RAF loop for smooth time tracking
  const tick = useCallback(() => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
    rafRef.current = requestAnimationFrame(tick)
  }, [])

  useEffect(() => {
    if (isPlaying) {
      rafRef.current = requestAnimationFrame(tick)
    } else {
      if (rafRef.current !== undefined) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = undefined
      }
    }
    return () => {
      if (rafRef.current !== undefined) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = undefined
      }
    }
  }, [isPlaying, tick])

  const activeWordIndex = useMemo(() => {
    for (let i = 0; i < words.length; i++) {
      if (currentTime >= words[i].start && currentTime <= words[i].end) return i
    }
    return -1
  }, [words, currentTime])

  const lastStartedIndex = useMemo(() => {
    let idx = -1
    for (let i = 0; i < words.length; i++) {
      if (currentTime >= words[i].start) idx = i
      else break
    }
    return idx
  }, [words, currentTime])

  const togglePlayPause = useCallback(() => {
    const audio = audioRef.current
    if (!audio || !prayerKey) return
    if (isPlaying) {
      audio.pause()
    } else {
      audio.play().catch(() => {})
    }
  }, [isPlaying, prayerKey])

  const seekToWord = useCallback((startTime: number) => {
    const audio = audioRef.current
    if (!audio) return
    audio.currentTime = startTime
    audio.play().catch(() => {})
  }, [])

  const seekTo = useCallback((time: number) => {
    const audio = audioRef.current
    if (!audio) return
    audio.currentTime = time
    setCurrentTime(time)
  }, [])

  const setPlaybackRate = useCallback((rate: PlaybackRate) => {
    setPlaybackRateState(rate)
  }, [])

  const handlePlay = useCallback(() => setIsPlaying(true), [])
  const handlePause = useCallback(() => setIsPlaying(false), [])
  const handleEnded = useCallback(() => {
    setIsPlaying(false)
    onEndedRef.current?.()
  }, [])
  const handleLoadedMetadata = useCallback((e: Event) => {
    setDuration((e.target as HTMLAudioElement).duration)
  }, [])
  const handleTimeUpdate = useCallback((e: Event) => {
    if (!audioRef.current?.paused) return
    setCurrentTime((e.target as HTMLAudioElement).currentTime)
  }, [])

  // Attach audio event listeners imperatively so we can use a stable ref
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.addEventListener('play', handlePlay)
    audio.addEventListener('pause', handlePause)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('timeupdate', handleTimeUpdate)
    return () => {
      audio.removeEventListener('play', handlePlay)
      audio.removeEventListener('pause', handlePause)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('timeupdate', handleTimeUpdate)
    }
  }, [handlePlay, handlePause, handleEnded, handleLoadedMetadata, handleTimeUpdate])

  const audioSrc = prayerKey ? getAudioUrl(prayerKey, locale, voiceGender) : ''

  // Update src when it changes
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    if (audio.getAttribute('src') !== audioSrc) {
      audio.setAttribute('src', audioSrc)
    }
  }, [audioSrc])

  return {
    audioRef,
    words,
    isPlaying,
    currentTime,
    duration,
    isLoading,
    activeWordIndex,
    lastStartedIndex,
    playbackRate,
    togglePlayPause,
    seekToWord,
    seekTo,
    setPlaybackRate,
  }
}
