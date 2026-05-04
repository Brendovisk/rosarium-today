"use client";

import {
  type RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import type { SupportedLocale } from "@/config/locales";
import type { PlaybackRate, VoiceGender } from "@/config/settings";
import {
  fetchTimestamps,
  getAudioUrl,
  type PrayerKey,
  type WordTimestamp,
} from "@/player/assets";

type UseRosaryPlayerParams = {
  prayerKey: PrayerKey | null;
  rosaryStepIndex: number;
  locale: SupportedLocale;
  voiceGender: VoiceGender;
  playbackRate: PlaybackRate;
  onEnded?: () => void;
};

type UseRosaryPlayerReturn = {
  audioRef: RefObject<HTMLAudioElement | null>;
  words: readonly WordTimestamp[];
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  isLoading: boolean;
  activeWordIndex: number;
  lastStartedIndex: number;
  togglePlayPause: () => void;
  seekToWord: (startTime: number) => void;
};

export function useRosaryPlayer({
  prayerKey,
  rosaryStepIndex,
  locale,
  voiceGender,
  playbackRate,
  onEnded,
}: UseRosaryPlayerParams): UseRosaryPlayerReturn {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const rafRef = useRef<number | undefined>(undefined);
  // Refs keep callbacks and volatile values stable so event listeners never
  // need to be re-registered when the parent re-renders with new values.
  const onEndedRef = useRef(onEnded);
  const playbackRateRef = useRef(playbackRate);

  const [words, setWords] = useState<readonly WordTimestamp[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    onEndedRef.current = onEnded;
  }, [onEnded]);

  useEffect(() => {
    playbackRateRef.current = playbackRate;
  }, [playbackRate]);

  useEffect(() => {
    if (!prayerKey) return;

    let cancelled = false;

    // queueMicrotask defers setState out of the effect body to satisfy the
    // react-hooks/set-state-in-effect lint rule while still running before paint.
    queueMicrotask(() => {
      if (!cancelled) {
        setIsLoading(true);
        setWords([]);
      }
    });

    void fetchTimestamps(prayerKey, locale, voiceGender).then((data) => {
      if (!cancelled) {
        setWords(data);
        setIsLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [prayerKey, locale, voiceGender]);

  const audioSrc = prayerKey ? getAudioUrl(prayerKey, locale, voiceGender) : "";

  // When the step changes, pause and rewind without reloading the src so the
  // same prayer audio can restart immediately (e.g. repeated Ave Marias).
  // The audioSrc effect below handles the full reload when the prayer changes.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.pause();
    if (prayerKey && audio.src) {
      audio.currentTime = 0;
    }

    queueMicrotask(() => {
      setIsPlaying(false);
      setCurrentTime(0);
    });
  }, [rosaryStepIndex, prayerKey]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.pause();
    audio.src = audioSrc;
    audio.load();
    // Re-apply playbackRate here because audio.load() resets it to 1 on some browsers.
    audio.playbackRate = playbackRateRef.current;

    queueMicrotask(() => {
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
    });
  }, [audioSrc]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  // RAF loop drives currentTime while playing. The native "timeupdate" event
  // fires at ~4 Hz — too coarse for smooth per-word highlighting.
  useEffect(() => {
    const tick = () => {
      if (audioRef.current) {
        setCurrentTime(audioRef.current.currentTime);
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    if (isPlaying) {
      rafRef.current = requestAnimationFrame(tick);
    } else if (rafRef.current !== undefined) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = undefined;
    }

    return () => {
      if (rafRef.current !== undefined) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = undefined;
      }
    };
  }, [isPlaying]);

  // activeWordIndex: strictly within a word's start–end window. Returns -1
  // between words (silence gaps). Used for click-to-seek on individual words.
  const activeWordIndex = useMemo(
    () =>
      words.findIndex(
        (word) => currentTime >= word.start && currentTime <= word.end
      ),
    [currentTime, words]
  );

  // lastStartedIndex: last word whose start time has been passed. Stays on the
  // previous word during silence gaps, giving continuous highlight behaviour.
  const lastStartedIndex = useMemo(
    () => words.findLastIndex((w) => currentTime >= w.start),
    [currentTime, words]
  );

  const togglePlayPause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !prayerKey) return;

    if (isPlaying) {
      audio.pause();
    } else {
      void audio.play().catch(() => undefined);
    }
  }, [isPlaying, prayerKey]);

  const seekToWord = useCallback((startTime: number) => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.currentTime = startTime;
    void audio.play().catch(() => undefined);
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => {
      setIsPlaying(false);
      onEndedRef.current?.();
    };

    const handleLoadedMetadata = () => {
      audio.playbackRate = playbackRateRef.current;
      setDuration(audio.duration);
    };

    // timeupdate only syncs state while paused; the RAF loop handles it during
    // playback so we avoid redundant setState calls when both would fire.
    const handleTimeUpdate = () => {
      if (audio.paused) {
        setCurrentTime(audio.currentTime);
      }
    };

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [audioSrc]);

  return {
    audioRef,
    words: prayerKey ? words : [],
    isPlaying,
    currentTime,
    duration,
    isLoading: prayerKey ? isLoading : false,
    activeWordIndex,
    lastStartedIndex,
    togglePlayPause,
    seekToWord,
  };
}
