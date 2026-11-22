import type { PageLoad } from "./$types"

/** The hour and room as the Council's minutes of 27 September 2016 state them. */
export const load: PageLoad = () => ({
  details: {
    time: "7:00PM",
    location: {
      name: "City Council office",
      // Room 204, Haverhill City Hall; the office geocodes to nothing.
      mapQuery: "4 Summer Street, Haverhill, MA 01830",
    },
  },
})
