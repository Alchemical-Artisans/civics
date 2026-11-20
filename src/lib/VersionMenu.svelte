<!--
  The drought guide's versions as a dropdown, newest first, each opening the
  page that shows what it changed.

  A `<details>`, so it opens and every version is a plain link before anything
  hydrates. Once live it also closes the way a menu is expected to: on a click
  anywhere else, and on Escape, which hands focus back to the summary.
-->
<script lang="ts">
  import { onMount } from "svelte"
  import { formatLongDate } from "$lib/calendar"
  import { Router } from "$lib/router"

  let {
    versions,
    /** The version being viewed; none on the guide itself. */
    current = null,
    label,
  }: {
    versions: { id: string; date: string }[]
    current?: string | null
    label: string
  } = $props()

  let menu: HTMLDetailsElement
  let summary: HTMLElement

  onMount(() => {
    const click = (event: MouseEvent) => {
      if (menu.open && !menu.contains(event.target as Node)) menu.open = false
    }
    const key = (event: KeyboardEvent) => {
      if (event.key === "Escape" && menu.open) {
        menu.open = false
        summary.focus()
      }
    }
    document.addEventListener("click", click)
    document.addEventListener("keydown", key)
    return () => {
      document.removeEventListener("click", click)
      document.removeEventListener("keydown", key)
    }
  })
</script>

<details bind:this={menu} class="relative inline-block">
  <summary
    bind:this={summary}
    class="cursor-pointer list-none text-blue-700 hover:underline [&::-webkit-details-marker]:hidden"
  >
    {label} <span aria-hidden="true">&#9662;</span>
  </summary>
  <ul
    class="absolute left-0 z-20 m-0 mt-1 min-w-60 list-none rounded border border-slate-200 bg-white p-1 text-sm shadow-lg"
  >
    {#each versions as v, i (v.id)}
      <li class="m-0 p-0">
        <a
          href={Router.droughtHistory(v.id)}
          aria-current={v.id === current ? "page" : undefined}
          class="block rounded px-3 py-1.5 whitespace-nowrap text-slate-800 no-underline hover:bg-slate-100 aria-[current=page]:font-semibold"
        >
          {formatLongDate(v.date)}{#if i === 0}<span class="text-slate-500"> (latest)</span>{/if}
        </a>
      </li>
    {/each}
  </ul>
</details>
