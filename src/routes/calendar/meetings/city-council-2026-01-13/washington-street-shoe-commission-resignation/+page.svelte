<script lang="ts">
  import { Router } from "$lib/router"

  const MEETING = "city-council-2026-01-13"
  const ITEM = "washington-street-shoe-commission-resignation"
</script>

<p>
  <em>Washington Street Shoe Historic District Commission</em>- Sarah LoVasco, effective December
  31, 2025
</p>

<h2>Minutes</h2>

<p>Mayor Barrett thanked Sarah LoVasco for her time on the commission.</p>

<p>
  Motion by Vice President Michitson to place on file, Second by Councilor LePage<br />
  PASSED &ndash; Yeas 10, Nays 0, Absent 1 (McGonagle)
</p>

<hr />

<ul>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/mayors-letter`)} target="_blank" rel="noopener">
      Letter from Mayor Melinda E. Barrett, January 8, 2026<span class="sr-only"
        >, PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/resignation`)} target="_blank" rel="noopener">
      Email from Sarah LoVasco, December 5, 2025<span class="sr-only"
        >, PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
</ul>
