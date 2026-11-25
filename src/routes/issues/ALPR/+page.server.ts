import type { PageServerLoad } from "./$types"
import { publication } from "$lib/server/issue-history"

/**
 * When the guide was published and last changed, from its page history
 * (`npm run alpr:snapshot`), so the page cannot say it was updated on a day
 * the history does not show.
 */
export const load: PageServerLoad = () => publication("alpr")
