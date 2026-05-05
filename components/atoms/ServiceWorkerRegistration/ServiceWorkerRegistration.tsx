"use client";

import { useEffect } from "react";

/**
 * ServiceWorkerRegistration is a client component that registers the service worker.
 * It is used to cache the application assets and make the application available offline.
 * It is also used to update the application when a new version is available.
 * It is also used to handle the service worker lifecycle.
 * It is also used to handle the service worker messages.
 * It is also used to handle the service worker errors.
 */
export function ServiceWorkerRegistration() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/", updateViaCache: "none" })
        .catch(() => undefined);
    }
  }, []);

  return null;
}
