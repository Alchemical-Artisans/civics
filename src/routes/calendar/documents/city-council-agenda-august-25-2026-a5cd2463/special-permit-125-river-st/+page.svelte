<script lang="ts">
  import { Router } from "$lib/router"

  const DOCUMENT = "city-council-agenda-august-25-2026-a5cd2463"
  const ITEM = "special-permit-125-river-st"
</script>

<p>
  <strong>Doc 21-I- CCSP-26-2</strong> &ndash; Philip Rice of <em>Rice &amp; Brouillard</em> requests
  approval to transform an existing 1 &frac12; story structure into a three-family residential building
  containing a mix of two- and three-bedroom units at 125 River St. The renovation will include an interior
  reconfiguration, structural expansion, and modernization of all building systems meet current safety,
  accessibility, and energy-efficiency standards if/as needed
</p>

<hr />

<ul>
  <li>
    <a href={Router.excerpt(DOCUMENT, `${ITEM}/cover-sheet`)} target="_blank" rel="noopener">
      Document # 21-I<span class="sr-only">, PDF, one page, opens in a new tab</span>
    </a>
  </li>
  <li>
    <a href={Router.excerpt(DOCUMENT, `${ITEM}/application`)} target="_blank" rel="noopener">
      City Council Special Permit application, CCSP-26-2<span class="sr-only">
        , PDF, two pages, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(DOCUMENT, `${ITEM}/review-record`)} target="_blank" rel="noopener">
      Departmental review record, CCSP-26-2<span class="sr-only">
        , PDF, twenty-five pages, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a
      href={Router.excerpt(DOCUMENT, `${ITEM}/gazette-confirmation`)}
      target="_blank"
      rel="noopener"
    >
      Confirmation of the notice placed with the Haverhill Gazette<span class="sr-only">
        , PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
</ul>
