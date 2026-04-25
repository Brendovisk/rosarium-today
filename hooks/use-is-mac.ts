"use client";

import { useEffect, useState } from "react";

import { isMacOS } from "@/utils/platform";

export function useIsMac(): boolean {
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    queueMicrotask(() => setIsMac(isMacOS()));
  }, []);

  return isMac;
}
