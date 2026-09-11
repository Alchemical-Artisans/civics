<script lang="ts">
  import { Router } from "$lib/router"

  const MEETING = "city-council-2026-09-15"
  const ITEM = "confirming-appointments"
</script>

<p><strong>Confirming Appointments:</strong></p>

<ul>
  <li>
    <strong>11.1.1</strong>
    <em>Washington Street Historic Shoe District Commission,</em> Mary Grise, 18 Essex Street, expires
    September 30, 2028
  </li>
  <li>
    <strong>11.1.2</strong>
    <em>Haverhill Historical Commission,</em> Wendy Sczechowicz, 40 Locke Street, expires September 30,
    2029
  </li>
</ul>

<hr />

<ul>
  <li>
    <a
      href={Router.excerpt(MEETING, `${ITEM}/mary-grise-mayors-letter`)}
      target="_blank"
      rel="noopener"
    >
      Letter from Mayor Melinda E. Barrett, Mary Grise&rsquo;s appointment<span class="sr-only">
        , PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/mary-grise-letter`)} target="_blank" rel="noopener">
      Letter from Mary E. Grise expressing interest in serving, September 10, 2026<span
        class="sr-only"
      >
        , PDF, two pages, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/mary-grise-resume`)} target="_blank" rel="noopener">
      Resume, Mary Grise<span class="sr-only">, PDF, two pages, opens in a new tab</span>
    </a>
  </li>
  <li>
    <a
      href={Router.excerpt(MEETING, `${ITEM}/wendy-sczechowicz-mayors-letter`)}
      target="_blank"
      rel="noopener"
    >
      Letter from Mayor Melinda E. Barrett, Wendy Sczechowicz&rsquo;s appointment<span
        class="sr-only"
      >
        , PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a
      href={Router.excerpt(MEETING, `${ITEM}/wendy-sczechowicz-email`)}
      target="_blank"
      rel="noopener"
    >
      Email from Wendy Sczechowicz expressing interest in serving, September 3, 2026<span
        class="sr-only"
      >
        , PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a
      href={Router.excerpt(MEETING, `${ITEM}/wendy-sczechowicz-resume`)}
      target="_blank"
      rel="noopener"
    >
      Resume, Wendy Sczechowicz<span class="sr-only">, PDF, two pages, opens in a new tab</span>
    </a>
  </li>
</ul>
