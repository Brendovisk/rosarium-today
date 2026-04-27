"use client";

import { useEffect, useState } from "react";

import type { MysteryKey } from "@/config/rosary";

const HISTORY_STORAGE_KEY = "rosarium:history";
const MAX_SESSIONS = 500;

type PrayerSession = {
  mysteryKey: MysteryKey;
  completedAt: string;
};

function isValidSession(s: unknown): s is PrayerSession {
  return (
    typeof s === "object" &&
    s !== null &&
    typeof (s as PrayerSession).mysteryKey === "string" &&
    typeof (s as PrayerSession).completedAt === "string"
  );
}

function readHistory(): PrayerSession[] {
  try {
    const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isValidSession);
  } catch {
    return [];
  }
}

export function recordCompletion(mysteryKey: MysteryKey): void {
  const sessions = readHistory();
  sessions.push({ mysteryKey, completedAt: new Date().toISOString() });
  localStorage.setItem(
    HISTORY_STORAGE_KEY,
    JSON.stringify(sessions.slice(-MAX_SESSIONS))
  );
}

function toLocalDateKey(isoString: string): string {
  const d = new Date(isoString);
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

function computeLastPrayedDaysAgo(sessions: PrayerSession[]): number | null {
  if (sessions.length === 0) return null;

  const last = new Date(sessions[sessions.length - 1].completedAt);
  const today = new Date();
  const todayMidnight = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  ).getTime();
  const lastMidnight = new Date(
    last.getFullYear(),
    last.getMonth(),
    last.getDate()
  ).getTime();

  return Math.max(0, Math.round((todayMidnight - lastMidnight) / 86_400_000));
}

function computeStreak(sessions: PrayerSession[]): number {
  if (sessions.length === 0) return 0;

  const prayedDates = new Set<string>(sessions.map((s) => toLocalDateKey(s.completedAt)));

  let streak = 0;
  const cursor = new Date();

  while (prayedDates.has(toLocalDateKey(cursor.toISOString()))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

type PrayerHistoryState = {
  lastPrayedDaysAgo: number | null;
  streak: number;
  isHydrated: boolean;
};

export function usePrayerHistory(): PrayerHistoryState {
  const [state, setState] = useState<PrayerHistoryState>({
    lastPrayedDaysAgo: null,
    streak: 0,
    isHydrated: false,
  });

  useEffect(() => {
    queueMicrotask(() => {
      const sessions = readHistory();
      setState({
        lastPrayedDaysAgo: computeLastPrayedDaysAgo(sessions),
        streak: computeStreak(sessions),
        isHydrated: true,
      });
    });
  }, []);

  return state;
}
