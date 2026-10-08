import type { PageLoad } from "./$types"

/**
 * When and where the meeting is, read off the agenda's own heading block and
 * the Zoom invitation the board prints under it. The layout renders these into
 * the page header; see $lib/calendar's MeetingDetails for why none of it can
 * come from the scrape.
 *
 * The heading reads "Haverhill City Hall, Haverhill Retirement Office, Room 303
 * and online." -- "and online" is the remote option below rather than part of
 * the place, so it is not in `name`, and the room geocodes to nothing, so the
 * map is handed the letterhead's own street address.
 *
 * Attending online is a standing alternative here rather than a weather
 * contingency, so the join link, meeting ID and passcode are offered plainly
 * and only the board's other four routes in -- the chat link, the two one-tap
 * numbers, SIP and the invitation page -- go behind the disclosure. The
 * invitation's own "Topic" and "Time" lines are dropped: they restate the day
 * and the hour the header already shows.
 */
export const load: PageLoad = () => ({
  details: {
    time: "9:00AM",
    location: {
      name: "Haverhill City Hall, Haverhill Retirement Office, Room 303",
      mapQuery: "4 Summer Street, Haverhill, MA 01830",
    },
    remote: {
      url: "https://us02web.zoom.us/j/86874442335?pwd=umsXKdZGw27C9h4OAavLeaeljcbdVi.1",
      meetingId: "868 7444 2335",
      passcode: "298951",
      how: [
        "Meeting chat link https://us02web.zoom.us/launch/jc/86874442335",
        "One tap mobile +13126266799,,86874442335#,,,,*298951# US (Chicago) +16469313860,,86874442335#,,,,*298951# US",
        "Join by SIP • 86874442335@zoomcrc.com",
        "Join instructions https://us02web.zoom.us/meetings/86874442335/invitations?signature=6hl9ypgYjjcT56a7HySzcqtdJOAUGs_O3hzEmIKVMeg",
      ],
    },
  },
})
