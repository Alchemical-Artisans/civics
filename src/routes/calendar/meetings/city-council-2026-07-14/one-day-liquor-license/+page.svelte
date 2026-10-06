<script lang="ts">
  import { Router } from "$lib/router"

  const MEETING = "city-council-2026-07-14"
  const ITEM = "one-day-liquor-license"
</script>

<p>
  <strong>One Day Liquor License</strong> &ndash;with Police and License Commission approval
</p>

<ul>
  <li>
    <strong>12.7.1.</strong> <strong>LCDL-26-15</strong> &ndash; Joseph LeBlanc for
    <em>Team Haverhill</em> requests All Alcohol license for <em>River Ruckus Festival,</em> Saturday
    September 12, 2026 from 12 noon to 9 PM in the Riverfront parking lot
  </li>
</ul>

<h2>Minutes</h2>

<p>
  Motion by Councilor Sullivan to approve, Second by Councilor Ferreira<br />
  PASSED &ndash; Yeas 9, Nays 0, Absent 2 (Toohey and Diodati)
</p>

<hr />

<ul>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/application`)} target="_blank" rel="noopener">
      One day liquor license application, LCDL-26-15<span class="sr-only"
        >, PDF, two pages, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/approvals`)} target="_blank" rel="noopener">
      Licensing Clerk, Police, Recreation, License Commission and Mayor approvals<span
        class="sr-only">, PDF, eight pages, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a
      href={Router.excerpt(MEETING, `${ITEM}/supporting-documents`)}
      target="_blank"
      rel="noopener"
    >
      Alcohol server training certificate, insurance certificates and site sketch<span
        class="sr-only">, PDF, five pages, opens in a new tab</span
      >
    </a>
  </li>
</ul>
