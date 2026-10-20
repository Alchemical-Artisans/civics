import type { PageLoad } from "./$types"

/**
 * Who sits on the council, for a sitting announced with no agenda yet. Nothing
 * else is stated: the announcement gives the date alone.
 */
export const load: PageLoad = () => ({
  details: {
    // Nobody publishes this council's membership: the city's page for it has no
    // list, and the state's names only the chair, as the council's contact. The
    // ordinance sets the council at seven to twenty-two members, so `partial`.
    members: {
      source: {
        title: "Mass Cultural Council's page for the Haverhill Cultural Council",
        url: "https://massculturalcouncil.org/local-council/haverhill/",
      },
      partial: true,
      roster: [{ name: "John Hassan", role: "Chair" }],
    },
  },
})
