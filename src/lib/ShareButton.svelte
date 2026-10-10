<!--
  "Share" for a meeting's agenda or one item on it, in the meeting header.

  A panel of links in the shape `AddToCalendar` uses, dismissed the same way
  (Escape or a click outside) and for the same reason: it is a handful of links
  reached with Tab, not a `role=menu` widget. Four networks take a link from a
  plain `<a>`; those are built in `Router` and need no script once the panel is
  open. Two things do need one:

  - Discord has no "share this" address -- there is nowhere to send a reader
    that would post for them -- so its row copies the link to paste into a
    channel, and says it has.
  - The QR code opens in place beneath the links rather than as a modal, for a
    reader holding up a phone to someone across a room. It is built from the
    address by `$lib/qr`, so it cannot disagree with the links above it.
-->
<script lang="ts">
  import Icon from "@iconify/svelte/dist/OfflineIcon.svelte"
  import share from "@iconify-icons/material-symbols/share-outline"
  import { Router } from "$lib/router"
  import { qrPath } from "$lib/qr"

  /** `url` is the page's public address; `text` is the words that go with it. */
  let { url, text }: { url: string; text: string } = $props()

  let open = $state(false)
  let showCode = $state(false)
  let copied = $state(false)
  let button = $state<HTMLButtonElement>()
  let panel = $state<HTMLDivElement>()
  const id = $props.id()

  const code = $derived(showCode ? qrPath(url) : undefined)

  function close(refocus = false) {
    open = false
    showCode = false
    copied = false
    if (refocus) button?.focus()
  }

  function onkeydown(e: KeyboardEvent) {
    if (open && e.key === "Escape") close(true)
  }

  function onpointerdown(e: PointerEvent) {
    const target = e.target as Node
    if (open && !button?.contains(target) && !panel?.contains(target)) close()
  }

  async function copyForDiscord() {
    try {
      await navigator.clipboard.writeText(url)
      copied = true
    } catch {
      // Clipboard access can be refused (an insecure origin, a denied
      // permission). Say so rather than claiming a copy that did not happen.
      window.prompt("Copy this link to paste into Discord:", url)
    }
  }

  const item = "rounded px-2 py-1 text-left text-slate-700 hover:bg-slate-50 hover:text-slate-900"
</script>

<svelte:window {onkeydown} {onpointerdown} />

<div class="relative">
  <button
    bind:this={button}
    type="button"
    aria-expanded={open}
    aria-controls={id}
    onclick={() => (open ? close() : (open = true))}
    class="inline-flex cursor-pointer items-center gap-1 text-sm text-slate-600 underline hover:text-slate-900"
  >
    <Icon icon={share} width="16" height="16" aria-hidden="true" />
    Share
  </button>

  <div
    bind:this={panel}
    {id}
    hidden={!open}
    class="absolute left-0 z-20 mt-1 flex w-max flex-col rounded-lg border border-slate-200 bg-white p-1 text-sm shadow-lg"
  >
    <button type="button" class="cursor-pointer {item}" onclick={() => (showCode = !showCode)}>
      QR code
    </button>
    {#if code}
      <div class="p-2">
        <svg
          viewBox="0 0 {code.size} {code.size}"
          class="h-44 w-44 rounded bg-white"
          role="img"
          aria-label="QR code for {url}"
          shape-rendering="crispEdges"
        >
          <rect width={code.size} height={code.size} fill="#fff" />
          <path d={code.d} fill="#000" />
        </svg>
      </div>
    {/if}
    <a
      class={item}
      href={Router.shareFacebook(url)}
      target="_blank"
      rel="external noopener noreferrer"
      onclick={() => close()}
    >
      Facebook<span class="sr-only">, opens in a new tab</span>
    </a>
    <a
      class={item}
      href={Router.shareX(url, text)}
      target="_blank"
      rel="external noopener noreferrer"
      onclick={() => close()}
    >
      X / Twitter<span class="sr-only">, opens in a new tab</span>
    </a>
    <a
      class={item}
      href={Router.shareBluesky(url, text)}
      target="_blank"
      rel="external noopener noreferrer"
      onclick={() => close()}
    >
      Bluesky<span class="sr-only">, opens in a new tab</span>
    </a>
    <a
      class={item}
      href={Router.shareLinkedIn(url)}
      target="_blank"
      rel="external noopener noreferrer"
      onclick={() => close()}
    >
      LinkedIn<span class="sr-only">, opens in a new tab</span>
    </a>
    <button type="button" class="cursor-pointer {item}" onclick={copyForDiscord}>
      Discord
      <span class="text-slate-400" role="status">
        {copied ? "— link copied, paste it in a channel" : "— copies the link"}
      </span>
    </button>
  </div>
</div>
