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
      position: "top",
    },
    {
      src: "/artwork/joyful/hofmann_the_boy_jesus_in_the_temple.webp",
      width: 1920,
      height: 1415,
      alt: "The Boy Jesus in the Temple — Hofmann",
      position: "center",
    },
  ],
  sorrowful: [
    {
      src: "/artwork/sorrowful/george_richmond_the_agony_in_the_garden.jpg",
      width: 4462,
      height: 4032,
      alt: "The Agony in the Garden — George Richmond",
      position: "center",
    },
    {
      src: "/artwork/sorrowful/juan_patricio_morlete_ruiz_christ_consoled_by_the_angels.jpg",
      width: 3037,
      height: 2337,
      alt: "Christ Consoled by the Angels — Juan Patricio Morlete Ruiz",
      position: "center",
    },
    {
      src: "/artwork/sorrowful/michelangelo_merisi_the_crowning_with_thorns.jpg",
      width: 5256,
      height: 3987,
      alt: "The Crowning with Thorns — Michelangelo Merisi da Caravaggio",
      position: "center",
    },
    {
      src: "/artwork/sorrowful/titian_christ_carrying_the_Cross.jpg",
      width: 3051,
      height: 2635,
      alt: "Christ Carrying the Cross — Titian",
      position: "center",
    },
    {
      src: "/artwork/sorrowful/diego_velazquez_cristo_crucificado.jpg",
      width: 2046,
      height: 3051,
      alt: "Cristo Crucificado — Diego Velázquez",
      position: "top",
    },
  ],
  glorious: [
    {
      src: "/artwork/glorious/alexander_ivanov_christs_appearance_to_mary_magdalene_after_the_resurrection.jpg",
      width: 4725,
      height: 3556,
      alt: "Christ's Appearance to Mary Magdalene after the Resurrection — Alexander Ivanov",
      position: "center",
    },
    {
      src: "/artwork/glorious/benjamin_west_the_ascension.jpg",
      width: 1743,
      height: 2560,
      alt: "The Ascension — Benjamin West",
      position: "top",
    },
    {
      src: "/artwork/glorious/jean_II_restout_pentecost.jpg",
      width: 1240,
      height: 730,
      alt: "Pentecost — Jean II Restout",
      position: "center",
    },
    {
      src: "/artwork/glorious/assumption_of_the_virgin_bartolome_murillo.jpg",
      width: 3183,
      height: 4305,
      alt: "Assumption of the Virgin — Bartolomé Esteban Murillo",
      position: "top",
    },
    {
      src: "/artwork/glorious/diego_Velezquez_coronation_of_the_virgin.jpg",
      width: 2292,
      height: 3051,
      alt: "Coronation of the Virgin — Diego Velázquez",
      position: "top",
    },
  ],
  luminous: [
    {
      src: "/artwork/luminous/antoine_coypel_the_Baptism_of_Christ.jpg",
      width: 1513,
      height: 2100,
      alt: "The Baptism of Christ — Antoine Coypel",
      position: "center",
    },
    {
      src: "/artwork/luminous/bartolome_esteban_murillo-the_marriage_feast_at_cana.jpg",
      width: 3688,
      height: 2816,
      alt: "The Marriage Feast at Cana — Bartolomé Esteban Murillo",
      position: "center",
    },
    {
      src: "/artwork/luminous/hoffman_christ_and_the_rich_young_ruler.jpg",
      width: 4324,
      height: 3412,
      alt: "Christ and the Rich Young Ruler — Hoffman",
      position: "center",
    },
    {
      src: "/artwork/luminous/luca_giordano_transfiguration_of_christ.jpeg",
      width: 2250,
      height: 1634,
      alt: "Transfiguration of Christ — Luca Giordano",
      position: "top",
    },
    {
      src: "/artwork/luminous/juan_de_juanes_ultima_cena.jpg",
      width: 1920,
      height: 1215,
      alt: "The Last Supper — Juan de Juanes",
      position: "center",
    },
  ],
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
