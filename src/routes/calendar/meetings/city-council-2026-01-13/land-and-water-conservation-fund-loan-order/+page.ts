import type { PageLoad } from "./$types"

/**
 * The grant the order borrows against.
 *
 * The agenda and the clerk's cover sheets disagree about which document
 * number this is: the agenda calls the Land and Water Conservation Fund order
 * Doc 19-G and the PARC order Doc 19-H, while the cover sheet filed over the
 * Land and Water order is headed Document # 19-H and the one over the PARC
 * order Document # 19-G. The item quotes the agenda as printed and links the
 * papers that actually carry its own order.
 */
export const load: PageLoad = () => ({
  item: { title: "Loan Order, Land and Water Conservation Fund Grant" },
})
