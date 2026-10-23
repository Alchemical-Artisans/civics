import type { PageLoad } from "./$types"

/**
 * When and where the meeting is, read off the Vice Chairperson's Open Meeting
 * Law posting to the City Clerk and the head of the agenda it attaches, which
 * repeats most of the letter. The layout renders these into the page header;
 * see $lib/calendar's MeetingDetails for why none of it can come from the
 * scrape.
 *
 * Split the way the September and October sittings' pages split it: when and
 * where above, how to attend remotely behind a disclosure beside it, and the
 * standing Open Meeting Law paragraph behind the information icon. The day,
 * the hour and the room are the date line and the location link, so the
 * letter's opening paragraph that recites them is not repeated here, and the
 * Vice Chairperson's signature goes with it. The remote-meeting act's 2027
 * sunset and the wiretap statement the chair reads at the top of every meeting
 * are the same text on every board's agenda in the city and belong to none of
 * them.
 *
 * The letter's closing sentence -- that the meeting is live-streamed by
 * Haverhill Community Television and broadcast over WHAV -- is not here
 * either: the School Committee is one of the three boards the page derives a
 * channel 8 link for, so quoting it would say what the header already says.
 *
 * `members` is new on this board's write-ups and is the Committee as the
 * district's own School Committee page names it: the Mayor as ex-officio
 * Chairperson, the Vice Chairperson chosen by his colleagues on 8 January
 * 2026, and the ten elected members, seven by ward and three at large. The
 * page says the Committee is ten elected members plus the Mayor and names all
 * eleven, so there is no `partial` here.
 */
export const load: PageLoad = () => ({
  details: {
    time: "7:00 pm",
    location: {
      name: "Theodore A. Pelosi, Jr. City Council Chambers, City Hall, Room 202, 4 Summer Street, Haverhill, MA 01830",
      // The room geocodes to nothing; hand the map the street address.
      mapQuery: "4 Summer Street, Haverhill, MA 01830",
    },
    // No `url`, for the reason the September and October postings give: the
    // join link is emailed to whoever registers and is not printed, and the
    // address the document does print for the form,
    // `google.com/forms/d/17Z87UgL`, is an eight-character form id where
    // Google uses forty-odd and does not resolve. It stays the text the city
    // printed rather than becoming a link that 404s. The PDF hangs no
    // hyperlink off those words either.
    remote: {
      how: [
        "In order to register to participate in public comment (virtual only) during the school committee meeting, please register here at least 6 hours prior to meeting: google.com/forms/d/17Z87UgL. No AI Notetakers allowed in meeting.",
        "A link to the public comment sessions of the meeting will be emailed to you at the address you supply prior to the start of the meeting. In-person public comment will be held in the City Council Chambers.",
      ],
    },
    notice: [
      "This meeting of the Haverhill School Committee will be held in-person at the location provided on this notice as its official meeting location pursuant to the Open Meeting Law. As the meeting is held in person at a physical location that is open and accessible to the public, the School Committee is not required to provide remote access to a meeting. Members of the public are welcome to attend this in-person meeting. Please note that a live stream of the meeting is being provided only as a courtesy to the public, and the meeting will not be suspended or terminated if technological problems interrupt the virtual broadcast, unless otherwise required by law. Members of the public with particular interest in any specific item on this agenda should make plans for in-person vs. virtual attendance accordingly. Thank you.",
    ],
    members: {
      source: {
        title: "the district's School Committee page",
        url: "https://www.haverhill-ps.org/school-committee/",
      },
      roster: [
        { name: "Mayor Melinda E. Barrett", role: "School Committee Chairperson" },
        { name: "Dr. Thomas Grannemann", role: "School Committee Vice Chairperson, Ward 7" },
        { name: "Mrs. Amanda Basiliere", role: "Ward 4" },
        { name: "Mr. Robert Brown, III", role: "Ward 2" },
        { name: "Ms. Yonnie Collins", role: "Ward 6" },
        { name: "Ms. Penelope Guerrero", role: "At-Large" },
        { name: "Mr. Josiah E. Morrow", role: "At-Large" },
        { name: "Ms. Mirca Zoraida Rivera", role: "Ward 1" },
        { name: "Ms. Maura Ryan-Ciardiello", role: "Ward 3" },
        { name: "Mrs. Toni Sapienza Donais", role: "At-Large" },
        { name: "Dr. Jill Story", role: "Ward 5" },
      ],
    },
    // The one item on this agenda that answers a test in HighlightReason.
    // Policy JLIDA is what the survey is a check-in on, and the Committee gave
    // the policy its own section, its own discussion and a 10-0 roll call at
    // the sitting of 24 September -- where Mrs. Sapienza Donais asked for the
    // survey this item presents. The sitting of 10 September has the policy's
    // second reading and one sentence about it, which is a mention rather
    // than a discussion, so it is not listed.
    //
    // Nothing else on the agenda qualifies. The JGW/Tilton project is the
    // largest matter here, but the minutes of 8 October record a presentation
    // and a single clarifying comment rather than a discussion, and the
    // Building Committee's sitting of 14 October has published no minutes at
    // all; no packet carries a letter opposing anything; and no warrant is an
    // appropriation to a project this site follows.
    highlights: [
      {
        item: "principals-e-bike-e-scooter-survey",
        title: "Principals' E-bike/E-scooter Survey",
        number: "5 (A)",
        reasons: [
          {
            kind: "discussed-before",
            meetings: [
              {
                id: "school-committee-2026-09-24",
                label: "Hybrid Regular Meeting Minutes of September 24, 2026",
              },
            ],
          },
        ],
      },
    ],
  },
})
