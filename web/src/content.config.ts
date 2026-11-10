import { defineCollection } from "astro:content";
import { file } from "astro/loaders";
import { z } from "astro/zod";
import { isIsoDate } from "./lib/date";

const events = defineCollection({
  loader: file("src/content/events.yaml"),
  schema: z.object({
    kind: z.enum(["run-and-rave", "festival"]),
    date: z.string().refine(isIsoDate, "Not a real day in YYYY-MM-DD form"),
  }),
});

export const collections = { events };
