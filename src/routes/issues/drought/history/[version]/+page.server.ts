import type { EntryGenerator, PageServerLoad } from "./$types"
import { VERSION_IDS, versionPage } from "$lib/server/drought-history"

/** One page per recorded version, prerendered. */
export const entries: EntryGenerator = () => VERSION_IDS.map((version) => ({ version }))

export const load: PageServerLoad = ({ params }) => versionPage(params.version)
