export type MysteryKey = "joyful" | "sorrowful" | "glorious" | "luminous";

export const MYSTERIES: readonly MysteryKey[] = [
  "joyful",
  "sorrowful",
  "glorious",
  "luminous",
];

export const MYSTERY_GRADIENTS: Record<MysteryKey, string> = {
  joyful:
    "linear-gradient(135deg, rgba(198,161,91,0.22) 0%, rgba(146,64,14,0.12) 100%)",
  luminous:
    "linear-gradient(135deg, rgba(217,119,6,0.14) 0%, rgba(120,53,15,0.10) 100%)",
  sorrowful:
    "linear-gradient(135deg, rgba(122,46,47,0.25) 0%, rgba(75,62,50,0.16) 100%)",
  glorious:
    "linear-gradient(135deg, rgba(198,161,91,0.26) 0%, rgba(167,111,38,0.12) 100%)",
};

const MYSTERY_BY_DAY: Readonly<Record<number, MysteryKey>> = {
  0: "glorious",
  1: "joyful",
  2: "sorrowful",
  3: "glorious",
  4: "luminous",
  5: "sorrowful",
  6: "joyful",
};

export function getTodaysMystery(): MysteryKey {
  return MYSTERY_BY_DAY[new Date().getDay()];
}

export function isMysteryKey(value: string): value is MysteryKey {
  return MYSTERIES.includes(value as MysteryKey);
}

export type ArtworkPosition = "center" | "top" | "bottom";

export type Artwork = {
  src: string;
  width: number;
  height: number;
  alt: string;
  position: ArtworkPosition;
};

const INTRO_ARTWORKS: Readonly<Partial<Record<string, Artwork>>> = {
  symbolumApostolorum: {
    src: "/artwork/introduction/apostles-creed/francesco_cairo_la_santisima_trinidad.jpg",
    width: 800,
    height: 798,
    alt: "La Santísima Trinidad — Francesco Cairo",
    position: "top",
  },
  paterNoster: {
    src: "/artwork/introduction/our-father/bartolome_esteban_murillo_the_heavenly_and_earthly_trinities_cropped.jpg",
    width: 2500,
    height: 1445,
    alt: "The Heavenly and Earthly Trinities — Bartolomé Esteban Murillo",
    position: "center",
  },
  "avePro.fide": {
    src: "/artwork/introduction/hail-mary-1/philippe_de_champaigne_la_annonciation.jpg",
    width: 3559,
    height: 3470,
    alt: "L'Annonciation — Philippe de Champaigne",
    position: "center",
  },
  "avePro.spe": {
    src: "/artwork/introduction/hail-mary-2/luca_giordano_the_annunciation.jpg",
    width: 2671,
    height: 3722,
    alt: "The Annunciation — Luca Giordano",
    position: "center",
  },
  "avePro.caritate": {
    src: "/artwork/introduction/hail-mary-3/bartolome_esteban_murillo_the_madonna_of_the_rosary.jpg",
    width: 3824,
    height: 6056,
    alt: "The Madonna of the Rosary — Bartolomé Esteban Murillo",
    position: "top",
  },
  salveRegina: {
    src: "/artwork/introduction/hail-holy-queen/william_adolphe_bouguereau_the_virgin_with_angels.jpg",
    width: 1627,
    height: 2572,
    alt: "The Virgin with Angels — William-Adolphe Bouguereau",
    position: "top",
  },
};

export const MYSTERY_ARTWORKS: Record<MysteryKey, readonly Artwork[]> = {
  joyful: [
    {
      src: "/artwork/joyful/auguste_pichon_the_annunciation.jpg",
      width: 2686,
      height: 3414,
      alt: "The Annunciation — Auguste Pichon",
      position: "center",
    },
    {
      src: "/artwork/joyful/unkown_the_annunciation.png",
      width: 2998,
      height: 1558,
      alt: "The Annunciation — Unknown",
      position: "center",
    },
    {
      src: "/artwork/joyful/bartolomé_esteban_perez_murillo_adoración_de_los_pastores.jpg",
      width: 2717,
      height: 2237,
      alt: "Adoración de los Pastores — Bartolomé Esteban Pérez Murillo",
      position: "center",
    },
    {
      src: "/artwork/joyful/philippe_de_champaigne_the_presentation_of_the_temple.jpg",
      width: 2994,
      height: 3906,
      alt: "The Presentation of the Temple — Philippe de Champaigne",
      position: "center",
    },
    {
      src: "/artwork/joyful/hofmann_the_boy_jesus_in_the_temple.webp",
      width: 1920,
      height: 1415,
      alt: "The Boy Jesus in the Temple — Hofmann",
      position: "center",
    },
  ],
  sorrowful: [],
  glorious: [],
  luminous: [],
};

export function getStepArtwork(
  mysteryKey: MysteryKey,
  step: { type: string; label: string; decadeIndex: number | null }
): Artwork | null {
  if (step.type === "opening" || step.type === "closing") {
    return INTRO_ARTWORKS[step.label] ?? null;
  }
  if (step.label === "gloriaPatri" || step.label === "oratio") return null;
  const artworks = MYSTERY_ARTWORKS[mysteryKey];
  if (!artworks.length) return null;
  return artworks[(step.decadeIndex ?? 0) % artworks.length] ?? null;
}
