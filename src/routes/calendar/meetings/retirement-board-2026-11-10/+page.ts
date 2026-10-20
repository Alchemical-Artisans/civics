import type { PageLoad } from "./$types"

/**
 * The announcement states the hour and that the sitting is "in person and
 * online", and nothing else -- no room and no join link, which the board's own
 * agenda carries when it is posted. So the header gets the hour alone.
 */
export const load: PageLoad = () => ({
  details: {
    time: "9:00AM",
    // The page's "Board Members" list. The administrator and clerks it names
    // beside it are the system's staff, not the board.
    members: {
      source: {
        title: "the city's Retirement page",
        url: "https://www.haverhillma.gov/government/human-resources/retirement/",
      },
      roster: [
        { name: "Anthony L. Haugh", role: "Chairman" },
        { name: "Richard MacDonald", role: "Vice Chairman" },
        { name: "James P. Cleary III" },
        { name: "Angel Perkins" },
        { name: "Pamela J. Carr" },
      ],
    },
  },
})
