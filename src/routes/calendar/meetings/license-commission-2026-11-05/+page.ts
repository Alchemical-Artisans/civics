import type { PageLoad } from "./$types"

/**
 * When and where the meeting is, read off the head of the city's agenda. The
 * layout renders these into the page header; see $lib/calendar's
 * MeetingDetails for why none of it can come from the scrape.
 */
export const load: PageLoad = () => ({
  details: {
    time: "6:00 PM",
    location: {
      name: "City Council Chambers – Room 202",
      // The room geocodes to nothing; hand the map the street address.
      mapQuery: "4 Summer Street, Haverhill, MA 01830",
    },
    remote: {
      url: "https://meet.google.com/qrt-dzxk-you",
      meetingId: "qrt-dzxk-you",
      how: ["Dial in (audio only): (US) +1 330-800-5962 PIN: 302 266 259#"],
    },
    notice: [
      "This meeting/hearing of Haverhill License Commission will be held in-person at the location provided on this notice. Members of the public are welcome to attend this in-person meeting. Please note that while an option for remote attendance and/or participation is being provided as a courtesy to the public, the meeting/hearing will not be suspended or terminated if technological problems interrupt the virtual broadcast, unless otherwise required by law. Members of the public with particular interest in any specific item on this agenda should make plans for in-person vs. virtual attendance accordingly.",
    ],
    members: {
      source: {
        title: "the city's License Commission page",
        url: "https://www.haverhillma.gov/government/boards-committees-and-commissions/license-commission/",
      },
      roster: [
        { name: "Elizabeth A. Laliberty", role: "Chairperson" },
        { name: "Patrick J. Driscoll" },
        { name: "Linda L. Koutoulas" },
      ],
    },
    /**
     * All three of Continued Business. Each was taken up at length on
     * September 3 -- the minutes give each its own recorded discussion and a
     * roll-call vote continuing it to this sitting -- and in each the
     * Commission set a condition that comes due here: Klin Thai to report its
     * construction complete by October 26, Union Supermarket to bring "a very
     * complete and concise idea" of when it will open, against a suggestion
     * the §15 licence be revoked, and Paul Francis Bridal to reinstate with
     * the Secretary of the Commonwealth.
     */
    highlights: [
      {
        item: "klin-thai-status-of-business",
        title: "Klin Thai Haverhill – Status of Business",
        number: "3.1",
        reasons: [
          {
            kind: "discussed-before",
            meetings: [
              {
                id: "license-commission-2026-09-03",
                label: "License Commission, September 3, 2026",
              },
            ],
          },
        ],
      },
      {
        item: "union-supermarket-status-of-business",
        title: "Union Supermarket – Status of Business",
        number: "3.2",
        reasons: [
          {
            kind: "discussed-before",
            meetings: [
              {
                id: "license-commission-2026-09-03",
                label: "License Commission, September 3, 2026",
              },
            ],
          },
        ],
      },
      {
        item: "paul-francis-bridal-dissolved-corporation",
        title: "Paul Francis Bridal – Operating with a Dissolved Corporation",
        number: "3.3",
        reasons: [
          {
            kind: "discussed-before",
            meetings: [
              {
                id: "license-commission-2026-09-03",
                label: "License Commission, September 3, 2026",
              },
            ],
          },
        ],
      },
    ],
  },
})
