<script lang="ts">
  import BlockText from "$lib/BlockText.svelte"
  import DiffBlock from "$lib/DiffBlock.svelte"
  import { formatLongDate } from "$lib/calendar"
  import { Router } from "$lib/router"
  import { tokenize } from "$lib/text-diff"

  let { data } = $props()

  const TITLE = $derived(`Haverhill Drought Guide: version of ${formatLongDate(data.date)}`)

  /** The changes grouped under the heading each fell beneath. */
  function bySection<T extends { section: string | null }>(items: T[]) {
    const groups: { section: string | null; items: T[] }[] = []
    for (const item of items) {
      const tail = groups.at(-1)
      if (tail && tail.section === item.section) tail.items.push(item)
      else groups.push({ section: item.section, items: [item] })
    }
    return groups
  }
</script>

<svelte:head>
  <title>{TITLE}</title>
  <!-- An old version is a record, not the guide: it should not compete with it in search. -->
  <meta name="robots" content="noindex" />
</svelte:head>

<p class="m-0 text-sm">
  <a href={Router.droughtHistory()}>&larr; Page history</a>
  <span aria-hidden="true">·</span>
  <a href={Router.droughtPage()}>The current guide</a>
</p>

<h1>Version of {formatLongDate(data.date)}</h1>

{#if !data.latest}
  <p class="rounded bg-amber-50 p-3 text-sm">
    This is an earlier version of the guide and is kept as a record. Figures and plans in it may
    since have changed; <a href={Router.droughtPage()}>the current guide</a> is the one to read.
  </p>
{/if}

{#if data.note}<p>{data.note}</p>{/if}

<p class="flex flex-wrap gap-x-4 text-sm">
  {#if data.previous}
    <a href={Router.droughtHistory(data.previous.id)}
      >&larr; Previous: {formatLongDate(data.previous.date)}</a
    >
  {/if}
  {#if data.next}
    <a href={Router.droughtHistory(data.next.id)}>Next: {formatLongDate(data.next.date)} &rarr;</a>
  {/if}
</p>

{#if data.previous && data.article && data.timeline}
  <h2>
    Changes in the article since {formatLongDate(data.previous.date)}
  </h2>
  {#each bySection(data.article) as group, g (g)}
    <h3 class="text-sm">{group.section ?? "Top of the page"}</h3>
    {#each group.items as item, i (i)}
      <DiffBlock change={item.change} />
    {/each}
  {:else}
    <p>The words of the article did not change.</p>
  {/each}

  <h2>Changes in the timeline</h2>
  {#each data.timeline as item, i (i)}
    <DiffBlock change={item.change} />
  {:else}
    <p>The timeline did not change.</p>
  {/each}
{:else}
  <p>This is the first published version.</p>
{/if}

<h2>The whole of this version</h2>

<details class="my-3">
  <summary class="cursor-pointer font-semibold">Show the full text</summary>

  <p class="text-sm text-slate-600">
    The words only: the charts, maps and figures are on the guide itself.
  </p>

  {#each data.blocks as block, i (i)}
    {#if block.tag === "li"}
      <p class="my-1 ml-4">&bull; <BlockText tokens={tokenize(block.text)} /></p>
    {:else if block.tag === "tr"}
      <p class="my-1 ml-4 text-sm">
        {#each block.text.split(" | ") as cell, c (c)}
          {#if c}<span aria-hidden="true"> | </span>{/if}{cell}
        {/each}
      </p>
    {:else}
      <svelte:element this={block.tag === "h1" ? "h3" : block.tag}>
        <BlockText tokens={tokenize(block.text)} />
      </svelte:element>
    {/if}
  {/each}

  <h3>Timeline</h3>
  {#each data.timelineBlocks as block, i (i)}
    <p class="my-1 ml-4 text-sm"><BlockText tokens={tokenize(block.text)} /></p>
  {/each}
</details>
