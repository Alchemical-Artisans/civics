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
  // From the layout's load, which is where every meeting page gets its sitting.
  let { data } = $props()
</script>

{#if data.meeting.scheduled}
  <!-- Not "nobody has transcribed this yet": there is nothing to transcribe.
       This Tuesday has not happened, so the city has published nothing for it,
       and the sitting is here because the Council's own standing rule names the
       day. Quoting that rule is the whole content of the page -- it is the
       evidence, and it is the city's own wording. -->
  <p>
    The city has published no agenda for this sitting yet. It is on the calendar because the
    <a href={data.meeting.scheduled.rule.url} target="_blank" rel="external noopener noreferrer"
      >City Council's own meeting rule</a
    >
    expects it:
  </p>
  <blockquote>
    <p>{data.meeting.scheduled.rule.intro}</p>
    <ul>
      {#each data.meeting.scheduled.rule.exceptions as clause (clause)}
        <li>{clause}</li>
      {/each}
    </ul>
  </blockquote>
  <p>
    The Council does not sit on every Tuesday the rule names, and it publishes an agenda a few days
    beforehand. Check the calendar again nearer the day.
  </p>
{:else}
  <p>Nobody has transcribed this meeting yet. The city's own files are linked above.</p>
{/if}
