import { describe, it, expect } from "vitest"
import { after, before, diff, diffLines, fromComparison, type Redline } from "./redline"

const text = (runs: { text: string }[]) => runs.map((r) => r.text).join("")
const marked = (runs: { text: string; changed: boolean }[]) =>
  runs.filter((r) => r.changed).map((r) => r.text.trim())

describe("before and after", () => {
  const block = {
    text: [
      "motorized scooter",
      { struck: ", two wheels " },
      { added: " or motorized bicycles" },
      { struck: ". A motorcycle," },
      " as defined",
    ],
  }

  it("reads today's text out of the kept and struck words", () => {
    expect(before(block)).toBe("motorized scooter, two wheels. A motorcycle, as defined")
  })

  it("reads the amended text out of the kept and added words", () => {
    expect(after(block)).toBe("motorized scooter or motorized bicycles as defined")
  })
})

describe("diffLines", () => {
  const redline: Redline = [
    { kind: "heading", text: ["§ 1 Title."] },
    { text: ["Unchanged."] },
    { text: ["A fine of $", { added: "2" }, "5", { struck: "0" }, "."] },
    { text: [{ struck: "Gone entirely." }] },
    { text: [{ added: "Wholly new." }] },
  ]
  const lines = diffLines(redline)

  it("draws an unchanged paragraph as one context line on both sides", () => {
    expect(lines[1]).toMatchObject({ type: "context", old: 2, new: 2 })
  })

  it("draws an amended paragraph as a removed line then an added line", () => {
    expect(lines[2]).toMatchObject({ type: "removed", old: 3 })
    expect(text(lines[2].runs)).toBe("A fine of $50.")
    expect(marked(lines[2].runs)).toEqual(["0"])
    expect(lines[3]).toMatchObject({ type: "added", new: 3 })
    expect(text(lines[3].runs)).toBe("A fine of $25.")
    expect(marked(lines[3].runs)).toEqual(["2"])
  })

  it("draws a paragraph only one side has on that side alone", () => {
    expect(lines[4]).toMatchObject({ type: "removed", old: 4 })
    expect(lines[4].new).toBeUndefined()
    expect(lines[5]).toMatchObject({ type: "added", new: 4 })
    expect(lines[5].old).toBeUndefined()
  })
})

describe("diff", () => {
  const same = (n: number): Redline => Array.from({ length: n }, (_, i) => ({ text: [`p${i}`] }))
  const redline: Redline = [
    { kind: "heading", text: ["§ 1 First."] },
    ...same(5),
    { text: ["a ", { struck: "b" }, { added: "c" }] },
    ...same(5),
  ]
  const shown = diff(redline)

  it("folds unchanged text away, keeping a paragraph either side of a change", () => {
    expect(shown.hunks).toHaveLength(1)
    expect(shown.hunks[0].hidden).toHaveLength(5)
    expect(shown.hunks[0].lines.map((l) => l.type)).toEqual([
      "context",
      "removed",
      "added",
      "context",
    ])
    expect(shown.trailing).toHaveLength(4)
  })

  it("names the section a hunk falls in and its ranges", () => {
    expect(shown.hunks[0].section).toBe("§ 1 First.")
    expect(shown.hunks[0].old).toEqual({ start: 6, count: 3 })
    expect(shown.hunks[0].new).toEqual({ start: 6, count: 3 })
  })

  it("counts paragraphs added and removed", () => {
    expect(shown.added).toBe(1)
    expect(shown.removed).toBe(1)
  })
})

describe("fromComparison", () => {
  const redline = fromComparison([
    {
      now: { number: "§ 250-25", title: "Declaration." },
      proposed: { number: "§ 250-25.1", title: "Declaration." },
      rows: [
        { label: "A.", now: ["The City may declare."], proposed: ["The City shall declare."] },
        { label: "AGRICULTURE", proposed: ["Farming."] },
        { now: ["Old wording here."], proposed: ["Something else."], rewritten: true },
      ],
    },
  ])

  it("marks a renumbered heading by the characters that moved", () => {
    expect(before(redline[0])).toBe("§ 250-25 Declaration.")
    expect(after(redline[0])).toBe("§ 250-25.1 Declaration.")
  })

  it("leads a lettered provision with its letter, and marks the words between", () => {
    expect(before(redline[1])).toBe("A. The City may declare.")
    expect(after(redline[1])).toBe("A. The City shall declare.")
    expect(redline[1].text).toContainEqual({ struck: "may" })
  })

  it("prints a defined term on its own line, on the side that has it", () => {
    expect(redline[2]).toMatchObject({ kind: "term" })
    expect(before(redline[2])).toBe("")
    expect(after(redline[2])).toBe("AGRICULTURE")
  })

  it("strikes a rewritten provision whole and adds its replacement whole", () => {
    expect(redline[4].text).toEqual([{ struck: "Old wording here." }])
    expect(redline[5].text).toEqual([{ added: "Something else." }])
  })
})
