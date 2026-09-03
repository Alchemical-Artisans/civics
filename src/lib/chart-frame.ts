/**
 * The frame `BudgetLines` draws in.
 *
 * This used to be shared with `BudgetBars` as well, back when the two sat on
 * one page and a reader looked straight down from a year in one to the same
 * year in the other -- which is what made a shared frame worth having rather
 * than one geometry typed twice. They no longer share a page or an axis:
 * `BudgetBars` is a row per year now, keeps its own frame, and this one is
 * `BudgetLines`' alone.
 *
 * A fixed viewBox scaled to whatever width the page gives it, so these are the
 * drawing's own units and not pixels.
 */
export const WIDTH = 640
export const HEIGHT = 210

/** Room at the left for the figures at the ends of the scale. */
export const LEFT = 62
export const RIGHT = 16
export const TOP = 10
/** Room under the plot for the year. */
export const FOOT = 24

/**
 * Where a year sits: the middle of its own band, not the edge of the plot.
 *
 * A line chart would happily put its first and last point hard against the
 * sides. Bands keep the years evenly spaced regardless, which costs a little
 * air at either end of the line -- what a categorical axis looks like anyway.
 */
export function bandCentre(at: number, count: number): number {
  return LEFT + (at + 0.5) * bandWidth(count)
}

export function bandWidth(count: number): number {
  return (WIDTH - LEFT - RIGHT) / Math.max(count, 1)
}
