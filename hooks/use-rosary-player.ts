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
import {
  fetchTimestamps,
  getAudioUrl,
  type PrayerKey,
  type WordTimestamp,
} from "@/config/rosary";
import type { PlaybackRate, VoiceGender } from "@/config/settings";

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

export const useRosaryPlayer = ({
  prayerKey,
  rosaryStepIndex,
  locale,
  voiceGender,
  playbackRate,
  onEnded,
}: UseRosaryPlayerParams): UseRosaryPlayerReturn => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const rafRef = useRef<number | undefined>(undefined);
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

  const activeWordIndex = useMemo(
    () =>
      words.findIndex(
        (word) => currentTime >= word.start && currentTime <= word.end
      ),
    [currentTime, words]
  );

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
};
