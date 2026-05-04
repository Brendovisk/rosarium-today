"use client";

import { useEffect, useRef } from "react";

import { isMacOS } from "@/utils/platform";

export function useKeyboardShortcuts(
  onKeyDown: (e: KeyboardEvent, mod: boolean) => void
) {
  const callbackRef = useRef(onKeyDown);

  useEffect(() => {
    callbackRef.current = onKeyDown;
  });

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return;

      const mod = isMacOS() ? e.metaKey : e.ctrlKey;
      callbackRef.current(e, mod);
    }

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);
}
