<!--
  A meeting nobody has written up.

  Everything there is to show -- the board, the date, and the city's own files
  for the sitting -- is in the layout above, which renders it for written and
  unwritten meetings alike. So there is nothing here but a line saying why the
  page is short, rather than a page that pretends to have content.

  Writing this meeting up means adding `<id>/+page.svelte` beside `[meeting]`;
  the static route then serves it and this one stops covering the id.
-->
<script lang="ts">
  import { formatLongDate } from "$lib/calendar"

  // From the layout's load, which is where every meeting page gets its sitting.
  let { data } = $props()
</script>

{#if data.meeting.scheduled}
  <!-- Not "nobody has transcribed this yet": there is nothing to transcribe.
       The day has not happened, so the city has published nothing for it, and
       the sitting is here because the board itself said it would sit. Showing
       what it said is the whole content of the page -- it is the evidence, and
       it is the city's own wording, so it is quoted rather than paraphrased.

       Which evidence it is matters. The city has posted a notice calling
       this sitting; a board that prints its dates has stated this one in
       advance; a board that prints a rule has stated a pattern this day falls
       under, which is a good deal weaker -- so the three do not say the same
       thing here. -->
  {@const source = data.meeting.scheduled.source}
  {#if source.kind === "notice"}
    <!-- The strongest of the three, and the only one about this sitting rather
         than about a pattern it falls under: the city has posted the meeting.
         The notice's own title is quoted because the city writes the sitting's
         character into it -- "Special Meeting", "Executive Session", "Revised"
         -- and none of that is anywhere else in the data. -->
    <p>
      The city has published no agenda for this sitting yet. It is on the calendar because the city
      has posted a notice of it, as
      <a href={source.url} target="_blank" rel="external noopener noreferrer">{source.title}</a>.
    </p>
    <p>An agenda is usually published a few days beforehand. Check again nearer the day.</p>
  {:else if source.kind === "calendar"}
    <p>
      The city has published no agenda for this sitting yet. It is on the calendar because the
      {data.meeting.board}'s own
      <a href={source.url} target="_blank" rel="external noopener noreferrer">{source.heading}</a>
      lists the date.
    </p>
    <!-- The other dated columns of this sitting's own row, under the board's
         own headings for them. Neither is a sitting -- one is the deadline for
         filing to be heard at this one, the other the date it moves to if it is
         postponed -- so they are stated here rather than being given calendar
         entries of their own. -->
    {#if data.meeting.scheduled.related?.length}
      <p>That schedule prints two other dates against this sitting:</p>
      <dl>
        {#each data.meeting.scheduled.related as other (other.label)}
          <dt>{other.label}</dt>
          <dd>{formatLongDate(other.date)}</dd>
        {/each}
      </dl>
    {/if}
    <p>An agenda is usually published a few days beforehand. Check again nearer the day.</p>
  {:else}
    <p>
      The city has published no agenda for this sitting yet. It is on the calendar because the
      <a href={source.url} target="_blank" rel="external noopener noreferrer"
        >{data.meeting.board}'s own meeting rule</a
      >
      expects it:
    </p>
    <blockquote>
      <p>{source.intro}</p>
      <ul>
        {#each source.exceptions as clause (clause)}
          <li>{clause}</li>
        {/each}
      </ul>
    </blockquote>
    <p>
      The Council does not sit on every Tuesday the rule names, and it publishes an agenda a few
      days beforehand. Check the calendar again nearer the day.
    </p>
  {/if}
{:else}
  <p>Nobody has transcribed this meeting yet. The city's own files are linked above.</p>
{/if}
