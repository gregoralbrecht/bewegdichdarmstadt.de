export type Swatch = {
  token: string;
  role: string;
  /** Placeholder value, not agreed with the client yet. */
  wip?: boolean;
};

/** The primitives in docs/styleguide.md's Color table. Components read surface roles instead. */
export const primitives: Swatch[] = [
  { token: "ink", role: "Text, Rahmen, dunkle Fläche" },
  { token: "night", role: "Dunkle Fläche: Run & Rave" },
  { token: "cream", role: "Seitenhintergrund" },
  { token: "white", role: "Karten und Eingabefelder" },
  { token: "orange", role: "Hauptakzent: CTAs, Highlights" },
  { token: "pink", role: "Laute Fläche, Hero-Ebene" },
  { token: "violet", role: "Laute Fläche, Hero-Ebene" },
  { token: "orange-deep", role: "Orange als Text oder Link auf hell" },
  { token: "muted-light", role: "Nebentext auf hell" },
  { token: "muted-dark", role: "Nebentext auf dunkel" },
];

/** The tag palette: tags and card fills only, always with ink text. */
export const tagNames = [
  "lime",
  "sky",
  "mint",
  "lilac",
  "yellow",
  "lavender",
  "peach",
] as const;

export type TagColor = (typeof tagNames)[number];

export const tagColors: Swatch[] = tagNames.map((name) => ({
  token: `tag-${name}`,
  role: "Tag",
  wip: true,
}));

/** Every surface in tokens.css, in the order the preview pages show them. */
export const surfaces = [
  "cream",
  "white",
  "night",
  "ink",
  "orange",
  "pink",
  "violet",
] as const;

export type Surface = (typeof surfaces)[number];
