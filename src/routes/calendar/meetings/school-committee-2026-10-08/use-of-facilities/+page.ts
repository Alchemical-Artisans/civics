import type { PageLoad } from "./$types"

/**
 * The agenda's own phrase. "as indicated in the agenda material" names the
 * material rather than the matter, so the title stops at the matter.
 *
 * The packet attaches three forms this time rather than one, filled in by hand
 * and scanned -- the Boston church of Christ for a Sunday service, the
 * Haverhill Hammers for winter wrestling practice at Pentucket Lake, and the
 * American Red Cross for a blood drive. One page for all three, the way a
 * bucket line's applicants share one: they are one item the Committee votes
 * on, and each form is told apart by its own excerpt filename rather than by a
 * directory.
 *
 * Each is transcribed field by field, fee table included, with the city's own
 * scans still linked beneath, for the reason the September form was: a reader
 * cannot search a scan of handwriting and a screen reader cannot read it at
 * all.
 *
 * Two fields of each form are not here: the representative's phone number and
 * email address. Everything else is the organisation's business with the
 * district -- who is asking, for which room, on what days, at what fee -- and
 * is why the item is on a public agenda; a named individual's phone and email
 * are neither, and copying them out of a scan into searchable, indexable text
 * is a step the city's own PDF does not take. The rule is applied the same way
 * to all three, including the Red Cross representative's work address at
 * redcross.org. The scans are linked below for anyone who needs a form entire.
 *
 * The signatures are drawings, so the rows that carry them are the form's
 * printed labels and nothing else; whether the principal signed is not lost by
 * it, since each form's own "Approved (v) Denied ( )" says so in words. The
 * Red Cross form is the one with neither box marked.
 *
 * Where a form was filled in and then corrected, both are kept: the church's
 * typed date, arrival time and end time were struck out and overwritten by
 * hand, and the transcription says which is which rather than quietly
 * preferring one.
 *
 * One mark is not transcribed: a note in the top margin of the church's form,
 * two words of cursive beginning "Sent", which could not be read at 400 dpi.
 */
export const load: PageLoad = () => ({
  item: { title: "Use of Facilities" },
})
