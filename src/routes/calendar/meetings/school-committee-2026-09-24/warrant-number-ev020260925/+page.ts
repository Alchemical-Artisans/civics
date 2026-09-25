import type { PageLoad } from "./$types"

/**
 * The agenda's own name for the item. The warrant heads itself
 * "EV20260925" and the agenda calls it "EV020260925" -- one zero apart --
 * and each spelling stays where the document that prints it stands: the title
 * and the page's opening sentence are the agenda's, the table's caption is the
 * warrant's own.
 *
 * `wide` for the reason the Auditor's reports ask for it: four columns, one of
 * them a thirty-two character account string, over a thousand rows. There is
 * no reading on this page at all -- the page is the table.
 */
export const load: PageLoad = () => ({
  item: { title: "Warrant Number EV020260925" },
  wide: true,
})
