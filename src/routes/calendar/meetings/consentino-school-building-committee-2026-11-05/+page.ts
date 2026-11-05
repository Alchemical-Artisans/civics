import type { PageLoad } from "./$types"

/**
 * When and where the meeting is, read off the agenda's own header block and the
 * Mayor's covering letter to the City Clerk. The layout renders these into the
 * page header; see $lib/calendar's MeetingDetails for why none of it can come
 * from the scrape.
 *
 * No roster: neither the city nor Haverhill Public Schools publishes this
 * committee's membership. The only list anywhere is the front matter of the
 * 2022 project manual, which names Mayor Fiorentini as chairperson -- the
 * letter below is signed by Mayor Barrett, so it is out of date, and an out of
 * date roster is not one.
 */
export const load: PageLoad = () => ({
  // The agenda sheet's Time cell reads "9:00 AM"; the covering letter, which is
  // the notice the Clerk filed, prints the whole sitting -- "from 9:00 am -
  // 10:30 am". They agree on the hour it starts, so the letter's range is the
  // fuller word and costs nothing, the same reading the special meeting of
  // 7 October took.
  details: {
    time: "9:00 am - 10:30 am",
    location: {
      // The agenda's own Location cell. The covering letter calls the same
      // place "the New Consentino School, 685 Washington Street, Room 001C".
      name: "Consentino Middle School, Conference Room 001C",
      // The room geocodes to nothing; hand the map the street address, which
      // the covering letter prints.
      mapQuery: "685 Washington Street, Haverhill, MA 01832",
    },
    // Both halves of the filing print the same link cleanly this time, where
    // the sitting of 1 October had it mangled on the agenda sheet.
    remote: {
      url: "https://meet.google.com/one-bcqm-aio",
    },
    // Both of these are this committee's own words about this sitting rather
    // than the boilerplate every agenda in the city carries: the first is a
    // condition it has put on attending, and the second is the committee saying
    // its own list is neither a promise nor a limit. The remote-meeting act's
    // sunset date, which both pages also carry, is on every board's agenda and
    // is not about this meeting at all.
    notice: [
      "No AI Notetakers allowed in meeting.",
      "This Agenda has been prepared in advance and represents a listing of topics that are reasonably anticipated to be discussed at this meeting. However, the Agenda does not necessarily include all matters which may be taken up at this meeting.",
    ],
  },
})
