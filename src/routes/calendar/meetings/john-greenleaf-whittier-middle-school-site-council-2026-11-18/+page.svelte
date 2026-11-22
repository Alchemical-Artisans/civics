<script lang="ts">
  import { agendaHref } from "$lib/projects"
  import { Router } from "$lib/router"

  const MEETING = "john-greenleaf-whittier-middle-school-site-council-2026-11-18"
</script>

<h2>Agenda</h2>

<table>
  <thead>
    <tr>
      <th scope="col">Time</th>
      <th scope="col">Topic</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>6:00pm - 7:00pm</td>
      <td>
        <p>
          <a href={Router.meetingItem(MEETING, "family-feedback-survey")}
            >Family Feedback Survey Fall 2026</a
          >
        </p>
        <p>HPS Parent Engagement Policy</p>
        <p>
          <a href={agendaHref(MEETING, "building-project-updates")}
            >JG Whittier Middle School Building Project Updates</a
          >
        </p>
      </td>
    </tr>
    <tr>
      <td>7:00pm</td>
      <td>Adjournment</td>
    </tr>
  </tbody>
</table>
