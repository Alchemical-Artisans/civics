import { describe, it, expect } from "vitest"
import { parseMeetingRules } from "./schedule.mjs"

/** The shape the page actually serves, trimmed to what the parser looks at. */
const page = `
<section class="content component usn_cmp_text base-bg">
  <div class="text base-text">
    <h2>City Council</h2>
    <p>Regular meetings of the City Council shall be held every Tuesday at 7:00 o&#39;clock P.M. except in:</p>
    <ul>
      <li>June there shall be a meeting on the first, third and fourth Tuesday.</li>
      <li>From July until the second Tuesday after Labor&nbsp;Day, the Council shall meet every other week.</li>
    </ul>
  </div>
</section>
<section class="content component usn_cmp_documentlisting">
  <h2>Agendas and Meeting Minutes</h2>
  <p>Search all files in this listing.</p>
</section>
`

describe("parseMeetingRules", () => {
  it("reads the board, the sentence and the exceptions", () => {
    const rules = parseMeetingRules(page)
    expect(rules).toHaveLength(1)
    expect(rules[0].board).toBe("City Council")
    expect(rules[0].intro).toBe(
      "Regular meetings of the City Council shall be held every Tuesday at 7:00 o'clock P.M. except in:",
    )
    expect(rules[0].exceptions).toHaveLength(2)
  })

  it("decodes entities and collapses the markup's whitespace", () => {
    // The page prints a typographic apostrophe as an entity and a non-breaking
    // space inside "Labor Day"; both have to survive as ordinary characters,
    // because the wording is compared against a pinned copy on the site side.
    const [rule] = parseMeetingRules(page)
    expect(rule.intro).toContain("o'clock")
    expect(rule.exceptions[1]).toContain("Labor Day")
    expect(rule.exceptions[1]).not.toMatch(/\s{2,}/)
  })

  it("ignores a text block with no list, and the listing's own headings", () => {
    // The rule is the list. A heading over a paragraph of something else is
    // not one, and the document listing section is not a text block at all.
    expect(parseMeetingRules(page).map((r) => r.board)).toEqual(["City Council"])
    expect(
      parseMeetingRules(
        `<section class="usn_cmp_text"><h2>Archives</h2><p>Use the links.</p></section>`,
      ),
    ).toEqual([])
  })

  it("returns nothing when the page's markup changes shape", () => {
    // The update script treats an empty result as a failure rather than writing
    // an empty file, so this is the signal that the scrape needs revisiting.
    expect(parseMeetingRules("<div><h2>City Council</h2><ul><li>Tuesdays</li></ul></div>")).toEqual(
      [],
    )
  })
})
