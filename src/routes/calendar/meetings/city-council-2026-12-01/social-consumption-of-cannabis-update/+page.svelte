<script lang="ts">
  import { Router } from "$lib/router"

  const MEETING = "city-council-2026-12-01"
  const ITEM = "social-consumption-of-cannabis-update"
  const QUESTION = Router.projectPage("2026-state-election", "questions/10")
</script>

<p>
  15.1. Councilors Ferreira and Diodati request a post-election update on the approval of
  <a href={QUESTION}>question 10</a> regarding social consumption of cannabis in Haverhill including an
  explanation of the next steps and processes involved
</p>

<hr />

<h2>Letter from Councilors Ferreira and Diodati</h2>

<p>November 12, 2026</p>

<p>TO: President Jordan and City Councilors</p>

<p>
  Councilors Ferreira and Diodati request a post-election update on the approval of
  <a href={QUESTION}>question 10</a> regarding social consumption of cannabis in Haverhill including an
  explanation of next steps and processes involved.
</p>

<p>
  Councilor Devan Ferreira<br />
  Councilor Daniel R. Diodati
</p>

<h2>Memo from the Planning Director</h2>

<p>
  To: City Council<br />
  From: Jacki Byerley, AICP, Planning Director<br />
  Re: Marijuana Overlay District &amp; On-Site Social Consumption<br />
  Date: November 24, 2026
</p>

<p>
  Below is a timeline regarding the adoption of the Marijuana Overlay District along with a timeline
  for the drafting of On-Site Social Consumption of Marijuana.
</p>

<p><u>Marijuana Overlay District</u></p>

<p>
  Medical Marijuana Overlay District (Section 9.4) and Licensed Marijuana Established Overlay Zone
  (Section 9.7) Consolidation as recommended with the revisions from the Planning &amp; Development
  Committee
  <a
    href={Router.meetingItem(
      "planning-and-development-committee-2026-11-09",
      "marijuana-overlay-consolidation",
    )}>November 9<sup>th</sup> meeting</a
  >. This consolidation is to be in compliance with the 2026 State Cannabis Reform Law (H. 5350).
</p>

<p>January 13, 2027 &ndash; Planning Board public hearing</p>

<p>January 26, 2027 &ndash; City Council public hearing</p>

<p><u>On-Site Social Consumption</u></p>

<p>
  Marijuana Overlay District Ordinance would need to be revised further to allow on-site social
  consumption which includes an update to the special permit requirements and review of the
  Marijuana Overlay District map.
</p>

<p>December &ndash; February for both staff drafting and review by City Solicitor</p>

<p>
  February/March 2027 Review by Planning &amp; Development Committee &ndash; refer to City Council
</p>

<p>
  April/May 2027 Planning Board hearing for recommendation and City Council hearing for public
  hearing and possible adoption.
</p>

<p>
  Should the Council vote to adopt the new ordinance, the City would then notify the Cannabis
  Control Commission that social consumption is allowed within the City limits.
</p>

<p>
  This is a best-case scenario which is dependent on timing for review by the Planning &amp;
  Development Committee, Planning Board, and City Council.
</p>

<hr />

<ul>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/letter`)} target="_blank" rel="noopener">
      Letter from Councilors Devan Ferreira and Daniel R. Diodati, November 12, 2026<span
        class="sr-only">, PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a
      href={Router.excerpt(MEETING, `${ITEM}/planning-directors-memo`)}
      target="_blank"
      rel="noopener"
    >
      Memo from Jacki Byerley, AICP, Planning Director, November 24, 2026, Marijuana Overlay
      District &amp; On-Site Social Consumption<span class="sr-only"
        >, PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
</ul>
