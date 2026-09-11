import type { PageLoad } from "./$types"

/**
 * Items 7.1 and 9.1 on the agenda: the same applicant asking for the same
 * change of hours under two different licenses, a Common Victualler
 * amendment and an Alcohol/ABCC application, so one write-up rather than two
 * that would say the same thing twice.
 */
export const load: PageLoad = () => ({
  item: { title: "The 99 Restaurant – Change of Hours" },
})
