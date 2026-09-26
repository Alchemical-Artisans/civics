import type { PageLoad } from "./$types"

/**
 * The DPW Director's own subject line, which names the project the Mayor's
 * "An Order for Authority to File - State Revolving Fund Loan Application"
 * leaves to its second sentence.
 *
 * A separate matter from `south-mill-street-loan-order` on the meeting of
 * 15 September, which appropriates the money: this is the paperwork the state
 * requires before the city may apply for the loan that would fund it.
 */
export const load: PageLoad = () => ({
  item: { title: "South Mill Street Pumping Station Force Main – Authority to File" },
})
