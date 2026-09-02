/**
 * The frame the two charts on a section page are drawn in.
 *
 * They are read together -- a table's flows above what those flows left behind
 * -- so a reader looks straight down from a year in one to the same year in the
 * other. That only works if both put the year in the same place, which is why
 * the geometry is here rather than twice.
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
 * sides. A bar cannot -- half of it would hang over the axis figures -- and a
 * year has to be in one place for both charts, so both use bands. The cost is
 * a little air at either end of a line, which is what a categorical axis looks
 * like anyway.
 */
export function bandCentre(at: number, count: number): number {
  return LEFT + (at + 0.5) * bandWidth(count)
}

export function bandWidth(count: number): number {
  return (WIDTH - LEFT - RIGHT) / Math.max(count, 1)
}
