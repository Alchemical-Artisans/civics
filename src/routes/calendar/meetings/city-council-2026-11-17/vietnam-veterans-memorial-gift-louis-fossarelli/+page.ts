import type { PageLoad } from "./$types"

/**
 * The agenda prints "the following gift order" and then the order's sentence;
 * neither is a name. The packet also holds the donor's cheque, which is left
 * out of the excerpts: it carries account and routing numbers.
 */
export const load: PageLoad = () => ({
  item: { title: "Gift to the Vietnam Veterans Memorial in Honor of Louis Fossarelli" },
})
