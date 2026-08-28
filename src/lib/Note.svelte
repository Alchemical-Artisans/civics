<!--
  A passage that pops over the page from an information icon.

  Agendas open with boilerplate the city repeats on every one -- Open Meeting
  Law status, remote access caveats, recording notices. It belongs on the page,
  because it is what the document says, but it is not what a reader came for,
  and inline it would push the agenda itself below the fold.

  The panel overlays rather than expands, so opening it never moves the text
  underneath. It is positioned against the nearest positioned ancestor, so the
  parent must be `relative` -- give it the width you want the panel to have,
  which keeps the panel inside the content column instead of running off the
  side of a narrow screen.
-->
<script lang="ts">
  import type { Snippet } from "svelte"
  // Iconify's offline component, not its default one. The default takes an
  // icon *name* and fetches the artwork from api.iconify.design at runtime;
  // this one takes the data directly, so the icon is inlined at build time and
  // nothing on this site needs the network to finish rendering. It also keeps
  // the API client -- 30-odd KB of it -- out of the bundle.
  import Icon from "@iconify/svelte/dist/OfflineIcon.svelte"
  import infoOutline from "@iconify-icons/material-symbols/info-outline-rounded"

  /**
   * Names the control for anyone who cannot see the icon, so it should say
   * what is behind it rather than "more information".
   */
  let { label, children }: { label: string; children: Snippet } = $props()

  let open = $state(false)
  let button = $state<HTMLButtonElement>()
  let panel = $state<HTMLDivElement>()

  const id = $props.id()

  function close(refocus = false) {
    open = false
    if (refocus) button?.focus()
  }

  // Dismissed by Escape or by a click anywhere else, the two things a reader
  // will try without being told.
  function onkeydown(event: KeyboardEvent) {
    if (open && event.key === "Escape") close(true)
  }

  function onpointerdown(event: PointerEvent) {
    const target = event.target as Node
    if (open && !button?.contains(target) && !panel?.contains(target)) close()
  }
</script>

<svelte:window {onkeydown} {onpointerdown} />

<button
  bind:this={button}
  type="button"
  aria-expanded={open}
  aria-controls={id}
  onclick={() => (open = !open)}
  class="inline-flex cursor-pointer items-center rounded-full text-slate-400 transition-colors hover:text-slate-700 focus-visible:ring-2 focus-visible:ring-sky-700 focus-visible:outline-none {open
    ? 'text-slate-700'
    : ''}"
>
  <Icon icon={infoOutline} width="20" height="20" aria-hidden="true" />
  <span class="sr-only">{label}</span>
</button>

<div
  bind:this={panel}
  {id}
  role="note"
  aria-label={label}
  hidden={!open}
  class="absolute top-full left-0 z-20 prose-sm mt-2 w-full rounded-lg border border-slate-200 bg-white p-4 shadow-lg prose-slate prose-p:my-0 prose-p:text-slate-600 prose-p:not-last:mb-3"
>
  {@render children()}
</div>
