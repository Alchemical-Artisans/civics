import type { PageLoad } from "./$types"

/**
 * When and where the sitting is, read off the notice itself. The notice prints
 * the day, hour and address in its own "This meeting will be held on:" block,
 * which the header already shows, so that block is not transcribed on the page.
 *
 * No `remote`: this notice offers no way to take part from elsewhere, unlike
 * the Authority's September and October board meetings, whose notices carry a
 * Zoom line for inclement weather.
 */
export const load: PageLoad = () => ({
  details: {
    time: "10:00 am",
    location: {
      // Verbatim from the notice, which gives this square the unit letter and
      // the 01830 zip where the Authority's own letterhead above it prints
      // "25 Washington Square ... 01831".
      name: "Haverhill Housing Authority, 25C Washington Square, Haverhill, MA 01830",
      // The unit geocodes to nothing; hand the map the street address.
      mapQuery: "25 Washington Square, Haverhill, MA 01830",
    },
    // The Authority's own offers about taking part, not boilerplate every
    // agenda in the city carries: who to call, and that it will translate and
    // accommodate on request.
    notice: [
      "Please call with any questions or concerns",
      "Translation services available upon request",
      "Reasonable accommodation available upon request",
    ],
    // The Authority's own Board & Meetings page, which names five commissioners
    // and the seat each holds. Five is the whole of a Massachusetts housing
    // authority board -- four local and the state's appointee, which this list
    // marks as such -- so no `partial`. The notice itself names nobody: the
    // only person on it is the staff member written comments go to.
    members: {
      source: {
        title: "the Authority's Board & Meetings page",
        url: "https://www.haverhillhousing.com/meetings.aspx",
      },
      roster: [
        { name: "Robert Driscoll", role: "Chairman" },
        { name: "Jonathan Goldfield", role: "Vice Chairman" },
        { name: "Dorothy Early", role: "Treasurer, State Appointee" },
        { name: "Fred Simmons", role: "Labor Representative" },
        { name: "Sheila Cuevas", role: "Tenant Representative" },
      ],
    },
  },
})
