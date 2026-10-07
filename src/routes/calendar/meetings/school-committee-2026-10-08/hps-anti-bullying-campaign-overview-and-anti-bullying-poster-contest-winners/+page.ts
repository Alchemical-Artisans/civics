import type { PageLoad } from "./$types"

/**
 * The agenda's own name for the item, exclamation mark and all, and the slug
 * is that title slugged -- long, but it is what the agenda prints and a reader
 * scanning the outline is looking for.
 *
 * What the packet attaches is a ten-slide deck, printed sideways into the
 * portfolio: landscape slides on portrait paper with no rotation, so the
 * excerpt is turned upright before it is committed. The slides' own words are
 * here; the finalists' drawings are drawings, so those three slides keep their
 * headings and nothing else and the excerpt is where a reader sees the logos.
 * The same goes for the photographs of the counsellors' training session and
 * for the Mind Up book cover.
 *
 * The deck calls it a logo contest where the agenda calls it a poster contest;
 * each stays as its own document prints it.
 */
export const load: PageLoad = () => ({
  item: { title: "HPS Anti-bullying Campaign Overview and Anti-bullying Poster Contest Winners!" },
})
