/**
 * How a diff is drawn here: GitHub's palette, down to the hex.
 *
 * One copy, because the site now draws more than one shape of diff -- a run
 * of paragraphs (`OrdinanceDiff`), and a rate schedule whose rows are its
 * lines -- and the whole point of drawing an amendment this way is that a
 * reader who has looked at a pull request already knows what the red and the
 * green mean. Two palettes a shade apart would cost exactly that.
 *
 * `chart-colours.ts` is the same idea for the charts.
 */

/** A line's own colours, the sign in its gutter, and what a screen reader hears. */
export const LINE = {
  context: { row: "bg-white", gutter: "bg-white", sign: " ", label: "Unchanged" },
  removed: { row: "bg-[#ffebe9]", gutter: "bg-[#ffd7d5]", sign: "-", label: "Removed" },
  added: { row: "bg-[#e6ffec]", gutter: "bg-[#ccffd8]", sign: "+", label: "Added" },
}

/**
 * The darker background on the words -- or the figures -- that actually
 * moved, inside a line whose own colour has already said which side it is on.
 * No strike and no underline: GitHub's way, and the line has said it once.
 */
export const WORD = {
  context: "",
  removed: "bg-[#ff818266]",
  added: "bg-[#abf2bc]",
}

/** GitHub's five-square bar, beside the counts in a diff's header. */
export const SQUARE = {
  added: "bg-[#1f883d]",
  removed: "bg-[#cf222e]",
  neutral: "bg-[#d0d7de]",
}

/** The header's buttons: the layout choice, "Expand all", the strike-through. */
export const DIFF_BUTTON =
  "rounded-md border border-[#d0d7de] bg-white px-3 py-1 text-xs font-medium text-[#1f2328] no-underline hover:bg-[#f3f4f6]"

/** The rule between a diff's header and its lines, and around the whole panel. */
export const DIFF_BORDER = "border-[#d0d7de]"
