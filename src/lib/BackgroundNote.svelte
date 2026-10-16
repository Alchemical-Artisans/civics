<!--
  Context the city's own documents do not carry, written by hand and sourced.

  Every other word in a write-up is the city's, printed as the city printed it,
  and that rule is what makes the site worth reading: a reader can check any
  line against the file it came off. This component is the one deliberate
  exception, and it exists because some agenda items are unreadable without it.
  "Mayor Barrett wishes to introduce Alison Gulubicki, Economic Development
  Director" is the whole of what the city published about that item -- a true
  sentence that answers none of the questions a reader has, because the thing
  worth knowing (the post had been vacant a year, the job was split in two, the
  appointee ran the nonprofit that owns Harbor Place) is public but is published
  somewhere else.

  So the panel is built to be impossible to mistake for a quotation:

  - It sits apart, tinted and bordered, after the city's words rather than
    among them, and it is an `<aside>` -- not the document, by the markup as
    well as by the eye.
  - It is slate, the colour the site uses when it is speaking as itself (the
    footer, the attribution line), and pointedly not the amber the meeting
    layout gives `details.highlights`. Amber on these pages means "the city
    said something worth your attention"; this is the opposite claim.
  - `sources` is required and rendered in full, and it is what marks the panel
    as inferred. There was a line of small print above saying so in words --
    "not the city's words" -- and it was cut: a panel that ends in a list of
    somebody else's reporting has already told a reader where it came from,
    and saying it twice spent the reader's attention on the caveat rather than
    the content. Requiring the prop is the guarantee, not the sentence. An
    inference a reader cannot chase is worse than no inference, so the links
    are part of the panel rather than something a page might leave off.

  **The prose here is written by a person, not generated.** The rest of the
  site is quotation, which is checkable; this panel is the one place that is
  neither quotation nor arrangement, so a human writes it and takes
  responsibility for it. An assistant may do the research and leave a bulleted
  scaffold of sourced facts in place -- that is what `city-council-2026-10-20`'s
  introduction item currently holds -- but the sentences that ship are the
  site owner's.

  What belongs here is the few facts that change how the item reads, each one
  traceable to a listed source. What does not is the rest of the article. The
  first attempt at the note below ran four paragraphs and amounted to a
  retelling of the two pieces it cites -- the mayor's quotes in full, the
  appointee's whole resume, the salary range, the duties. That is the failure
  mode this panel invites: the sources are linked, so summarising them at
  length does a reader no good and quietly turns a quotation-and-arrangement
  site into a second-hand news page. Say only what bears on the item in front
  of the reader, and let the link carry the story.
-->
<script lang="ts">
  import type { Snippet } from "svelte"

  export interface Source {
    /** The piece's own headline, as it is published. */
    title: string
    /** Who published it, named as they name themselves. */
    publisher: string
    /** The date it was published, spelled for a reader rather than sorted. */
    date: string
    url: string
  }

  /**
   * `heading` is the one thing a page may reword: "Background" suits an
   * appointment, where the item is a fact with a history behind it, but a
   * panel explaining what a vote would change wants its own name.
   */
  let {
    sources,
    heading = "Background",
    children,
  }: { sources: Source[]; heading?: string; children: Snippet } = $props()

  const id = $props.id()
</script>

<aside
  aria-labelledby={id}
  class="not-prose my-8 rounded-lg border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-700"
>
  <h2 {id} class="text-base font-semibold text-slate-900">{heading}</h2>

  <div class="mt-3 space-y-3">
    {@render children()}
  </div>

  <h3 class="mt-4 text-xs font-semibold tracking-wide text-slate-500 uppercase">Sources</h3>

  <ul class="mt-1 space-y-1">
    {#each sources as source (source.url)}
      <li>
        <a href={source.url} target="_blank" rel="external noopener noreferrer">
          {source.title}<span class="sr-only">, opens in a new tab</span>
        </a>
        <span class="text-slate-500">&mdash; {source.publisher}, {source.date}</span>
      </li>
    {/each}
  </ul>
</aside>
