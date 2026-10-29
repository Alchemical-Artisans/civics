import type { PageLoad } from "./$types"

/**
 * When and where the meeting is, read off the Vice Chairperson's Open Meeting
 * Law posting to the City Clerk -- a one-page letter with the three-item
 * agenda set inside it, the same shape as the negotiating subcommittee's
 * 8 and 22 October sittings. Neither the letter's opening paragraph nor the
 * signature under it is transcribed: the paragraph says in prose what the date
 * line and the location link say above it, and what it adds -- that the
 * Committee sits with its leadership team and legal counsel to discuss
 * strategy on the HEA's grievance -- is the agenda's own item 2 and the
 * document's own title. The closing paragraph on the June 2027 sunset of the
 * remote-meeting act is the same sentence on every board's agenda in the city
 * and belongs to none of them.
 *
 * No `remote`: the letter calls the session hybrid and prints no way to join
 * it, so there is nothing to put in the slot. The School Committee is one of
 * the three boards the page derives a channel 8 link for, so the header offers
 * what the document does not.
 *
 * `members` is the Committee as the district's own School Committee page names
 * it: the Mayor as ex-officio Chairperson, the Vice Chairperson chosen by his
 * colleagues on 8 January 2026, and the ten elected members, seven by ward and
 * three at large. The page says the Committee is ten elected members plus the
 * Mayor and names all eleven, so there is no `partial` here. The Secretary
 * listed beneath them is staff, not a member.
 *
 * No `highlights`: the agenda's one substantive item is a motion to go into
 * executive session, which answers none of the tests in HighlightReason -- no
 * earlier sitting has published minutes discussing this grievance (both
 * sittings that took it up went into executive session themselves), no packet
 * carries correspondence of any kind, and nothing here appropriates money.
 */
export const load: PageLoad = () => ({
  details: {
    // The letter gives an end as well as a start; both are the city's.
    time: "6:00 pm-7:30 pm",
    location: {
      name: "City Hall, School Administration Office Conference Room (Room 104), 4 Summer Street, Haverhill, MA 01830",
      // The room geocodes to nothing; hand the map the street address.
      mapQuery: "4 Summer Street, Haverhill, MA 01830",
    },
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
  },
})
