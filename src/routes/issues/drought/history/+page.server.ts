import type { PageServerLoad } from "./$types"
import { versionList } from "$lib/server/drought-history"

export const load: PageServerLoad = () => ({ versions: versionList() })
