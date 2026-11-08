const u = (id: string, w = 900) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&q=80&auto=format&fit=crop`;

/** Freely licensed tattoo photography bundled in /public/img (see public/img/CREDITS.md). */
const l = (name: string) => `/img/${name}.jpg`;

export const IMG = {
  dragonSleeve: l("sleeve-flickr-stiller-beobachter"),
  koi: l("close-up-phoenix-full-sleeve-tattoo-by-maaika"),
  geometric: l("dom-carter-geometric-tattoo"),
  blackwork: l("dragon-blackwork-tattoo"),
  fineLine: u("1542727365-19732a80dcfd"),
  realism: l("b057-andrea-afferni-realism-portrait-animal-tatt"),
  neoTrad: l("view-1-half-sleeve-tatoo"),
  sleeve2: u("1611501275019-9b5cda994e8d"),
  studio: u("1527419105721-af1f23c86dec"),
  micro: l("celtic-knot-tattoo"),
  chest: l("man-chest-tattoo-monument-to-yuri-gagarin-astron"),
  arm: l("bellerophon-forearm-black-and-white-cover-up-tat"),
  dark: l("dlaffb-dark-letterin-abstracto-freehand-fusionad"),
  wave: l("colourful-back-tattoo"),
  floral: u("1598371839696-5c5bb00bdc28"),
  minimal: l("small-icosihemidodecahedron"),
  shoulder: l("view-2-half-sleeve-tatoo"),
  portrait: u("1562962230-16e4623d36e6"),
  mandala: l("dom-carter-blackwork-owl-tattoo"),
  hand: l("compass-and-feather-sleeve-start"),
  ink: u("1550537687-c91072c4792d"),
  ornamental: l("dom-carter-butterfly-blackwork-tattoo"),
  machine: u("1565058379802-bbe93b2f703a"),
  neck: l("man-with-eagle-on-the-back-at-tattoo-convention"),
  artist: l("edoardo-tabacchi"),
  line: l("purple-haired-woman-with-arm-tattoo"),
  tiger: l("full-back-tattoo"),
  script: u("1542727365-19732a80dcfd", 600),
};

export const AVATAR = {
  mert: u("1507003211169-0a1dd7228f2d", 200),
  templeBar: u("1527419105721-af1f23c86dec", 200),
  sakura: l("female-tattoo-artist-at-work-at-the-internationa"),
  canggu: l("edoardo-tabacchi"),
  karakoy: u("1565058379802-bbe93b2f703a", 200),
  warsaw: u("1550537687-c91072c4792d", 200),
  soho: u("1562962230-16e4623d36e6", 200),
};

/** Curated concept art per style, used by the AI studio when no image API key is configured. */
export const STYLE_CONCEPTS: Record<string, string[]> = {
  "Irezumi / Japanese": [IMG.dragonSleeve, IMG.koi, IMG.tiger, IMG.sleeve2],
  "Fine Line": [IMG.fineLine, IMG.micro, IMG.portrait, IMG.minimal],
  Blackwork: [IMG.blackwork, IMG.dark, IMG.ornamental, IMG.mandala],
  Realism: [IMG.realism, IMG.arm, IMG.chest, IMG.portrait],
  "Neo-Traditional": [IMG.neoTrad, IMG.floral, IMG.shoulder, IMG.wave],
  Geometric: [IMG.geometric, IMG.ornamental, IMG.hand, IMG.minimal],
};
