import type { PageLoad } from "./$types"

/**
 * When and where the sitting is, read off the head of the city's notice. There
 * is no roll call here: the sitting is an agenda, not minutes, so the only
 * membership the page can state is the roster. See $lib/calendar's
 * MeetingDetails.
 *
 * The commission is back at City Hall this month, in Room #308 -- not the Room
 * 309 office its letterhead gives, and not the Buttonwoods Museum it sat at on
 * September 30.
 */
export const load: PageLoad = () => ({
  details: {
    time: "6:00 P.M.",
    location: {
      name: "Haverhill City Hall, 4 Summer Street, Room #308",
      // The room geocodes to nothing; hand the map the street address.
      mapQuery: "4 Summer Street, Haverhill, MA 01830",
    },
    // The Members table on the city's own page for the commission, which calls
    // it "a volunteer board made up of seven local residents" and names seven,
    // so no `partial`. The eighth row the table prints is labelled "Advisory"
    // by the city itself and is carried here with that as the role rather than
    // dropped: the page lists them among the members, not among staff. No
    // seats or offices are printed beside any of the names.
    members: {
      source: {
        title: "the city's Haverhill Historic Commission page",
        url: "https://www.haverhillma.gov/government/boards-committees-and-commissions/haverhill-historic-commission/",
      },
      roster: [
        { name: "Tom Wylie" },
        { name: "Peter Carbone" },
        { name: "Daniel Speers" },
        { name: "Eric Sanders" },
        { name: "Patricia Graham" },
        { name: "Kaitlin Wright" },
        { name: "Larry Olasky" },
        { name: "Michael Drossos", role: "Advisory" },
      ],
    },
  },
})
