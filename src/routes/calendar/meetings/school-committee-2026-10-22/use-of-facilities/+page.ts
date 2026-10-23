import type { PageLoad } from "./$types"

/**
 * The agenda's own phrase. "as indicated in the agenda material" names the
 * material rather than the matter, so the title stops at the matter.
 *
 * The packet opens with the Facilities Department's own one-page summary of
 * the three requests and the fees negotiated for each, and then attaches the
 * five forms they rest on -- Synergy Basketball's three, one per weeknight at
 * Bradford Elementary, Ocasio's TMA's for the Hunking gym, and the Boston
 * church of Christ's for the High School auditorium. One page for all of
 * them, the way a bucket line's applicants share one: they are one item the
 * Committee votes on.
 *
 * Each form is transcribed field by field, fee table included, with the city's
 * own scan still linked beneath, for the reason the October forms were: a
 * reader cannot search a scan of handwriting and a screen reader cannot read
 * it at all.
 *
 * Two fields of each form are not here: the representative's phone number and
 * email address, dropped for the reason the 8 October sitting's forms give --
 * everything else is the organisation's business with the district and is why
 * the item is on a public agenda, where a named individual's phone and email
 * are neither.
 *
 * The signatures are drawings, so a row carrying one gives the name the
 * signature spells where it can be read and nothing else; whether the
 * principal signed is not lost by it, since each form's own "Approved ( )
 * Denied ( )" says so in words.
 *
 * Three of Synergy Basketball's lists of dates are struck through in part: the
 * September and early-October dates have gone and what is left is the 10/27 to
 * 11/20 run the summary page prices. "22nd" on the Tuesday form is ringed by
 * hand with a line drawn to the note at the foot -- "September 22nd will not
 * work! We have an event, per our conversation" -- so both the ring and the
 * note are transcribed rather than one standing for the other. The church's
 * form has a typed date struck out and a handwritten Sunday 11/01/26 written
 * over it; the struck date is scored through too heavily to read beyond its
 * leading "10/", and is left unread rather than guessed at.
 *
 * "Ocotber" on the Friday form and the church's lower-case "church of Christ"
 * are the forms' own spellings.
 */
export const load: PageLoad = () => ({
  item: { title: "Use of Facilities" },
})
