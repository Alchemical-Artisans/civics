import type { PageServerLoad } from "./$types"
import { easternDate } from "$lib/calendar"

/**
 * The day this build ran, in the city -- what decides which timeline entries
 * are behind the reader. A server load for the reason the Infrastructure Risk
 * Assessment's own gives: a universal load would answer with the reader's date
 * during hydration where the served HTML answered with the build's.
 */
export const load: PageServerLoad = () => ({ today: easternDate() })
