import type { PageLoad } from "./$types"

/**
 * When and where the meeting is, read off the head of the city's agenda. The
 * layout renders these into the page header; see $lib/calendar's
 * MeetingDetails for why none of it can come from the scrape.
 */
export const load: PageLoad = () => ({
  details: {
    // The agenda prints the hour bare, with no meridiem; kept as printed. The
    // notice behind it says 6:30 PM, but that is the dataset rather than the
    // document, and the dataset's clock times are not displayed.
    time: "6:30",
    location: {
      // The venue the meeting block names, over the address the letterhead
      // prints above it -- the same pairing the September agenda carried.
      name: "Citizen's Center, 10 Welcome Street, Haverhill, MA 01830",
      // The room geocodes to nothing; hand the map the street address.
      mapQuery: "10 Welcome Street, Haverhill, MA 01830",
    },
    // Nobody publishes this council's membership: the city's page for it has no
    // list, and the state's names only the chair, as the council's contact. The
    // ordinance sets the council at seven to twenty-two members, so `partial`.
    members: {
      source: {
        title: "Mass Cultural Council's page for the Haverhill Cultural Council",
        url: "https://massculturalcouncil.org/local-council/haverhill/",
      },
      partial: true,
      roster: [{ name: "John Hassan", role: "Chair" }],
    },
  },
})
