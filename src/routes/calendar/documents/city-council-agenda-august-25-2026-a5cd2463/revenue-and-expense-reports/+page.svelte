<script lang="ts">
  import { Router } from "$lib/router"

  const DOCUMENT = "city-council-agenda-august-25-2026-a5cd2463"
  const ITEM = "revenue-and-expense-reports"
</script>

<p>
  Angel A. Perkins, <em>City Auditor and Chief Financial Officer</em>, submits the revenue and
  expense reports for the months of June and July 2026
</p>

<ul>
  <li>
    <a href={Router.excerpt(DOCUMENT, `${ITEM}/cover-letter`)} target="_blank" rel="noopener">
      Letter from Angel A. Perkins, Chief Financial Officer &amp; City Auditor, August 19, 2026<span
        class="sr-only"
      >
        , PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a
      href={Router.excerpt(DOCUMENT, `${ITEM}/expense-report-june-2026`)}
      target="_blank"
      rel="noopener"
    >
      Expense Report as of 6/30/2026<span class="sr-only">
        , PDF, three pages, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a
      href={Router.excerpt(DOCUMENT, `${ITEM}/revenue-report-july-2026`)}
      target="_blank"
      rel="noopener"
    >
      Revenue Report, Period Ending 7/31/26<span class="sr-only">
        , PDF, two pages, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a
      href={Router.excerpt(DOCUMENT, `${ITEM}/revenue-report-june-2026`)}
      target="_blank"
      rel="noopener"
    >
      Revenue Report, Period Ending 6/30/26<span class="sr-only">
        , PDF, two pages, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a
      href={Router.excerpt(DOCUMENT, `${ITEM}/expense-report-july-2026`)}
      target="_blank"
      rel="noopener"
    >
      Expense Report as of 7/31/2026<span class="sr-only">
        , PDF, four pages, opens in a new tab</span
      >
    </a>
  </li>
</ul>
