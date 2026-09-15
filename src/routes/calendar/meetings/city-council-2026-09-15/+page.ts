import type { PageLoad } from "./$types"

export const load: PageLoad = () => ({
  details: {
    time: "7:00 PM",
    location: {
      name: "Theodore A. Pelosi, Jr. Council Chambers, Room 202, 4 Summer St",
      mapQuery: "4 Summer Street, Haverhill, MA 01830",
    },
    remote: {
      url: "https://meet.google.com/tgx-adkt-yto",
      // The agenda says the meeting is recorded by HCTV without printing where
      // to watch it live; see MeetingDetails.remote.stream in $lib/calendar.
      stream: "http://haverhillcommunitytv.org/video/channel-8-live-stream",
    },
    notice: [
      "This meeting of Haverhill City Council will be held in-person at the location provided on this notice as its official meeting location pursuant to the Open Meeting Law. As the meeting is held in person at a physical location that is open and accessible to the public, the City Council is not required to provide remote access to the meeting. Members of the public are welcome to attend this in-person meeting. Please note that a live stream of the meeting is being provided only as a courtesy to the public, and the meeting will not be suspended or terminated if technological problems interrupt the virtual broadcast, unless otherwise required by law. Members of the public with particular interest in any specific item on this agenda should make plans for in-person vs. virtual attendance accordingly. Those attending tonight&rsquo;s meeting should be aware that the meeting is being audio and video recorded by HCTV, The Eagle Tribune, and WHAV. Any audience members who wish to record any part of the meeting must inform the Council President who will announce the recording. This is to comply with the MA wiretap statute. Thank you.",
    ],
  },
})
