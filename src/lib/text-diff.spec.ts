import { describe, expect, it } from "vitest"
import { diffBlocks, diffTokens, runs, summarize, tokenize } from "./text-diff"

const p = (text: string) => ({ tag: "p", text })

describe("tokenize", () => {
  it("keeps a link's address on each of its words", () => {
    const tokens = tokenize("see [the city](https://a.example/x), and more")
    expect(tokens.map((t) => t.word)).toEqual(["see", "the", "city", ",", "and", "more"])
    expect(tokens.map((t) => t.href)).toEqual([
      undefined,
      "https://a.example/x",
      "https://a.example/x",
      undefined,
      undefined,
      undefined,
    ])
  })

  it("butts punctuation against a link it touches", () => {
    const tokens = tokenize("a [b](u), c")
    expect(tokens.map((t) => t.gap)).toEqual([false, true, false, true])
    expect(
      runs(tokens)
        .map((r) => r.text)
        .join(""),
    ).toBe("a b, c")
  })
})

describe("diffBlocks", () => {
  it("reports nothing for identical text", () => {
    const blocks = [p("one"), p("two")]
    expect(diffBlocks(blocks, blocks).every((c) => c.kind === "same")).toBe(true)
  })

  it("shows an edited paragraph as one change, not a removal and an addition", () => {
    const changes = diffBlocks(
      [p("The well will take two years to build.")],
      [p("The well will take three years to build.")],
    )
    expect(changes).toHaveLength(1)
    expect(changes[0].kind).toBe("changed")
    expect(summarize(changes)).toEqual({ added: 0, removed: 0, changed: 1 })
  })

  it("treats a rewritten paragraph as a removal and an addition", () => {
    const changes = diffBlocks(
      [p("Sewage was discharged upriver of the site.")],
      [p("The city announced emergency pumping from the Merrimack.")],
    )
    expect(changes.map((c) => c.kind).sort()).toEqual(["added", "removed"])
  })

  it("sees a changed address even when the words are the same", () => {
    const parts = diffTokens(
      tokenize("a [source](https://old.example)"),
      tokenize("a [source](https://new.example)"),
    )
    expect(parts.map((x) => x.kind)).toEqual(["same", "removed", "added"])
  })

  it("keeps blocks in the newer version's order", () => {
    const changes = diffBlocks([p("a"), p("c")], [p("a"), p("b"), p("c")])
    expect(changes.map((c) => c.kind)).toEqual(["same", "added", "same"])
  })

  it("does not pair a heading with a paragraph", () => {
    const changes = diffBlocks([{ tag: "h3", text: "Methuen water" }], [p("Methuen water")])
    expect(changes.map((c) => c.kind).sort()).toEqual(["added", "removed"])
  })
})
