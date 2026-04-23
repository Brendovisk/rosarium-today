export interface WordTimestamp {
  word: string
  start: number
  end: number
}

export type VoiceKey = 'latin/male' | 'latin/female' | 'pt-br/male' | 'pt-br/female'

export interface Prayer {
  id: string
  name: string
  audioFilenames: Record<VoiceKey, string>
  timestampFilenames: Record<VoiceKey, string>
}

export const VOICES: Array<{ key: VoiceKey; label: string }> = [
  { key: 'latin/male', label: 'Latin · Male' },
  { key: 'latin/female', label: 'Latin · Female' },
  { key: 'pt-br/male', label: 'PT-BR · Male' },
  { key: 'pt-br/female', label: 'PT-BR · Female' },
]

export const PRAYERS: Prayer[] = [
  {
    id: 'ave-maria',
    name: 'Ave Maria',
    audioFilenames: {
      'latin/male': 'ave-maria.mp3',
      'latin/female': 'ave maria.mp3',
      'pt-br/male': 'ave maria.mp3',
      'pt-br/female': 'ave maria.mp3',
    },
    timestampFilenames: {
      'latin/male': 'ave-maria.json',
      'latin/female': 'ave-maria.json',
      'pt-br/male': 'ave-maria.json',
      'pt-br/female': 'ave-maria.json',
    },
  },
  {
    id: 'pater-noster',
    name: 'Pater Noster',
    audioFilenames: {
      'latin/male': 'pater noster .mp3',
      'latin/female': 'pater noster .mp3',
      'pt-br/male': 'pater noster.mp3',
      'pt-br/female': 'pater noster .mp3',
    },
    timestampFilenames: {
      'latin/male': 'pater-noster-.json',
      'latin/female': 'pater-noster-.json',
      'pt-br/male': 'pater-noster.json',
      'pt-br/female': 'pater-noster-.json',
    },
  },
  {
    id: 'salve-regina',
    name: 'Salve Regina',
    audioFilenames: {
      'latin/male': ' salve regina.mp3',
      'latin/female': ' salve regina.mp3',
      'pt-br/male': ' salve regina.mp3',
      'pt-br/female': ' salve regina.mp3',
    },
    timestampFilenames: {
      'latin/male': 'salve-regina.json',
      'latin/female': 'salve-regina.json',
      'pt-br/male': 'salve-regina.json',
      'pt-br/female': 'salve-regina.json',
    },
  },
  {
    id: 'gloria-patri',
    name: 'Gloria Patri',
    audioFilenames: {
      'latin/male': 'doxologia minor.mp3',
      'latin/female': 'doxologia minor.mp3',
      'pt-br/male': 'doxologia minor.mp3',
      'pt-br/female': 'doxologia minor.mp3',
    },
    timestampFilenames: {
      'latin/male': 'doxologia-minor.json',
      'latin/female': 'doxologia-minor.json',
      'pt-br/male': 'doxologia-minor.json',
      'pt-br/female': 'doxologia-minor.json',
    },
  },
  {
    id: 'signum-crucis',
    name: 'Signum Crucis',
    audioFilenames: {
      'latin/male': 'signum-crucis.mp3',
      'latin/female': 'signum-crucis.mp3',
      'pt-br/male': 'signum-crucis.mp3',
      'pt-br/female': 'signum-crucis.mp3',
    },
    timestampFilenames: {
      'latin/male': 'signum-crucis.json',
      'latin/female': 'signum-crucis.json',
      'pt-br/male': 'signum-crucis.json',
      'pt-br/female': 'signum-crucis.json',
    },
  },
  {
    id: 'oratio-fatima',
    name: 'Oratio Fátima',
    audioFilenames: {
      'latin/male': 'oratio fatima.mp3',
      'latin/female': 'oratio fatima.mp3',
      'pt-br/male': 'oratio fatima.mp3',
      'pt-br/female': 'oratio fatima.mp3',
    },
    timestampFilenames: {
      'latin/male': 'oratio-fatima.json',
      'latin/female': 'oratio-fatima.json',
      'pt-br/male': 'oratio-fatima.json',
      'pt-br/female': 'oratio-fatima.json',
    },
  },
  {
    id: 'intercessio-mariae',
    name: 'Intercessio Mariae',
    audioFilenames: {
      'latin/male': 'intercessio mariae.mp3',
      'latin/female': 'intercessio mariae.mp3',
      'pt-br/male': 'intercessio mariae.mp3',
      'pt-br/female': 'intercessio mariae.mp3',
    },
    timestampFilenames: {
      'latin/male': 'intercessio-mariae.json',
      'latin/female': 'intercessio-mariae.json',
      'pt-br/male': 'intercessio-mariae.json',
      'pt-br/female': 'intercessio-mariae.json',
    },
  },
  {
    id: 'symbolum-apostolorum',
    name: 'Symbolum Apostolorum',
    audioFilenames: {
      'latin/male': ' symbolum apostolorum.mp3',
      'latin/female': ' symbolum apostolorum.mp3',
      'pt-br/male': 'symbolum apostolorum.mp3',
      'pt-br/female': ' symbolum apostolorum.mp3',
    },
    timestampFilenames: {
      'latin/male': 'symbolum-apostolorum.json',
      'latin/female': 'symbolum-apostolorum.json',
      'pt-br/male': 'symbolum-apostolorum.json',
      'pt-br/female': 'symbolum-apostolorum.json',
    },
  },
]

export function getAudioUrl(prayer: Prayer, voice: VoiceKey): string {
  const [lang, voiceType] = voice.split('/')
  return `/audios/${lang}/${voiceType}/${encodeURIComponent(prayer.audioFilenames[voice])}`
}

export function getTimestampUrl(prayer: Prayer, voice: VoiceKey): string {
  const [lang, voiceType] = voice.split('/')
  return `/timestamps/${lang}/${voiceType}/${encodeURIComponent(prayer.timestampFilenames[voice])}`
}
