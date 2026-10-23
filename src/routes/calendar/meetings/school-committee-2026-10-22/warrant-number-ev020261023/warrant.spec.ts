import { describe, expect, it } from "vitest"
import { LINES, TOTAL } from "./warrant"

/**
 * Eight hundred lines transcribed off a fifteen-page print cannot be
 * proofread by eye, but the warrant states its own total, and so does the
 * agenda item the Committee votes on. Adding the lines up is what says the
 * transcription is complete: a row dropped, a row duplicated or a figure
 * mistyped moves the sum away from the $4,445,025.60 both documents print.
 */
describe("Warrant EV20261023", () => {
  /** Cents, to avoid float drift; a credit prints as `-($33.41)`. */
  const cents = (printed: string) => {
    const digits = Number(printed.replace(/[^\d]/g, ""))
    return printed.startsWith("-") ? -digits : digits
  }

  it("adds up to the total the warrant and the agenda both print", () => {
    const sum = LINES.reduce((running, line) => running + cents(line.total), 0)
    expect(sum).toBe(cents(TOTAL))
  })

  it("carries every line of the warrant", () => {
    expect(LINES).toHaveLength(811)
  })

  /**
   * Unlike September's, this warrant has an amount on every line: the blank
   * row that one carried under Scholastic Magazines has no counterpart here,
   * so the sum above covers the whole table.
   */
  it("has no line without an amount", () => {
    expect(LINES.filter((line) => line.total === "")).toEqual([])
  })
})
