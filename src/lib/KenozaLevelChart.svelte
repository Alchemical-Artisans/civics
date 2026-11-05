<!--
  The Water Department's own chart of Kenoza Lake's level, shown as the city
  drew it.

  **Not redrawn here.** The level series exists only as this picture, so a
  chart of ours would be a reading of it rather than the measurement, and the
  four coloured bands are the Water Department's own definition of each
  drought stage. `$lib/kenoza-levels.ts` does read points back off it, by
  pixel, for the figures the page states in prose -- but those carry their
  method and their precision with them, and this is the thing they were read
  from.

  **Committed rather than hotlinked**, by way of `Router.excerptFile`: the
  file is served from this site, so the page does not depend on an image the
  city can move, and the caption still links the city's own copy and says
  when it was read.

  **Where it sits is the caller's business**, so the figure takes a `class`
  and brings no layout of its own beyond `not-prose`. Floated beside a
  paragraph on `/drought`, it could as easily be a column on another page,
  and that is a fact about the page rather than about the chart.
-->
<script lang="ts">
  import { KENOZA_SOURCE } from "$lib/kenoza-levels"
  import { Router } from "$lib/router"

  let { class: className = "" }: { class?: string } = $props()

  /**
   * The excerpt it is cut from: the Water Department's drought update to the
   * City Council of September 15, 2026, whose pages are committed under
   * `static/excerpts/`.
   */
  const MEETING = "city-council-2026-09-15"
  const CHART = "drought-emergency-update/drought-chart.png"

  const file = Router.excerptFile(MEETING, CHART)
</script>

<figure class="not-prose {className}">
  <!-- The picture links to the city's own page on the drought, where the city
       publishes a chart of the lake's level: a reader who clicks a chart of
       Haverhill's water is asking about Haverhill's water, and that page is
       the city saying what it currently is, in its own words and over its own
       name. It used to open our committed full-size copy, which answered a
       narrower question -- what do the axis labels say -- and the caption
       still links that copy for anyone asking it.

       `width` and `height` are the file's own pixels, so the box is reserved
       before it loads and nothing jumps; `h-auto w-full` scales it from
       there. -->
  <a href={KENOZA_SOURCE.page} target="_blank" rel="external noopener noreferrer">
    <img
      src={file}
      width="1650"
      height="1275"
      class="h-auto w-full rounded-lg ring-1 ring-slate-200"
      alt="The Water Department's chart of Kenoza Lake's level through {KENOZA_SOURCE.asOf}. The vertical axis is feet above the gauge datum, 94 to 116, against the calendar year. Four coloured bands set the drought stage at each date, deepening downward from the 5 to 10 percent Watch zone through Warning and Emergency to the Critical zone beneath them. Three lines are drawn: the 36-year average, peaking near 113 feet in May; the 2025 trend, peaking near 112.6 feet at the start of July and falling to about 102 by the end of December; and the current level, which rises only to about 105.7 in June before falling to a labelled 99.8 feet in mid-September, below the foot of every band."
    />
  </a>
  <figcaption class="mt-2 text-xs text-slate-500">
    &ldquo;{KENOZA_SOURCE.title}&rdquo; &mdash; the City of Haverhill's own chart, as of
    {KENOZA_SOURCE.asOf}, shown as the city drew it. The picture opens the city's own drought page;
    <a href={file}>the full-size copy</a> is the only size its axis labels can be read at, and is
    served from this site rather than the city's, so the page does not depend on a file the city can
    move. The image
    <a href={KENOZA_SOURCE.url} target="_blank" rel="external noopener noreferrer"
      >as the city filed it</a
    >
    was read {KENOZA_SOURCE.accessed}.
  </figcaption>
</figure>
