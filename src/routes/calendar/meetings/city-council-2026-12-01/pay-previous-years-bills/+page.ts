import type { PageLoad } from "./$types"

/**
 * The Mayor's own subject line, "FY25 Bills", which is the title the same kind
 * of order carries on 20 and 27 October. The invoices behind it -- sixty-eight
 * pages, among them vehicle inspection reports and phone bills -- are not
 * excerpted; the city's full file, linked from the sitting, carries them.
 */
export const load: PageLoad = () => ({
  item: { title: "FY25 Bills" },
})
