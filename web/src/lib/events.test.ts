import { describe, expect, it } from "vitest";
import { type Event, pastByYear } from "./events";

const runAndRave = (date: string): Event => ({ kind: "run-and-rave", date });

const season2026 = [
  runAndRave("2026-07-10"),
  runAndRave("2026-08-20"),
  runAndRave("2026-09-24"),
  runAndRave("2026-10-30"),
];

describe("pastByYear", () => {
  it("groups the 2026 season after it ended", () => {
    expect(pastByYear(season2026, "run-and-rave", "2026-11-10")).toEqual([
      {
        year: "2026",
        dates: ["2026-07-10", "2026-08-20", "2026-09-24", "2026-10-30"],
      },
    ]);
  });

  it("leaves out a date on the day itself", () => {
    expect(
      pastByYear([runAndRave("2026-11-10")], "run-and-rave", "2026-11-10"),
    ).toEqual([]);
  });

  it("leaves out later dates", () => {
    expect(
      pastByYear(
        [...season2026, runAndRave("2027-01-15")],
        "run-and-rave",
        "2026-11-10",
      ),
    ).toEqual([
      {
        year: "2026",
        dates: ["2026-07-10", "2026-08-20", "2026-09-24", "2026-10-30"],
      },
    ]);
  });

  it("leaves out other kinds", () => {
    expect(
      pastByYear(
        [{ kind: "festival", date: "2026-08-20" }, runAndRave("2026-07-10")],
        "run-and-rave",
        "2026-11-10",
      ),
    ).toEqual([{ year: "2026", dates: ["2026-07-10"] }]);
  });

  it("puts the newest year first", () => {
    expect(
      pastByYear(
        [runAndRave("2026-07-10"), runAndRave("2027-05-14")],
        "run-and-rave",
        "2027-11-10",
      ),
    ).toEqual([
      { year: "2027", dates: ["2027-05-14"] },
      { year: "2026", dates: ["2026-07-10"] },
    ]);
  });

  it("sorts unsorted dates", () => {
    expect(
      pastByYear(
        [
          runAndRave("2027-05-14"),
          runAndRave("2026-09-24"),
          runAndRave("2027-03-12"),
          runAndRave("2026-07-10"),
        ],
        "run-and-rave",
        "2027-11-10",
      ),
    ).toEqual([
      { year: "2027", dates: ["2027-03-12", "2027-05-14"] },
      { year: "2026", dates: ["2026-07-10", "2026-09-24"] },
    ]);
  });

  it("gives nothing for no events", () => {
    expect(pastByYear([], "run-and-rave", "2026-11-10")).toEqual([]);
  });
});
