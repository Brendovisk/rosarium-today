import type { AccentColor } from '@/lib/storage'

export const ACCENT_VARS: Record<AccentColor, { gold: string; dim: string; soft: string }> = {
  gold: { gold: '#c6a15b', dim: 'rgba(198,161,91,0.55)', soft: 'rgba(198,161,91,0.16)' },
  wine: { gold: '#a84c4e', dim: 'rgba(168,76,78,0.55)',  soft: 'rgba(168,76,78,0.16)'  },
  moss: { gold: '#7a9d7a', dim: 'rgba(122,157,122,0.55)', soft: 'rgba(122,157,122,0.16)' },
}

export const ACCENT_OPTIONS: { value: AccentColor; swatch: string }[] = [
  { value: 'gold', swatch: '#c6a15b' },
  { value: 'wine', swatch: '#a84c4e' },
  { value: 'moss', swatch: '#7a9d7a' },
]
