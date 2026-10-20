import type { PageLoad } from "./$types"

export const load: PageLoad = () => ({
  details: {
    time: "7:00 PM",
    // 5.2 borrows $3,564,770 to replace a school's roof -- the largest sum
    // the Council is asked for tonight, and a step in an undertaking that
    // began with January's $300,000 for the design and does not end with this
    // vote. Nobody has written about it either way; it is here because of
    // what it commits the city to, not because anybody is coming to speak on
    // it.
    //
    // 10.1 is the only item tonight anybody has written to the Council
    // against: a Marshland Street owner told the Council Office in September
    // that the neighbourhood opposes the project, and the hearing has been
    // continued twice since without being heard, so the objection is still
    // the only word from the street in the record. The letter is in the 6
    // October packet rather than tonight's, which is why it names that
    // sitting.
    highlights: [
      {
        item: "golden-hill-roof-replacement-bonds",
        title: "Golden Hill Elementary School Roof Replacement Bonds",
        number: "5.2",
        reasons: [
          {
            kind: "appropriation",
            project: "golden-hill-roof-replacement",
            amount: "$3,564,770",
          },
        ],
      },
      {
        item: "marshland-st-special-permit",
        title: "Special Permit, 27 Marshland St",
        number: "10.1",
        reasons: [
          {
            kind: "opposition-on-record",
            letters: [
              {
                meeting: "city-council-2026-10-06",
                excerpt: "marshland-st-special-permit/neighbourhood-communication",
                source:
                  "Lori A. Robertson, Administrative Assistant, Haverhill City Council, September 14, 2026",
              },
            ],
          },
        ],
      },
    ],
    location: {
      name: "Theodore A. Pelosi, Jr. Council Chambers, 4 Summer St, Room 202",
      mapQuery: "4 Summer Street, Haverhill, MA 01830",
    },
    remote: {
      url: "https://meet.google.com/fae-tbvj-sqe",
    },
    // An agenda prints no roll call, so this is the roster alone, in the city's
    // own order. It agrees with the minutes of 11 August 2026, the latest roll
    // call the site carries, which names the same eleven by surname.
    members: {
      source: {
        title: "the city's City Councilors page",
        url: "https://www.haverhillma.gov/government/mayor-and-council/city-councilors/",
      },
      roster: [
        { name: "Timothy J. Jordan", role: "President, Councilor At-Large" },
        { name: "John A. Michitson", role: "Vice President, Councilor At-Large" },
        { name: "Colin LePage", role: "Councilor At-Large" },
        { name: "Thomas J. Sullivan", role: "Councilor At-Large" },
        { name: "Ralph T. Basiliere", role: "Councilor Ward 1" },
        { name: "Daniel R. Diodati", role: "Councilor Ward 2" },
        { name: "Devan Ferreira", role: "Councilor Ward 3" },
        { name: "Melissa J. Lewandowski", role: "Councilor Ward 4" },
        { name: "Shaun P. Toohey", role: "Councilor Ward 5" },
        { name: "Michael S. McGonagle", role: "Councilor Ward 6" },
        { name: "Catherine P. Rogers", role: "Councilor Ward 7" },
      ],
    },
    notice: [
      "This meeting of Haverhill City Council will be held in-person at the location provided on this notice as its official meeting location pursuant to the Open Meeting Law. As the meeting is held in person at a physical location that is open and accessible to the public, the City Council is not required to provide remote access to the meeting. Members of the public are welcome to attend this in-person meeting. Please note that a live stream of the meeting is being provided only as a courtesy to the public, and the meeting will not be suspended or terminated if technological problems interrupt the virtual broadcast, unless otherwise required by law. Members of the public with particular interest in any specific item on this agenda should make plans for in-person vs. virtual attendance accordingly. Those attending tonight’s meeting should be aware that the meeting is being audio and video recorded by HCTV, The Eagle Tribune, and WHAV. Any audience members who wish to record any part of the meeting must inform the Council President who will announce the recording. This is to comply with the MA wiretap statute. Thank you.",
    ],
  },
})
