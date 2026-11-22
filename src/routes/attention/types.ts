/**
 * What `scripts/lib/attention.mjs` hands the page. Written out here because the
 * scripts are plain JavaScript whose inferred types are too loose to draw from.
 */
export type AttentionRecord = {
  key: string
  date: string | null
  board: string
  title: string
  kind: string | null
  filename: string
  filenameDate: string | null
  dateSource: string | null
  url: string | null
  pageUrl: string | null
}

export type AttentionGroup = {
  key: string
  title: string
  note: string
  /** Keys of `RECORD_ANSWERS`, in the order the page draws them. */
  answers: ("date-right" | "set-date" | "settle" | "drop" | "promote")[]
  records: AttentionRecord[]
}

export type AttentionLead = {
  slug: string
  id: string
  url: string
  title: string
  date: string | null
  source: string
  publisher?: string
  excerpt?: string | null
  note?: string
}

export type AttentionSource = {
  slug: string
  id: string
  url: string
  status: "changed" | "gone" | "unreachable"
  changed?: string
  error?: string
  diff: { removed: string[]; added: string[]; more: number } | null
}
