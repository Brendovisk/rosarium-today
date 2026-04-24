export const PLAYBACK_RATES = [0.75, 1.0, 1.25, 1.5] as const
export type PlaybackRate = (typeof PLAYBACK_RATES)[number]
