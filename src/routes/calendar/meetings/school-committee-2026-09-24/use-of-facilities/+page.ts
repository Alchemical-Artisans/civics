import type { PageLoad } from "./$types"

/**
 * The agenda's own phrase. "as indicated in the agenda material" names the
 * material rather than the matter, so the title stops at the matter.
 *
 * The packet attaches one form, filled in by hand and scanned: Haverhill Stars
 * Special Olympics asking for the Silver Hill gym on Tuesday evenings from
 * November to March. A scan of handwriting is exactly what §7 of the
 * transcription rules is about -- a reader cannot search it and a screen
 * reader cannot read it at all -- so the form is transcribed field by field,
 * the fee table included, with the city's own scan still linked beneath.
 *
 * Two of the form's fields are not here: the representative's phone number and
 * his email address. Everything else on the form is the organization's
 * business with the district -- who is asking, for which room, on what nights,
 * at what fee -- and is why the item is on a public agenda at all. A private
 * individual's phone and email are neither, and copying them out of a scan
 * into searchable, indexable text is a step the city's own PDF does not take.
 * The scan is linked below for anyone who needs the form entire. (The email is
 * also only half legible: the handwriting runs off the cell's edge with no
 * domain ending, and guessing at it is barred as much as publishing it.)
 *
 * The signatures are drawings, so the rows that carry them are the form's
 * printed labels and nothing else -- the same rule that leaves a sparkline
 * column out of the Auditor's reports. Whether the principal signed is not
 * lost by it: the form's own "Approved (v) Denied ( )" says so in words.
 */
export const load: PageLoad = () => ({
  item: { title: "Use of Facilities" },
})
