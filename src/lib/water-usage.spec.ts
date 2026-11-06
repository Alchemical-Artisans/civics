import { describe, expect, it } from "vitest"
import { WATER_USAGE, WATER_USAGE_SOURCE, WATER_USAGE_STATED } from "./water-usage"

/**
 * These figures are a pixel reading of two slides, so what keeps them honest
 * is that each slide states a total the reading was not fitted to. Those
 * checks live here rather than in a comment: if anyone re-reads the charts
 * and the sums stop matching the department's own numbers, the new reading is
 * wrong and this fails.
 */
describe("WATER_USAGE", () => {
  /**
   * Paired, not summed separately: 2022 is null on five days, and totalling
   * each year on its own would silently drop those from one side of the
   * subtraction and understate the gap by about 32 million gallons. The first
   * version of this test did exactly that and failed by 12%.
   */
  const pairedGap = (
    a: (d: (typeof WATER_USAGE)[number]) => number | null,
    b: (d: (typeof WATER_USAGE)[number]) => number | null,
    days = WATER_USAGE,
  ) =>
    days.reduce((total, day) => {
      const x = a(day)
      const y = b(day)
      return x === null || y === null ? total : total + (x - y)
    }, 0)

  const pairedTotal = (
    of: (d: (typeof WATER_USAGE)[number]) => number | null,
    with_: (d: (typeof WATER_USAGE)[number]) => number | null,
  ) =>
    WATER_USAGE.reduce(
      (total, day) => (of(day) === null || with_(day) === null ? total : total + of(day)!),
      0,
    )

  it("covers April 15th to October 15th, a day at a time", () => {
    expect(WATER_USAGE.length).toBe(184)
    expect(WATER_USAGE[0].date).toBe("04-15")
    expect(WATER_USAGE.at(-1)!.date).toBe("10-15")
  })

  /**
   * "May 15 through September 13 - 150 million gallons less than 2022".
   * Summed over exactly those days, from the slide that states it.
   */
  it("reproduces the stated saving under the restrictions", () => {
    const window = WATER_USAGE.filter((d) => d.date >= "05-15" && d.date <= "09-13")
    const gap = pairedGap(
      (d) => d.mgd2022,
      (d) => d.mgd2026,
      window,
    )
    expect(gap).toBeGreaterThan(140)
    expect(gap).toBeLessThan(160)
    expect(Math.abs(gap - WATER_USAGE_STATED.restrictions.millionGallons) / 150).toBeLessThan(0.07)
  })

  /** "204 Million Gallons (10%) more in 2022", over the whole charted window. */
  it("reproduces the stated gap between the wet and dry summers", () => {
    const gap = pairedGap(
      (d) => d.mgd2022,
      (d) => d.mgd2023,
    )
    expect(Math.abs(gap - WATER_USAGE_STATED.wetAgainstDry.millionGallons) / 204).toBeLessThan(0.05)
  })

  /**
   * The slide's parenthetical is a share of the year, not of the months it
   * draws -- over the charted window the gap is about a fifth. Recorded so
   * nobody quotes the 10% against the summer.
   */
  it("shows the slide's percentage cannot be of the window it draws", () => {
    const gap = pairedGap(
      (d) => d.mgd2022,
      (d) => d.mgd2023,
    )
    const share =
      (100 * gap) /
      pairedTotal(
        (d) => d.mgd2023,
        (d) => d.mgd2022,
      )
    expect(share).toBeGreaterThan(18)
    expect(WATER_USAGE_STATED.wetAgainstDry.percentIsAnnual).toBe(true)
  })

  /** Nulls are days a line is hidden or undrawn; nothing is interpolated in. */
  it("leaves a hidden or undrawn day null rather than filling it", () => {
    expect(WATER_USAGE.filter((d) => d.mgd2022 === null).length).toBe(5)
    expect(WATER_USAGE.filter((d) => d.mgd2023 === null).length).toBe(0)
    // 2026's slide runs May 15th to September 13th and no further.
    const drawn = WATER_USAGE.filter((d) => d.mgd2026 !== null)
    expect(drawn[0].date).toBe("05-15")
    expect(drawn.at(-1)!.date).toBe("09-13")
  })

  /** Every reading is a plausible daily production figure, not a stray pixel. */
  it("keeps every value inside the axis the slides draw", () => {
    for (const day of WATER_USAGE) {
      for (const v of [day.mgd2022, day.mgd2023, day.mgd2026]) {
        if (v === null) continue
        expect(v).toBeGreaterThan(3)
        expect(v).toBeLessThan(10)
      }
    }
  })

  it("cites the sitting it was read from", () => {
    expect(WATER_USAGE_SOURCE.meetingId).toBe("city-council-2026-09-15")
    expect(WATER_USAGE_SOURCE.slides.length).toBe(2)
  })
})
