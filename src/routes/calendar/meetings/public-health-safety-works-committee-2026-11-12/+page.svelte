<script lang="ts">
  import { Router } from "$lib/router"

  const MEETING = "public-health-safety-works-committee-2026-11-12"
</script>

<!-- The notice's own masthead line, under "PUBLIC MEETING NOTICE". It is not
     scheduling chrome the way the salutation and the signature are: it says
     which of the two items was added after the notice first went out, and the
     highlighting it refers to is on Doc. 1-Q-1QQ. -->
<p><strong>AMENDED 11/4/26-highlighted item added</strong></p>

<p>The purpose of the meeting is to discuss the following:</p>

<!-- Both items are referred motions the notice prints in full, each
     transcribed on its own page with the Council sitting it came out of
     linked from it. -->
<ul>
  <li>
    <strong>Doc. 32-I:</strong>
    <a href={Router.meetingItem(MEETING, "flock-cameras")}>
      Flock Cameras and License Plate Monitoring
    </a>
  </li>
  <li>
    <strong>Doc. 1-Q-1QQ:</strong>
    <a href={Router.meetingItem(MEETING, "snow-and-ice-removal-ordinance")}>
      Snow and Ice Removal Ordinance
    </a>
  </li>
</ul>
