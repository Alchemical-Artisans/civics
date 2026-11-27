<script lang="ts">
  import { Router } from "$lib/router"

  const MEETING = "walnut-square-school-site-council-2026-12-07"
</script>

<p>Attendance:</p>

<h2>Agenda</h2>

<ol>
  <li>
    Approve meeting minutes from <a
      href={Router.meeting("walnut-square-school-site-council-2026-10-05")}>October 2026 meeting</a
    >
  </li>

  <li>
    <a href={Router.meetingItem(MEETING, "family-engagement-policy")}>Family Engagement Policy</a>
  </li>

  <li>
    <a href={Router.meetingItem(MEETING, "school-improvement-plan")}
      >Reviewing Walnut Square's School Improvement Plan</a
    >
  </li>

  <li>District Parent Council Share Out</li>

  <li>Adjournment</li>
</ol>
