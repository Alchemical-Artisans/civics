import type { PageLoad } from "./$types"

/**
 * The agenda gives this item a sentence rather than a name; the title names
 * the gift. The packet also carries a scan of the donor's cheque, which is not
 * excerpted: it is a bank instrument, and the letter and order already state
 * the amount and the giver.
 */
export const load: PageLoad = () => ({
  item: { title: "Council on Aging Ice Cream Social Gift" },
})
