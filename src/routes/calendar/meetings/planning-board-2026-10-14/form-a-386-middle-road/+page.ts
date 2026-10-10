import type { PageLoad } from "./$types"

/**
 * The item's own title, which the layout puts at the head of the page in place
 * of the agenda's. The agenda underlines only the heading "Endorsement of
 * Plans" above it, so the title is the line's own opening phrase, which names
 * the plan and the land; the applicant and the file number follow it on the
 * page itself.
 */
export const load: PageLoad = () => ({
  item: { title: "Form A 386 Middle Road" },
})
