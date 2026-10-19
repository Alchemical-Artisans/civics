import { describe, expect, it } from "vitest"
import { amended, isHeading, tableCounts, tableLines, tableRows, type TableLine } from "$lib/diff"

const SCHEDULE: TableLine[] = [
  { heading: "Vehicles" },
  { label: "Under 9,000 lbs.", cells: [{ was: "$91", now: "$96" }, "$5"] },
  { label: "A rate nobody touched", cells: ["$12", ""] },
]

describe("a table diff", () => {
  it("counts a line the amendment touches, whatever else is in the row", () => {
    expect(SCHEDULE.map(amended)).toEqual([false, true, false])
    expect(tableCounts(SCHEDULE)).toEqual({ added: 1, removed: 1 })
  })

  it("numbers lines from two, the headed columns being the table's first", () => {
    expect(tableLines(SCHEDULE).map((l) => l.n)).toEqual([2, 3, 4])
  })

  it("draws an amended line twice and an untouched one once", () => {
    expect(tableRows(SCHEDULE).map((r) => [r.type, r.old, r.new])).toEqual([
      ["context", 2, 2],
      ["removed", 3, undefined],
      ["added", undefined, 3],
      ["context", 4, 4],
    ])
  })

  it("knows a group's own line from a rate", () => {
    expect(SCHEDULE.filter(isHeading)).toEqual([{ heading: "Vehicles" }])
  })
})
