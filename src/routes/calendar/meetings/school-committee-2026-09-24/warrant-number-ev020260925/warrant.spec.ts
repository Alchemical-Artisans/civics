import { describe, expect, it } from "vitest"
import { LINES, TOTAL } from "./warrant"

/**
 * A thousand lines transcribed off a twenty-page print cannot be proofread by
 * eye, but the warrant states its own total, and so does the agenda item the
 * Committee votes on. Adding the lines up is what says the transcription is
 * complete: a row dropped, a row duplicated or a figure mistyped moves the
 * sum away from the $7,098,919.36 both documents print.
 */
describe("Warrant EV20260925", () => {
  /** `-($310.00)` is how the warrant prints a credit; cents, to avoid float drift. */
  const cents = (printed: string) => {
    const digits = Number(printed.replace(/[^\d]/g, ""))
    return printed.startsWith("-") ? -digits : digits
  }

  it("adds up to the total the warrant and the agenda both print", () => {
    const sum = LINES.reduce((running, line) => running + cents(line.total), 0)
    expect(sum).toBe(cents(TOTAL))
  })

  it("carries every line of the warrant", () => {
    expect(LINES).toHaveLength(1016)
  })

  /**
   * The warrant's own blank line under Scholastic Magazines, carrying a note
   * and nothing else. It is the one row with no amount, so the sum above
   * would not notice if it went missing.
   */
  it("keeps the warrant's own line with no vendor, amount or account", () => {
    const bare = LINES.filter((line) => line.total === "")
    expect(bare).toEqual([
      { vendor: "", total: "", account: "", detail: "All schools ordered seperatly" },
    ])
  })
})
