import { describe, expect, it } from "vitest";
import { formatDate, isIsoDate, today } from "./date";

describe("formatDate", () => {
  it("shows day and month by default", () => {
    expect(formatDate("2026-07-10")).toBe("10. Juli");
  });

  it("adds the weekday and the year when asked", () => {
    expect(formatDate("2027-09-11", { weekday: true, year: true })).toBe(
      "Samstag, 11. September 2027",
    );
    expect(formatDate("2027-09-11", { year: true })).toBe("11. September 2027");
    expect(formatDate("2027-09-11", { weekday: true })).toBe(
      "Samstag, 11. September",
    );
  });

  it("keeps the first and the last of the month on their day", () => {
    expect(formatDate("2027-01-01", { year: true })).toBe("1. Januar 2027");
    expect(formatDate("2026-12-31", { year: true })).toBe("31. Dezember 2026");
  });

  it("throws on anything but a real ISO date", () => {
    expect(() => formatDate("2027-02-30")).toThrow(RangeError);
    expect(() => formatDate("11.09.2027")).toThrow(RangeError);
    expect(() => formatDate("")).toThrow(RangeError);
  });
});

describe("isIsoDate", () => {
  it("accepts a real day", () => {
    expect(isIsoDate("2027-09-11")).toBe(true);
  });

  it("rejects days that don't exist and other forms", () => {
    expect(isIsoDate("2027-02-30")).toBe(false);
    expect(isIsoDate("11.09.2027")).toBe(false);
    expect(isIsoDate("")).toBe(false);
  });
});

describe("today", () => {
  it("is an ISO date", () => {
    expect(today()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});
