import type { PageLoad } from "./$types"

/**
 * When and where the meeting is, read off the notice itself. The layout
 * renders these into the page header; see $lib/calendar's MeetingDetails for
 * why none of it can come from the scrape.
 *
 * The notice is a letter from the committee chairperson to the City Clerk, so
 * the salutation, the paragraph naming the day and the room, the signature and
 * the distribution list are all about the scheduling rather than the business
 * and none of them is in the write-up -- the same as the Natural Resources and
 * the Planning and Development committees' own notices.
 *
 * No highlights. The two tests below would both pass -- each item is a motion
 * the Council discussed at length before referring it here -- but this notice
 * carries two items and nothing else, so lifting both of them above the
 * outline would reprint the outline rather than select from it.
 */
export const load: PageLoad = () => ({
  details: {
    time: "6:00 PM",
    location: {
      name: "City Council Chambers, Room 202, City Hall, 4 Summer Street",
      // The room geocodes to nothing; hand the map the street address.
      mapQuery: "4 Summer Street, Haverhill, MA 01830",
    },
    // The chairperson's letter prints the join link; the HC Media email behind
    // it, which is the notice's own attachment, prints the Meet code and the
    // dial-in number beside the same link. A reader joining by telephone needs
    // those and would otherwise have to open the PDF to find them.
    remote: {
      url: "https://meet.google.com/zai-aeqs-pet",
      how: [
        "Or open Meet and enter this code: zai-aeqs-pet",
        "Dial in (audio only): (US) +1 423-607-0056 PIN: 890 013 368#",
      ],
    },
    // The "Public Health, Safety & Works Committee (Public Safety)" block of
    // the city's committee-assignments page, which prints all five seats for
    // the 2026-2028 term, so no `partial`. The chairperson is the one seat the
    // page names; the other four it lists as members. "Councilor" is dropped
    // from each name, the role saying it.
    members: {
      source: {
        title: "the city's City Council Committees page",
        url: "https://www.haverhillma.gov/government/mayor-and-council/city-councilors/city-council-committees/",
      },
      roster: [
        { name: "Michael S. McGonagle", role: "Chairperson" },
        { name: "Colin LePage" },
        { name: "Ralph T. Basiliere" },
        { name: "Thomas J. Sullivan" },
        { name: "Shaun P. Toohey" },
      ],
    },
  },
})
