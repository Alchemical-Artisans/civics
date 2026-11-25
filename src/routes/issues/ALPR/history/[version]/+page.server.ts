import type { EntryGenerator, PageServerLoad } from "./$types"
import { versionIds, versionPage } from "$lib/server/issue-history"

/** One page per recorded version, prerendered. */
export const entries: EntryGenerator = () => versionIds("alpr").map((version) => ({ version }))

export const load: PageServerLoad = ({ params }) => versionPage("alpr", params.version)
