import type { PageLoad } from "./$types"

/** The agenda prints a sentence; the title is the document the President is announcing. */
export const load: PageLoad = () => ({
  item: { title: "2027 City Council Meeting Schedule" },
})
