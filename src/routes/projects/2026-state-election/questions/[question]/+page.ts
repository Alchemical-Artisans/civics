import { error } from "@sveltejs/kit"
import type { EntryGenerator, PageLoad } from "./$types"
import { QUESTIONS } from "../../election"

/**
 * One page per question that is Haverhill's own, prerendered: today only
 * Question 10. The statewide questions have no page here -- the state's voter
 * guide describes each, and a precinct page links straight to its entry -- so
 * `entries` names the local ones alone, and a statewide number is a 404 rather
 * than a thinner copy of the guide.
 */
export const entries: EntryGenerator = () =>
  QUESTIONS.filter((q) => q.local).map((q) => ({ question: String(q.number) }))

export const load: PageLoad = ({ params }) => {
  const question = QUESTIONS.find((q) => q.local && String(q.number) === params.question)
  if (!question) error(404, `No local question ${params.question}`)
  return { question }
}
