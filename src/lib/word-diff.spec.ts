import { describe, it, expect } from "vitest"
import { wordDiff, similarity, type Run } from "./word-diff"

/** What a renderer draws: the marked runs, in order, trimmed for reading. */
const marked = (runs: Run[]) => runs.filter((r) => r.changed).map((r) => r.text.trim())

/** Joining the runs back together has to give the input back, gaps and all. */
const rejoined = (runs: Run[]) => runs.map((r) => r.text).join("")

describe("wordDiff", () => {
  it("marks nothing when the two are the same", () => {
    const { before, after } = wordDiff("no person shall violate", "no person shall violate")
    expect(marked(before)).toEqual([])
    expect(marked(after)).toEqual([])
  })

  it("marks a word replaced in the middle", () => {
    const { before, after } = wordDiff("this article is adopted", "this ordinance is adopted")
    expect(marked(before)).toEqual(["article"])
    expect(marked(after)).toEqual(["ordinance"])
  })

  it("marks an inserted clause on the side that has it", () => {
    const { before, after } = wordDiff(
      "for the production of food and fiber;",
      "for the production of food, including vegetable gardens, and fiber;",
    )
    expect(marked(before)).toEqual(["food"])
    expect(marked(after)).toEqual(["food, including vegetable gardens,"])
  })

  it("marks a deletion as changed on the before side only", () => {
    const { before, after } = wordDiff("the Director or Deputy Director", "the Director")
    expect(marked(before)).toEqual(["or Deputy Director"])
    expect(marked(after)).toEqual([])
  })

  it("keeps a citation together rather than diffing its punctuation", () => {
    const { before, after } = wordDiff("under MGL c. 40", "under M.G.L. c. 40")
    expect(marked(before)).toEqual(["MGL"])
    expect(marked(after)).toEqual(["M.G.L."])
  })

  it("loses nothing: the runs rejoin into what went in", () => {
    const b = "  A declaration shall include one or more of the following restrictions. "
    const a = "A declaration shall include one of the following conditions."
    const { before, after } = wordDiff(b, a)
    expect(rejoined(before)).toBe(b)
    expect(rejoined(after)).toBe(a)
  })

  it("handles an empty side", () => {
    const { before, after } = wordDiff("", "All Water Customers shall be subject to this.")
    expect(before).toEqual([])
    expect(marked(after)).toEqual(["All Water Customers shall be subject to this."])
  })
})

describe("similarity", () => {
  it("is 1 for identical text", () => {
    expect(similarity("Second violation: $50.", "Second violation: $50.")).toBe(1)
  })

  it("is high for an amended sentence", () => {
    expect(similarity("Second violation: $50.", "Second violation: $100.")).toBeGreaterThan(0.6)
  })

  it("is low for a sentence rewritten end to end", () => {
    expect(
      similarity(
        "Nonessential outdoor water use is prohibited at all times.",
        "All nonessential outdoor water uses are banned, except that watering of ornamentals and flower gardens with drip irrigation, hand-held hose, or watering can.",
      ),
    ).toBeLessThan(0.3)
  })
})
