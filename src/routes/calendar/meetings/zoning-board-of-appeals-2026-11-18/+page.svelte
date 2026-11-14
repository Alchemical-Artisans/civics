<script lang="ts">
  import { Router } from "$lib/router"

  /** This page's own directory name, which is the meeting's id. */
  const MEETING = "zoning-board-of-appeals-2026-11-18"
</script>

<h2>New Business:</h2>

<ul>
  <li>
    <a href={Router.meetingItem(MEETING, "994-main-street-early-contractors-inc")}>
      994 Main Street &ndash; Early Contractors, Inc
    </a>
  </li>
  <li>
    <a href={Router.meetingItem(MEETING, "0-grove-street-cesar-casado")}>
      0 Grove Street &ndash; Cesar Casado
    </a>
  </li>
</ul>

<h2>Minutes:</h2>

<p>October 21, 2026</p>

<p>George Moriarty, Chair</p>
