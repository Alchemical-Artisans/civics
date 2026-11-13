import type { PageLoad } from "./$types"

export const load: PageLoad = () => ({
  details: {
    time: "7:00 PM",
    // 17.1 is the Golden Hill roof order, which the Council placed on file on
    // 20 October and now takes up for its vote. It asks for $3,564,770 for a
    // project `projects.ts` follows from January's appropriation on, so it
    // meets the `appropriation` test, and it is back under Unfinished Business
    // rather than stamped "File 10 Days" afresh, which is what kept it out of
    // the 20 October highlights. 17.5, the $800,000 high school fire alarm,
    // is the same sort of vote but `projects.ts` follows no undertaking it
    // belongs to, so it is not highlighted.
    highlights: [
      {
        item: "golden-hill-roof-replacement-bonds",
        title: "Golden Hill Elementary School Roof Replacement Bonds",
        number: "17.1",
        reasons: [
          {
            kind: "appropriation",
            project: "golden-hill-roof-replacement",
            amount: "$3,564,770",
          },
        ],
      },
    ],
    location: {
      name: "Theodore A. Pelosi, Jr. Council Chambers, 4 Summer St, Room 202",
      mapQuery: "4 Summer Street, Haverhill, MA 01830",
    },
    remote: {
      url: "https://meet.google.com/usp-hzyg-upb",
    },
    // An agenda prints no roll call, so this is the roster alone, in the city's
    // own order.
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
