import type { PageLoad } from "./$types"

/**
 * When and where the meeting is, read off the line under the agenda's own rule.
 * The layout renders these into the page header; see $lib/calendar's
 * MeetingDetails for why none of it can come from the scrape.
 */
export const load: PageLoad = () => ({
  details: {
    time: "5:15 PM",
    location: {
      // All the agenda names is the room; the school is the heading above it.
      name: "Hunking Conference Room",
      // The room geocodes to nothing, and the agenda prints no address at all;
      // hand the map the school's own, which the city lists for the building.
      mapQuery: "100 Winchester Street, Haverhill, MA 01835",
    },
    // Unusually, the roster is this sitting's own document: the agenda's Roll
    // Call block names all sixteen people under the council's own three
    // headings -- "Admin:", "Staff:" and "Parents:", which are the roles given
    // here, "Parents" read singly. Nobody publishes this council's membership
    // anywhere else: the school's site invites parents to ask to join and names
    // no members, and the district's site-council pages carry none either, so
    // the agenda is the source linked beside the list. It is the list to be
    // called rather than an attendance record -- the sitting has not been held
    // -- so there is no roll call here, only the roster.
    members: {
      source: {
        title: "the council's own agenda for this sitting",
        url: "https://events.haverhillma.gov/default/Detail/2026-10-27-1715-Hunking-School-Site-Council-Meeting/afbc3e0c-e119-4ce0-82b3-b4ec00ddf958",
      },
      roster: [
        { name: "Timothy Betty", role: "Admin" },
        { name: "Susan Hall", role: "Staff" },
        { name: "Sydney Owen", role: "Staff" },
        { name: "Erin Niedbala", role: "Staff" },
        { name: "Jane Wuestkamp", role: "Staff" },
        { name: "Jessica Corcum", role: "Staff" },
        { name: "Jennifer Fielding", role: "Staff" },
        { name: "Kate Antaya", role: "Parent" },
        { name: "Melissa Geoffroy", role: "Parent" },
        { name: "Jeremy Holbrook", role: "Parent" },
        { name: "Nikky Troumbetas", role: "Parent" },
        { name: "Bobby Brown", role: "Parent" },
        { name: "Ryan Clarke", role: "Parent" },
        { name: "Hana Abualragheb", role: "Parent" },
        { name: "Tom Holt", role: "Parent" },
        { name: "Lindsey Clarke", role: "Parent" },
      ],
    },
  },
})
