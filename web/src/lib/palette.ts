/** A text color on a surface color, both as token names without the leading `--`. */
export type Pair = { text: string; surface: string };

export type Swatch = { token: string; role: string; pairs: Pair[] };

/** The Color table in docs/styleguide.md, with the pairs it allows. */
export const swatches: Swatch[] = [
  {
    token: "ink",
    role: "Text, Rahmen, Schatten",
    pairs: [
      { text: "cream", surface: "ink" },
      { text: "white", surface: "ink" },
    ],
  },
  {
    token: "cream",
    role: "Seitenhintergrund",
    pairs: [{ text: "ink", surface: "cream" }],
  },
  {
    token: "white",
    role: "Karten und Eingabefelder",
    pairs: [{ text: "ink", surface: "white" }],
  },
  {
    token: "orange",
    role: "Hauptakzent: CTAs, Highlights",
    pairs: [{ text: "ink", surface: "orange" }],
  },
  {
    token: "pink",
    role: "Zweitakzent: Sticker, Tags",
    pairs: [{ text: "ink", surface: "pink" }],
  },
  {
    token: "indigo",
    role: "Dunkle Bänder, Footer, Signal",
    pairs: [
      { text: "white", surface: "indigo" },
      { text: "cream", surface: "indigo" },
      // The footer's focus ring.
      { text: "orange", surface: "indigo" },
    ],
  },
  {
    token: "muted",
    role: "Nebentext auf hell",
    pairs: [{ text: "muted", surface: "cream" }],
  },
  {
    token: "orange-deep",
    role: "Orange als Text oder Link",
    pairs: [{ text: "orange-deep", surface: "cream" }],
  },
  {
    token: "pink-deep",
    role: "Pink als Text",
    pairs: [{ text: "pink-deep", surface: "cream" }],
  },
];

/** The Color table's "never" rules. */
export const forbiddenPairs: Pair[] = [
  { text: "white", surface: "orange" },
  { text: "white", surface: "pink" },
  { text: "orange", surface: "cream" },
  { text: "pink", surface: "cream" },
];
