import type { PageLoad } from "./$types"

/**
 * The agenda's own name for the item, not the paper's: Dr. Grannemann's six
 * pages head themselves "Preparing to Meet the World", but the agenda line --
 * here and on 09.10.26, where the same discussion opened -- calls the matter
 * "Focus Areas for District Improvement", and that is the phrase a reader
 * following the discussion from one sitting to the next sees. The paper's own
 * title stays as the page's first heading, where the document puts it.
 */
export const load: PageLoad = () => ({
  item: { title: "Focus Areas for District Improvement" },
})
