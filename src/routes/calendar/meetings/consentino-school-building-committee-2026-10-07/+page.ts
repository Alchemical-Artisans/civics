import type { PageLoad } from "./$types"

/**
 * When and where the meeting is, read off the agenda's own header block and the
 * Mayor's covering letter to the City Clerk. The layout renders these into the
 * page header; see $lib/calendar's MeetingDetails for why none of it can come
 * from the scrape.
 */
export const load: PageLoad = () => ({
  details: {
    // The two halves of this filing disagree: the agenda sheet's own Time cell
    // reads "9:00 AM", the hour this committee's ordinary sittings start at and
    // the one its last agenda carried, while the covering letter calls this a
    // "hybrid special meeting ... from 1:30 pm - 2:30 pm". The letter is the
    // notice the Clerk filed and it is specific to this sitting -- the city's
    // own posting for it is timed 13:30 -- so that is the hour printed here.
    time: "1:30 pm - 2:30 pm",
    location: {
      // The agenda's own Location cell. The covering letter calls the same
      // place "the New Consentino School, 685 Washington Street, Room 001C".
      name: "Consentino Middle School, Conference Room 001C",
      // The room geocodes to nothing; hand the map the street address, which
      // the covering letter prints.
      mapQuery: "685 Washington Street, Haverhill, MA 01832",
    },
    // The covering letter promises a Google Meet link and prints nothing after
    // the colon; the agenda sheet behind it carries the link itself, cleanly
    // this time rather than mangled the way the last sitting's was.
    remote: {
      url: "https://meet.google.com/nmu-dnno-wax",
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
