<script lang="ts">
  import { Router } from "$lib/router"

  const MEETING = "city-council-2026-08-25"
  const ITEM = "national-grid-petition-middlesex-street"
</script>

<p>
  <strong>Doc 7-I</strong> Petition from National Grid, requesting the installation of underground facilities
  for Middlesex St WR# 31310074
</p>

<p class="text-right"><strong><em>Filed on July 29, 2026</em></strong></p>

<hr />

<ul>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/cover-sheet`)} target="_blank" rel="noopener">
      Document # 7-I<span class="sr-only">, PDF, one page, opens in a new tab</span>
    </a>
  </li>
  <li>
    <a
      href={Router.excerpt(MEETING, `${ITEM}/national-grid-letter`)}
      target="_blank"
      rel="noopener"
    >
      Letter from Dave Johnson, Supervisor, Distribution Design, June 9, 2026<span class="sr-only">
        , PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/petition`)} target="_blank" rel="noopener">
      Petition for Pole and Wire Locations<span class="sr-only">
        , PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/plan`)} target="_blank" rel="noopener">
      Joint Owned Pole Petition plan, 6.4.2026<span class="sr-only">
        , PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/order`)} target="_blank" rel="noopener">
      Order for Pole and Wire Locations<span class="sr-only">
        , PDF, two pages, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/abutters`)} target="_blank" rel="noopener">
      Abutting property owners<span class="sr-only">, PDF, two pages, opens in a new tab</span>
    </a>
  </li>
  <li>
    <a
      href={Router.excerpt(MEETING, `${ITEM}/city-engineer-review`)}
      target="_blank"
      rel="noopener"
    >
      Review-Utility Company Request for New Conduit/Pole Location, July 22, 2026<span
        class="sr-only"
      >
        , PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
</ul>
