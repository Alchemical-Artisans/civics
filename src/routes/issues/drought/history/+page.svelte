<script lang="ts">
  import { formatLongDate } from "$lib/calendar"
  import { Router } from "$lib/router"

  let { data } = $props()

  const TITLE = "Haverhill Drought Guide: page history"

  /** "2 changed, 1 added" -- only the kinds that happened. */
  function describe(s: { added: number; removed: number; changed: number }) {
    return [
      s.changed && `${s.changed} edited`,
      s.added && `${s.added} added`,
      s.removed && `${s.removed} removed`,
    ]
      .filter(Boolean)
      .join(", ")
  }
</script>

<svelte:head>
  <title>{TITLE}</title>
</svelte:head>

<p class="m-0 text-sm"><a href={Router.droughtPage()}>&larr; The drought guide</a></p>

<h1>Page history</h1>

<p>
  Every version of the guide, newest first. Each opens to what changed from the version before it,
  paragraph by paragraph, with the words that went and the words that came marked. The charts and
  maps are not text and are not compared.
</p>

<ol class="list-none space-y-4 p-0">
  {#each data.versions as v, i (v.id)}
    <li class="rounded border border-slate-200 p-4">
      <h2 class="m-0 text-base">
        <a href={Router.droughtHistory(v.id)}>{formatLongDate(v.date)}</a>
        {#if i === 0}<span class="text-sm font-normal text-slate-600">(current)</span>{/if}
      </h2>
      {#if v.note}<p class="my-1">{v.note}</p>{/if}
      <ul class="m-0 mt-1 list-none p-0 text-sm text-slate-700">
        {#if v.first}
          <li>First published.</li>
        {:else}
          <li>Article: {describe(v.article) || "no change"}.</li>
          <li>Timeline: {describe(v.timeline) || "no change"}.</li>
        {/if}
      </ul>
    </li>
  {/each}
</ol>
