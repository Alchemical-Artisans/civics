import type { PageLoad } from "./$types"

/**
 * The book's "Glossary of Terms", pages 232 to 245.
 *
 * The contents line calls it page 231, which is the divider before it; the
 * terms start on 232, and that is where the bar's source link opens.
 *
 * The terms themselves are in `$lib/data/glossary.json` rather than in this
 * directory, because the component that puts a definition under a word
 * elsewhere on the site reads them too. See `$lib/glossary`.
 */
export const load: PageLoad = () => ({
  section: { title: "Glossary", page: 232 },
})
