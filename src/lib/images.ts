const u = (id: string, w = 900) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&q=80&auto=format&fit=crop`;

export const IMG = {
  dragonSleeve: u("1562962230-16e4623d36e6"),
  koi: u("1565058379802-bbe93b2f703a"),
  geometric: u("1611501275019-9b5cda994e8d"),
  blackwork: u("1598371839696-5c5bb00bdc28"),
  fineLine: u("1542727365-19732a80dcfd"),
  realism: u("1552627019-947c3789ffb5"),
  neoTrad: u("1612459284970-e8f027596582"),
  sleeve2: u("1568515045052-f9a854d70bfd"),
  back: u("1550537687-c91072c4792d"),
  studio: u("1527419105721-af1f23c86dec"),
  micro: u("1605497788044-5a32c7078486"),
  chest: u("1560707303-4e980ce876ad"),
  arm: u("1600359756098-8bc52195bbf4"),
  dark: u("1583454110551-21f2fa2afe61"),
  wave: u("1559599746-8823b38544c6"),
  skull: u("1534349762230-e0cadf78f5da"),
  floral: u("1571566882372-1598d88abd90"),
  minimal: u("1530103043960-ef38714abb15"),
  shoulder: u("1541417904950-b855846fe074"),
  portrait: u("1578301978693-85fa9c0320b9"),
  mandala: u("1559056199-641a0ac8b55e"),
  hand: u("1604881991720-f91add269bed"),
  ink: u("1590736704728-f4730bb30770"),
  ornamental: u("1475189778702-5ec9941484ae"),
  machine: u("1541960071727-c531398e7494"),
  leg: u("1618331835717-801e976710b2"),
  neck: u("1598300042247-d088f8ab3a91"),
  artist: u("1596727147705-61a532a659bd"),
  line: u("1564053489984-317bbd824340"),
  snake: u("1601046668428-94ea13437736"),
  tiger: u("1554126807-6b10f6f6692a"),
  script: u("1612528443702-f6741f70a049"),
};

export const AVATAR = {
  mert: u("1507003211169-0a1dd7228f2d", 200),
  templeBar: u("1527419105721-af1f23c86dec", 200),
  sakura: u("1562962230-16e4623d36e6", 200),
  canggu: u("1598371839696-5c5bb00bdc28", 200),
  karakoy: u("1542727365-19732a80dcfd", 200),
  warsaw: u("1583454110551-21f2fa2afe61", 200),
  soho: u("1596727147705-61a532a659bd", 200),
};

/** Curated concept art per style, used by the AI studio when no image API key is configured. */
export const STYLE_CONCEPTS: Record<string, string[]> = {
  "Irezumi / Japanese": [IMG.dragonSleeve, IMG.koi, IMG.wave, IMG.tiger],
  "Fine Line": [IMG.fineLine, IMG.minimal, IMG.line, IMG.script],
  Blackwork: [IMG.blackwork, IMG.dark, IMG.skull, IMG.leg],
  Realism: [IMG.realism, IMG.portrait, IMG.arm, IMG.snake],
  "Neo-Traditional": [IMG.neoTrad, IMG.floral, IMG.shoulder, IMG.chest],
  Geometric: [IMG.geometric, IMG.mandala, IMG.ornamental, IMG.hand],
};
