<!--
  Item 5.1 of the City Council agenda for August 25, 2026.

  The paragraph is the item as the agenda prints it, word for word, and is the
  only prose here. The letter linked underneath is page 7 of the same PDF,
  lifted out with

    pdfseparate -f 7 -l 7 <packet>.pdf static/excerpts/<id>/<name>.pdf

  and committed under static/. See docs/document-pages.md.
-->

<script lang="ts">
  import { Router } from "$lib/router"

  const DOCUMENT = "city-council-agenda-august-25-2026-a5cd2463"
</script>

<p>
  Mayor Barrett wishes to introduce representatives from <em>MassDOT</em> and
  <em>Middlesex Corporation</em> to provide the City Council with an update on the Basiliere Bridge project
</p>

<p>
  <a
    href={Router.excerpt(DOCUMENT, "basiliere-bridge-project-update")}
    target="_blank"
    rel="noopener"
  >
    Letter from Mayor Melinda E. Barrett, August 21, 2026<span class="sr-only">
      , PDF, one page, opens in a new tab</span
    >
  </a>
</p>
