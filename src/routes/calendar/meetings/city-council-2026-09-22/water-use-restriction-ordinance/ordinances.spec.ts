import { describe, it, expect } from "vitest"
import { COMPARISON, type Row } from "./ordinances"
import { similarity } from "$lib/word-diff"

const rows = COMPARISON.flatMap((part) => part.rows.map((row) => ({ part: part.key, row })))

/** Both sides of a provision as one passage, for measuring how far they differ. */
const passage = (side: string[] | undefined) => (side ?? []).join(" ")

/** Only a provision both versions have can be compared at all. */
const paired = rows.filter(({ row }) => row.now?.length && row.proposed?.length)

describe("the comparison's own keys", () => {
  it("names each provision once within its section", () => {
    for (const part of COMPARISON) {
      const keys = part.rows.map((r) => r.key)
      expect(new Set(keys).size, `duplicate key in ${part.key}`).toBe(keys.length)
    }
  })

  it("names each section once", () => {
    const keys = COMPARISON.map((p) => p.key)
    expect(new Set(keys).size).toBe(keys.length)
  })

  it("gives every section at least one version's own number and title", () => {
    for (const part of COMPARISON) expect(part.now ?? part.proposed, part.key).toBeDefined()
  })

  it("gives every provision text on at least one side", () => {
    for (const { part, row } of rows)
      expect(row.now?.length || row.proposed?.length, `${part}/${row.key}`).toBeTruthy()
  })
})

/**
 * Whether a provision was amended or rewritten is a judgement the comparison
 * states by hand -- a word-level diff cannot tell the difference, which is the
 * whole reason the flag exists. What a test can do is keep the judgement
 * honest against the words actually transcribed, so a correction made to a
 * transcription later cannot quietly leave a rewritten provision drawn with
 * word marks that say nothing, or a lightly amended one hidden behind
 * "Rewritten".
 *
 * The two thresholds sit either side of a gap the transcriptions actually
 * leave: the least-similar amendment measures 0.43 (§ 250-25.2A, where the
 * order keeps the sentence and doubles its length) and the most-similar
 * rewrite 0.23. The point is to catch a transcription that has moved out from
 * under its flag, not to relitigate every borderline call.
 */
describe("amended against rewritten", () => {
  const measured = paired.map(({ part, row }: { part: string; row: Row }) => ({
    at: `${part}/${row.key}`,
    rewritten: row.rewritten === true,
    similarity: similarity(passage(row.now), passage(row.proposed)),
  }))

  it("finds little of the wording kept where a provision is called rewritten", () => {
    for (const m of measured.filter((m) => m.rewritten))
      expect(m.similarity, m.at).toBeLessThan(0.35)
  })

  it("finds most of the wording kept where a provision is called amended", () => {
    for (const m of measured.filter((m) => !m.rewritten))
      expect(m.similarity, m.at).toBeGreaterThan(0.4)
  })
})

/**
 * The changes a reader of this page is looking for. Transcribed off the two
 * PDFs by eye, so these pin the figures and hours that the order actually
 * moves -- the ones a misread scan would get wrong and nothing else would
 * catch.
 */
describe("what the order changes", () => {
  const row = (part: string, key: string) => {
    const found = rows.find((r) => r.part === part && r.row.key === key)
    if (!found) throw new Error(`no ${part}/${key}`)
    return found.row
  }

  it("raises every fine and adds a fourth step", () => {
    expect(passage(row("violations", "second").now)).toContain("$50")
    expect(passage(row("violations", "second").proposed)).toContain("$100")
    expect(passage(row("violations", "third").now)).toContain("$100")
    expect(passage(row("violations", "third").proposed)).toContain("$200")
    expect(row("violations", "fourth").now).toBeUndefined()
    expect(passage(row("violations", "fourth").proposed)).toContain("$300")
  })

  it("adds a fifth drought stage above the current top trigger", () => {
    const top = row("method", "trigger-over-35")
    expect(top.now).toBeUndefined()
    expect(passage(top.proposed)).toContain("Level 4 Drought Emergency")
  })

  it("turns the declaration from something the City may do into something it shall", () => {
    expect(passage(row("declaration", "text").now)).toContain("may declare")
    expect(passage(row("declaration", "text").proposed)).toContain("shall declare")
  })

  it("restricts the summer hours year on year, which today's article does not set at all", () => {
    const baseline = COMPARISON.find((p) => p.key === "baseline")
    expect(baseline?.now).toBeUndefined()
    expect(passage(baseline?.rows[0].proposed)).toContain("May 15 through September 30")
  })
})
