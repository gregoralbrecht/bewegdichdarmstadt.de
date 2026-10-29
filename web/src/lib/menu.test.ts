import { describe, expect, it } from "vitest";
import { isCurrent, menu } from "./menu";

describe("menu", () => {
  it("lists the main pages in order", () => {
    expect(menu.map(({ href }) => href)).toEqual([
      "/",
      "/run-and-rave",
      "/festival",
      "/ueber-uns",
    ]);
  });
});

describe("isCurrent", () => {
  it("matches the same path, with or without a trailing slash", () => {
    expect(isCurrent("/festival", "/festival")).toBe(true);
    expect(isCurrent("/festival", "/festival/")).toBe(true);
  });

  it("matches / only on the start page", () => {
    expect(isCurrent("/", "/")).toBe(true);
    expect(isCurrent("/", "/festival")).toBe(false);
  });

  it("doesn't match a different page", () => {
    expect(isCurrent("/festival", "/impressum")).toBe(false);
    expect(isCurrent("/festival", "/festival-2027")).toBe(false);
  });
});
