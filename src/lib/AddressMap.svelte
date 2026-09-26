<!--
  A place named in the document's own words, shown on a map underneath it --
  the site is trying to show what the government is doing, and where "12
  Blaisdell St" or "16 Forest Ave" actually sits is part of that a reader
  otherwise has to open a second tab and type the address in themselves.

  `lat`/`lon` are not geocoded at build or read time: the build stays
  offline, the way the rest of the site is, and a street address's point does
  not move once looked up, so it is pinned here by hand -- the same choice
  `mapQuery` on a meeting's own `location` makes, one step further, because an
  OpenStreetMap embed needs a point to centre on rather than a string to
  search. See docs/document-pages.md for how to find one.

  `not-prose`: a map is a picture, not a reading column, and the typography
  plugin's own margins and max-width are for text.
-->
<script lang="ts">
  import { Router } from "$lib/router"

  let { address, lat, lon }: { address: string; lat: number; lon: number } = $props()
</script>

<figure class="not-prose my-4 max-w-xl">
  <iframe
    title={`Map: ${address}`}
    src={Router.osmEmbed(lat, lon)}
    class="h-64 w-full border border-slate-300"
    loading="lazy"
  ></iframe>
  <figcaption class="mt-1 text-xs text-slate-500">
    <a
      class="underline hover:text-slate-900"
      href={Router.osmView(lat, lon)}
      target="_blank"
      rel="external noopener noreferrer"
    >
      {address} on OpenStreetMap<span class="sr-only">, opens in a new tab</span>
    </a>
  </figcaption>
</figure>
