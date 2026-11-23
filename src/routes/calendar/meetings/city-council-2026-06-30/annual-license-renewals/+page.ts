import type { PageLoad } from "./$types"

/**
 * The bucket's heading. Fifteen of its eighteen categories have nothing filed
 * against them this sitting, so the whole numbered list is here and the outline
 * carries one line, the way `annual-license-renewals` is written up on other
 * sittings. The applications are permit-portal printouts carrying drivers'
 * licence details, so they are not cut into excerpts.
 */
export const load: PageLoad = () => ({
  item: { title: "Annual License Renewals" },
})
