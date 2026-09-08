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
       The city has published no agenda and no minutes, and the sitting is on
       the calendar because a schedule of the board's own says it was to be
       held. Saying so is the point of the entry -- a calendar built only from
       documents cannot show a date the city published nothing for. -->
  <p>
    The city has published no agenda or minutes for this sitting. It is here because the meeting
    schedule linked above lists the date; whether the sitting was held, cancelled or continued is
    not something that schedule records.
  </p>
{:else}
  <p>Nobody has transcribed this meeting yet. The city's own files are linked above.</p>
{/if}
