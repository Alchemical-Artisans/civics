<!--
  One recorded version of an issue guide: what it changed since the version
  before, one paragraph at a time, then its whole text. The drought and ALPR
  guides' `history/[version]` routes are this component and their own name;
  see docs/drought-pages.md#page-history.
-->
<script lang="ts">
  import BlockText from "$lib/BlockText.svelte"
  import DiffBlock from "$lib/DiffBlock.svelte"
  import VersionMenu from "$lib/VersionMenu.svelte"
  import { formatLongDate } from "$lib/calendar"
  import { tokenize, type Block } from "$lib/text-diff"
  import type { Issue } from "$lib/router"
  import type { Located } from "$lib/server/issue-history"

  let {
    data,
    guide,
    home,
  }: {
    /** `versionPage()`'s result. */
    data: {
      issue: Issue
      id: string
      date: string
      note: string | null
      previous: { id: string; date: string } | null
      versions: { id: string; date: string }[]
      article: Located[] | null
      timeline: Located[] | null
      blocks: Block[]
      timelineBlocks: Block[]
    }
    /** The guide's own title, which the tab names this version after. */
    guide: string
    /** The current guide's address. */
    home: string
  } = $props()

  const TITLE = $derived(`${guide}: version of ${formatLongDate(data.date)}`)

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

<p class="m-0 flex flex-wrap items-baseline gap-x-2 text-sm">
  <a href={home}>&larr; The current guide</a>
  <span aria-hidden="true">·</span>
  <VersionMenu
    issue={data.issue}
    versions={data.versions}
    current={data.id}
    label="Other versions"
  />
</p>

<h1>Version of {formatLongDate(data.date)}</h1>

{#if data.note}<p>{data.note}</p>{/if}

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
{/if}

<h2>The whole of this version</h2>

<!-- Open on the first version, which has no changes above it to read instead. -->
<details class="my-3" open={!data.previous}>
  <summary class="cursor-pointer font-semibold">Show the full text</summary>

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
