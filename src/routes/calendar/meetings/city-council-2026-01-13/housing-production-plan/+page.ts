import type { PageLoad } from "./$types"

/**
 * The agenda's own name for the matter, which is also what the Planning
 * Director's letter is headed. The plan's own cover pages disagree about which
 * five years it covers -- the draft says 2025-2030, the final 2026-2031 -- so
 * neither span is in the title.
 */
export const load: PageLoad = () => ({
  item: { title: "Haverhill Housing Production Plan" },
})
