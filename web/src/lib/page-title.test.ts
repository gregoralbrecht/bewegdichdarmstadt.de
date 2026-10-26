import { describe, expect, it } from "vitest";
import { SITE_NAME, pageTitle } from "./page-title";

describe("pageTitle", () => {
  it("returns the site name without a page title", () => {
    expect(pageTitle()).toBe(SITE_NAME);
    expect(pageTitle("   ")).toBe(SITE_NAME);
  });

  it("appends the site name to a page title", () => {
    expect(pageTitle(" Run Club ")).toBe("Run Club | Beweg dich, Darmstadt!");
  });
});
