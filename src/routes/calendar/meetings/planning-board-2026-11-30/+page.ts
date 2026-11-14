import type { PageLoad } from "./$types"

/**
 * When and where the meeting is, read off the head of the city's agenda. The
 * agenda's opening sentence recites the day, the hour and the room, which the
 * header already states, so only the remote access and the closing line are
 * kept.
 */
export const load: PageLoad = () => ({
  details: {
    time: "12:00 P.M.",
    location: {
      name: "Room 202, Haverhill City Hall",
      // The room geocodes to nothing; hand the map the street address.
      mapQuery: "4 Summer Street, Haverhill, MA 01830",
    },
    remote: {
      url: "https://teams.microsoft.com/meet/PlanningBoardMeeting113026",
      meetingId: "245 486 739 427 106 7",
      passcode: "pw7PM6hG",
    },
    notice: ["(See files in the Planning Dept. for further information.)"],
  },
})
