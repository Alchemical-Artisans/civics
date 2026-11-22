<script lang="ts">
  import { Router } from "$lib/router"

  const MEETING = "city-council-2016-09-27"
  const ITEM = "public-safety-committee-minutes"
</script>

<p>
  <strong>21.1</strong> Councillor McGonagle submits Minutes of the <em>Public Safety Committee</em>
  meeting held on September 12 2016
</p>

<hr />

<ul>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/minutes`)} target="_blank" rel="noopener">
      Minutes of the Public Safety Committee Meeting held on September 12, 2016<span class="sr-only"
        >, PDF, two pages, opens in a new tab</span
      >
    </a>
  </li>
</ul>
