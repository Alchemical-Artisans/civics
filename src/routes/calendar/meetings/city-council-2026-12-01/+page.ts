import type { PageLoad } from "./$types"

export const load: PageLoad = () => ({
  details: {
    time: "7:00 PM",
    // Both highlights are hearings continued from 27 October, where both were
    // highlighted on the same evidence, and both are back tonight.
    //
    // 10.1 is the Pentucket North hearing. A third I Street resident has
    // written to the Council against it since, in this packet, beside the two
    // letters of October that it carries again.
    //
    // 10.3 is the BESS overlay's Hilldale Avenue location. The Planning and
    // Development Committee's minutes of 24 August -- Doc 41-B itself --
    // record a sitting given over to the site comparison and a vote naming
    // Hilldale Avenue, and three households wrote against it in the 27
    // October packet.
    //
    // 5.4, the amended loan order for the well at 309 East Broadway, asks the
    // Council for $26,075,850 for a project `projects.ts` now follows, which
    // meets the `appropriation` test, but it is stamped "File 10 Days": it
    // will be placed on file tonight and voted on at a later sitting, so it is
    // not highlighted here.
    highlights: [
      {
        item: "pentucket-north-planned-development-district",
        title: "Pentucket North Planned Development District",
        number: "10.1",
        reasons: [
          {
            kind: "opposition-on-record",
            letters: [
              {
                meeting: "city-council-2026-12-01",
                excerpt: "pentucket-north-planned-development-district/abate-day-communication",
                source: "Marianne Abate'-Day, 72 I Street, October 25, 2026",
              },
              {
                meeting: "city-council-2026-12-01",
                excerpt: "pentucket-north-planned-development-district/mahoney-communication",
                source: "Christine Mahoney, 59 I Street Resident & Homeowner, October 21, 2026",
              },
              {
                meeting: "city-council-2026-12-01",
                excerpt: "pentucket-north-planned-development-district/neals-communication",
                source: "Patti Neals, Executor of 37 I Street, October 22, 2026",
              },
            ],
          },
        ],
      },
      {
        item: "battery-energy-storage-systems-ordinance-hilldale-ave",
        title: "Battery Energy Storage Systems Ordinance, Hilldale Ave Location",
        number: "10.3",
        reasons: [
          {
            kind: "discussed-before",
            meetings: [
              {
                id: "planning-and-development-committee-2026-08-24",
                label: "Planning and Development Committee, August 24, 2026",
              },
            ],
          },
          {
            kind: "opposition-on-record",
            letters: [
              {
                meeting: "city-council-2026-10-27",
                excerpt: "battery-energy-storage-systems-ordinance/walsh-opposition",
                source: "Joe Walsh, 26 Dawn Circle, August 26, 2026",
              },
              {
                meeting: "city-council-2026-10-27",
                excerpt: "battery-energy-storage-systems-ordinance/carr-communication",
                source: "Pamela J Carr, 60 Atlanta Street, September 14, 2026",
              },
              {
                meeting: "city-council-2026-10-27",
                excerpt: "battery-energy-storage-systems-ordinance/desjardins-communication",
                source: "Diane Desjardins, 28 Country Meadow Road, September 14, 2026",
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
      url: "https://meet.google.com/ucv-kkab-iws",
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
