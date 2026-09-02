/**
 * The budget book's own glossary, and the lookup the pages use.
 *
 * `src/lib/data/glossary.json` is the FY2027 book's "Glossary of Terms", pages
 * 232 to 245, transcribed by hand -- it is the one file in `data/` that no
 * scraper writes, because the book has no text layer and the glossary had to be
 * read off rendered pages like every other section of it.
 *
 * It sits in `$lib` rather than beside the book's route because three things
 * need it: the glossary page, the `GlossaryTerm` component a page wraps a word
 * in, and `scripts/check-glossary.mjs`, which is a node script and so reads the
 * JSON rather than this module. A second book with a different glossary would
 * make this per-book; there is one book.
 */
import glossary from "./data/glossary.json"

export interface Term {
  /** The term as the glossary heads it: "Free Cash". */
  term: string
  /**
   * What the book prints where that is not the term alone -- "Valuation (100%)",
   * "Tax Rate Recapitulation Sheet (also Recap Sheet)". The glossary page shows
   * this; everything else matches on `term`.
   */
  printed?: string
  /** The page it is defined on. */
  page: number
  /** The definition, as printed. */
  definition: string
}

/** Every term the book defines, in the order it defines them. */
export const TERMS: Term[] = glossary.terms

/** Where the transcription came from, for the page that shows it. */
export const SOURCE = glossary.source

let byName: Map<string, Term> | null = null

/**
 * The definition of a term, matched on the glossary's own name for it and not
 * on how a page happens to write it -- a page may say "free cash" mid-sentence,
 * or "levies" for "Levy". A term the glossary does not define throws rather
 * than rendering an empty tooltip, because that is a typo in a page.
 */
export function define(term: string): Term {
  byName ??= new Map(TERMS.map((t) => [t.term.toLowerCase(), t]))

  const found = byName.get(term.toLowerCase())
  if (!found) throw new Error(`No glossary term "${term}"`)
  return found
}

/** `free-cash`, for the glossary page's own anchors. */
export const termSlug = (term: string) =>
  term
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
