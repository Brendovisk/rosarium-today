"use client";

import { useEffect, useRef } from "react";

const BACKGROUND_SOUND_SRC = "/background-sound/contemplative.mp3";

export function useBinauralAudio(enabled: boolean, volume: number) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio(BACKGROUND_SOUND_SRC);
    audio.loop = true;
    audio.volume = volume;
    audioRef.current = audio;

    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (enabled) {
      void audio.play().catch(() => undefined);
    } else {
      audio.pause();
    }
  }, [enabled]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) audio.volume = volume;
  }, [volume]);
}
