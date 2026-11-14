import type { PageLoad } from "./$types"

/**
 * When and where the meeting is, read off the Mayor's covering letter to the
 * City Clerk dated November 12, 2026, which is the whole of this filing: the
 * six numbered lines under "The agenda is below:". The letter calls this a
 * remote meeting and names no room, so there is no location.
 */
export const load: PageLoad = () => ({
  details: {
    // Verbatim from the letter: "from 2:00 pm - 3:30 pm".
    time: "2:00 pm - 3:30 pm",
    remote: {
      url: "https://meet.google.com/rgp-tzud-kti",
    },
    // This committee's own condition on attending; the Governor's extension of
    // remote attendance is on every board's agenda and is not about this one.
    notice: ["No AI Notetakers allowed in meeting."],
  },
})
