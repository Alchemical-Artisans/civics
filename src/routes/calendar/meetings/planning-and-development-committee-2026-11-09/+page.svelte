<script lang="ts">
  import { Router } from "$lib/router"

  /** This page's own directory name, which is the sitting's id. */
  const MEETING = "planning-and-development-committee-2026-11-09"
</script>

<p>The purpose of the meeting is to discuss and review the following:</p>

<!-- The notice gives each item a document number and the motion that referred
     it, with no shorter name printed anywhere, so the link text names the
     matter and the motion itself sits on the item's own page. The second item's
     slug is the one the City Council's agenda of 22 September already uses for
     the same matter, so a reader following one to the other gets the same word. -->
<ul>
  <li>
    <strong>Doc.85-e:</strong>
    <a href={Router.meetingItem(MEETING, "fiscal-impact-analysis-progress-report")}>
      Fiscal Impact Analysis Progress Report
    </a>
  </li>
  <li>
    <strong>Doc. 44-a</strong>
    <a href={Router.meetingItem(MEETING, "marijuana-overlay-consolidation")}>
      Marijuana Overlay District Consolidation
    </a>
  </li>
</ul>
