import type { PageLoad } from "./$types"

/**
 * The announcement's subject and day. The Chairperson's letter to the Clerk
 * behind it names the one matter the committee meets on, Doc. 21-B, the Battery
 * Energy Storage Systems Overlay District; its thirty pages of attachments are
 * that ordinance's file. The sitting itself is in `meetings.json`, from its
 * notice, minutes and recording, so it needs no placeholder.
 */
export const load: PageLoad = () => ({
  item: { title: "Planning and Development Committee Meeting, July 7, 2026" },
})
