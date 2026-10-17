<script lang="ts">
  import BackgroundNote from "$lib/BackgroundNote.svelte"
  import { Router } from "$lib/router"

  const MEETING = "city-council-2026-10-20"
  const ITEM = "introduce-economic-development-director"
</script>

<p>
  Mayor Barrett wishes to introduce Alison Gulubicki, <em>Economic Development Director</em>
</p>

<BackgroundNote>
  <p>
    Alison Gulubicki <a
      href="https://whav.net/2026/10/11/barrett-names-gulubicki-as-citys-economic-development-chief/"
      target="_blank"
      rel="external noopener noreferrer"
      >recently took up the post of Economic Development Director</a
    >, and this is likely her introduction to the council in this new role.
  </p>

  <p>
    She is still wrapping up work with the Greater Haverhill Foundation, and according to WHAV "will abstain from working on any Harbor Place or other Greater Haverhill Foundation projects."
  </p>
</BackgroundNote>

<hr />

<ul>
  <li>
    <a href={Router.excerpt(MEETING, ITEM)} target="_blank" rel="noopener">
      Letter from Mayor Melinda E. Barrett, October 16, 2026<span class="sr-only">
        , PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
</ul>
