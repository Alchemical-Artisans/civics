import type { PageLoad } from "./$types"

/**
 * The agenda's own name for the item. The warrant heads itself "EV20261023"
 * and the agenda calls it "EV020261023" -- one zero apart, the same slip every
 * warrant since September carries -- and each spelling stays where the
 * document that prints it stands: the title and the page's opening sentence
 * are the agenda's, the table's caption is the warrant's own.
 *
 * `wide` for the reason the Auditor's reports ask for it: four columns, one of
 * them a thirty-two character account string, over eight hundred rows. There
 * is no reading on this page at all -- the page is the table.
 */
export const load: PageLoad = () => ({
  item: { title: "Warrant Number EV020261023" },
  wide: true,
})
