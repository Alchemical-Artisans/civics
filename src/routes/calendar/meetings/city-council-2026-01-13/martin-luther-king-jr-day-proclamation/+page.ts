import type { PageLoad } from "./$types"

/**
 * The proclamation's own heading is "Martin Luther King Day"; the agenda calls
 * it "Recognizing Martin Luther King Jr. Day in the City of Haverhill". The
 * title is the matter. The agenda numbers it 17.1 and the minutes 17.7.
 */
export const load: PageLoad = () => ({
  item: { title: "Martin Luther King Jr. Day Proclamation" },
})
