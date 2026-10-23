import type { PageLoad } from "./$types"

/**
 * The agenda's phrase cut to the matter, the way the October sitting's items
 * are: "Superintendent's Recommendation to declare items surplus and dispose
 * of in accordance with city ordinances as indicated in the agenda material"
 * is who is recommending it and what the Committee may do about it; declaring
 * the items surplus is what it is about.
 *
 * The packet attaches two surplus forms, and both are transcribed: the
 * Curriculum Department's typed memo listing 635 History and Social Studies
 * textbooks, and the Burnham School's, filled in by hand. One item, one page,
 * the way a sitting's several use-of-facilities forms share one -- they are
 * one recommendation the Committee votes on.
 *
 * The Burnham form is marked "do NOT Need" in every row. The hand mixes its
 * capitals from row to row -- "NOt" in one, "NOT" in the next, the same word
 * either way -- and the transcription prints one form rather than guessing at
 * eleven, since nothing turns on which letter was capitalised. Spellings are
 * the writer's: "lower storager Rm" is the seventh row as written. Five rows
 * give a count in the form's own column and six put it in brackets after the
 * item instead; the table keeps each where the form puts it rather than
 * moving them into one column.
 *
 * The thirteen pages after the forms are photographs of the Burnham furniture
 * -- a cabinet, three desks, a nurse's rolling cart, a bookshelf, stacked
 * chairs, pallets. There is nothing in a photograph to transcribe, so they
 * are linked with the forms rather than described.
 */
export const load: PageLoad = () => ({
  item: { title: "Declare Items Surplus" },
})
