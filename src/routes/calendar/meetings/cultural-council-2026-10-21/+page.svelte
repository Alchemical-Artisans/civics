<script lang="ts">
  import { Router } from "$lib/router"

  // The next sitting this agenda's last line announces, which has a page of
  // its own -- written as a placeholder, the council having filed no notice
  // for it yet.
  const NEXT = "cultural-council-2026-11-04"
</script>

<ul>
  <li>Call to order</li>
  <li>Acceptance of Minutes</li>
  <li>Acceptance of Scoring Rubric</li>
  <li>Extension Request 2026 Grant</li>
  <li>Grant Requests</li>
  <li>505 &copy; (3)</li>
  <li>New Business</li>
  <li>Next Meeting <a href={Router.meeting(NEXT)}>Novemb er 4</a></li>
</ul>
