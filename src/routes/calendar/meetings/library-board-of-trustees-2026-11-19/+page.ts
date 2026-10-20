import type { PageLoad } from "./$types"

/**
 * Who sits on the board, for a sitting announced with no agenda yet. Nothing
 * else is stated: the announcement gives the date alone.
 */
export const load: PageLoad = () => ({
  details: {
    // The page calls the board seven-member and names six, so `partial`.
    members: {
      source: {
        title: "the library's Trustees page",
        url: "https://haverhillpl.org/trustees/",
      },
      partial: true,
      roster: [
        { name: "The Honorable Melinda Barrett, Mayor of Haverhill", role: "Chair" },
        { name: "Richard J. Sheehan", role: "Vice Chair" },
        { name: "Deborah Y. Coletti" },
        { name: "Kathy Bresnahan" },
        { name: "Joan Kimball" },
        { name: "Dan Lyons" },
      ],
    },
  },
})
