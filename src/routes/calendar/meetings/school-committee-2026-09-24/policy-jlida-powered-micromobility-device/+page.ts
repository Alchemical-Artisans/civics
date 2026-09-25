import type { PageLoad } from "./$types"

/**
 * The agenda's own name for what the Policy Subcommittee brings: "a revision
 * to Policy JLIDA Powered Micromobility Device", here for its third reading
 * and a vote. The file letters are part of the name a school committee uses
 * for a policy, so the title and the directory keep them -- the same policy
 * came back on 09.10.26 for its second reading and will come back again, and
 * a matter that returns keeps one name across every sitting it appears at.
 *
 * The packet attaches the policy alone, not a comparison against the version
 * in force: the sheet is dated "Approved by the Haverhill School Committee
 * 08.13.26" and nothing says which words the revision moves, so there is
 * nothing here to set side by side the way an order that replaces an article
 * of the Code is.
 */
export const load: PageLoad = () => ({
  item: { title: "Policy JLIDA Powered Micromobility Device" },
})
