<script lang="ts">
  import { agendaHref } from "$lib/projects"

  const MEETING = "planning-and-development-committee-2026-10-19"
</script>

<p>The purpose of the meeting is to discuss and review the following:</p>

<!-- The notice's one item, Doc. 32-k, is transcribed on its own page. It is a
     step in the Infrastructure Risk Assessment project, so the line here opens
     the project on that step, with the motion that started it beside it, and
     the step links on to the item's own page. The label is ours rather than the
     notice's: the notice quotes the whole motion, which read here as though the
     committee were making it. -->
<ul>
  <li>
    <a href={agendaHref(MEETING, "critical-infrastructure-risk-assessment")}>
      Determine scope and outcomes of risk assessment
    </a>
  </li>
</ul>
