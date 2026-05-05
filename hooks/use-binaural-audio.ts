"use client";

import { useEffect } from "react";

const BACKGROUND_SOUND_SRC = "/background-sound/contemplative.mp3";

let audio: HTMLAudioElement | null = null;
let playPromise: Promise<void> | null = null;

const getAudio = (): HTMLAudioElement => {
  if (!audio) {
    audio = new Audio(BACKGROUND_SOUND_SRC);
    audio.loop = true;
  }

  return audio;
};

export function useBinauralAudio(enabled: boolean, volume: number) {
  useEffect(() => {
    getAudio().volume = volume;
  }, [volume]);

  useEffect(() => {
    const a = getAudio();

    if (!enabled) {
      if (playPromise) {
        playPromise.then(() => a.pause()).catch(() => a.pause());
        playPromise = null;
      } else {
        a.pause();
      }
      return;
    }

    let unlockAdded = false;

    const unlock = () => {
      document.removeEventListener("click", unlock);
      document.removeEventListener("keydown", unlock);
      document.removeEventListener("touchstart", unlock);

      const p = a.play();

      if (p) {
        playPromise = p;
        p.then(() => {
          if (playPromise === p) playPromise = null;
        }).catch(() => {
          if (playPromise === p) playPromise = null;
        });
      }
    };

    const p = a.play();

    if (p) {
      playPromise = p;

      p.then(() => {
        if (playPromise === p) playPromise = null;
      }).catch(() => {
        if (playPromise === p) playPromise = null;
        unlockAdded = true;

        document.addEventListener("click", unlock);
        document.addEventListener("keydown", unlock);
        document.addEventListener("touchstart", unlock);
      });
    }

    return () => {
      if (unlockAdded) {
        document.removeEventListener("click", unlock);
        document.removeEventListener("keydown", unlock);
        document.removeEventListener("touchstart", unlock);
      }
    };
  }, [enabled]);
}
