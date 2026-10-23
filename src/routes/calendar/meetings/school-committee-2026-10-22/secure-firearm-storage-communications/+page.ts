import type { PageLoad } from "./$types"

/**
 * The agenda's line is a whole sentence -- "Request the Diversity, Health, and
 * Safety Subcommittee to develop recommendations for policy and/or directives
 * for communications to families on secure firearm storage" -- with no shorter
 * name printed anywhere, so the title is a few words naming what the item is
 * about and the sentence itself stays on this page, as section 4 of the
 * transcription rules directs.
 *
 * What the Committee is asked to do is refer a matter to a subcommittee, and
 * what the packet carries behind the request is reading: eight documents,
 * listed on a contents page of the city's own. Two of them are transcribed
 * here and the rest are linked.
 *
 * **The MASC draft resolution is transcribed** because it is the only
 * document in the packet that is a proposed text rather than background --
 * it is the model the recommendations would be built on, and it is a
 * two-column print a reader cannot search, the same reason the 8 October
 * sitting's five pages of the MASC Delegate Manual were transcribed. The
 * sections' own numbering and the resolution's slips stay as printed:
 * "unlocked firearm2 and every year", where the superscript 2 has fallen into
 * the line; "offence"; a reference 5 opening with a quotation mark it never
 * closes; and the footnote markers 1, 3, 2, 7, 6 and 9 in that order, with no
 * 4, 5 or 8 cited in the text at all.
 *
 * **The rest are linked rather than copied.** The Attorney General's and
 * Johns Hopkins' public-information leaflets, a Woburn newspaper's report of
 * that committee's own resolution, a CBS News report of the Oregon school
 * shooting of 17 October, an NIH author manuscript and a KFF analysis are
 * other people's publications, carried in the packet as evidence for the
 * request. Republishing them whole here would be copying third-party
 * journalism and research rather than rearranging Haverhill's own record,
 * which is what this site is for; each is one click away as the city's own
 * scan.
 *
 * The one exception among those is the statute. The packet attaches a print
 * of G.L. c. 140, section 131L off malegislature.gov, and that is the
 * Commonwealth's own published text at a stable address, so the foot of the
 * page links there as well as to the excerpt -- the law as it stands today
 * rather than as it was printed on 16 October.
 *
 * No sitting of the Diversity, Health and Safety Subcommittee is linked: the
 * request names no date, and the calendar has no sitting of that body posted.
 */
export const load: PageLoad = () => ({
  item: { title: "Secure Firearm Storage Communications" },
})
