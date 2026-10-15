<script lang="ts">
  import { Router } from "$lib/router"

  const MEETING = "bradford-elementary-school-site-council-2026-10-20"
</script>

<h2>Agenda:</h2>

<ul>
  <li>Welcome</li>
  <li>Purpose of Site Council</li>
  <li>Goals for the Year</li>
  <li>
    <a href={Router.meetingItem(MEETING, "district-site-council-training")}
      >District Site Council Training</a
    >
  </li>
</ul>
