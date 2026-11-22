import type { PageLoad } from "./$types"

/**
 * The agenda prints no name for 3.1, only the sentence; this names what it is
 * about. 3.1.1, the order itself, is on this page under it rather than on the
 * outline, and the Deputy Director's communication with it.
 */
export const load: PageLoad = () => ({
  item: { title: "Loan Order, New Drinking Water Source" },
})
