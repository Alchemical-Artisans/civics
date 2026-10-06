<!--
  One entry in the bar's section links that has a menu under it: a word, a
  caret, and a list that opens on hover or on a press of the caret.

  Budget was the only one for a long time and this was written inline in
  `SiteHeader`; it is a component now that Projects has a menu too, so the two
  cannot drift apart in how they open, close and hand over from CSS to script.
  Everything a menu needs to say -- the years of the budget, the projects by
  kind -- is the `children` it is given, as `<li>`s.

  The word is a link where there is a page for it to go to (Budget goes to this
  year's book). Where there is none -- Projects has no index, the menu being
  the list -- the word is itself the button that opens the menu, rather than a
  dead label beside a caret.
-->
<script lang="ts">
  import { onMount, type Snippet } from "svelte"
  import { page } from "$app/state"

  let {
    label,
    href,
    current,
    id,
    toggle,
    children,
  }: {
    /** The word in the bar. */
    label: string
    /** Where the word goes, if anywhere; without one, the word opens the menu. */
    href?: string
    /** Whether the reader is somewhere in this section. */
    current: boolean
    /** The list's id, which the caret's `aria-controls` points at. */
    id: string
    /** What the caret does, for a screen reader: "Every fiscal year". */
    toggle: string
    children: Snippet
  } = $props()

  // The menu opens under the pointer and closes when it leaves, which is the
  // only way to have a word be a link to one page *and* a way to every other
  // one: a word that navigates cannot also be the thing you press to see a
  // list. The caret beside it is that press, and it is what a touch screen --
  // which has no hover to give -- uses instead.
  //
  // The hover is written twice on purpose: in the CSS below, so it works on a
  // page that has not hydrated or that runs no script at all, and here, so the
  // caret's `aria-expanded` says what is actually on screen. The two agree
  // because both are the same condition.
  let shown = $state(false)
  let item: HTMLElement | undefined = $state()

  // Which of the two is in charge. Before the page hydrates the CSS is, because
  // it is the only thing there; from mount on the state above is, so that
  // Escape and a second press on the caret can close a menu the pointer is
  // still sitting on -- which CSS `:hover`, left in play, would hold open.
  let live = $state(false)
  onMount(() => (live = true))

  const close = () => (shown = false)

  // Only a mouse. A tap fires `pointerenter` as well, and on a phone that
  // would open the menu under the finger already on its way to the link.
  const enter = (event: PointerEvent) => {
    if (event.pointerType === "mouse") shown = true
  }

  // Not while the reader is in it: the menu they pressed the caret to open, and
  // are tabbing through, should not vanish because the mouse wandered off.
  const leave = (event: PointerEvent) => {
    if (event.pointerType !== "mouse") return
    if (item?.contains(document.activeElement)) return
    shown = false
  }

  // Tab through the entries and the menu stays up; tab past the last of them
  // and it closes. `focusout` fires before the next element takes focus, so
  // where focus is going is `relatedTarget` rather than anything readable from
  // here.
  //
  // There is no matching `focusin`. Focus does not open the menu -- pressing
  // the caret does, by keyboard exactly as by thumb -- because a click gives
  // the button focus a moment before it fires, and a menu that opens on focus
  // would then be closed again by the press that opened it.
  const left = (event: FocusEvent) => {
    if (!item?.contains(event.relatedTarget as Node | null)) close()
  }

  // The page changes under a menu that stays exactly as it was, because
  // SvelteKit navigates without replacing the bar.
  $effect(() => {
    if (page.url.pathname) close()
  })

  $effect(() => {
    const past = (event: PointerEvent) => {
      if (shown && !item?.contains(event.target as Node)) close()
    }
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") close()
    }

    document.addEventListener("pointerdown", past)
    document.addEventListener("keydown", escape)
    return () => {
      document.removeEventListener("pointerdown", past)
      document.removeEventListener("keydown", escape)
    }
  })

  // The word, where it is the button: a mouse has already opened the menu by
  // hovering on its way to the click, so a click from one leaves it open rather
  // than toggling it shut under the pointer. A keyboard or a thumb, which
  // hovered nothing, toggles.
  const press = (event: MouseEvent) => {
    shown = (event as PointerEvent).pointerType === "mouse" ? true : !shown
  }

  const wordClass = $derived(
    `underline decoration-slate-300 hover:decoration-slate-900 ${
      current ? "font-medium text-slate-900" : "text-slate-600"
    }`,
  )
</script>

<!-- `role="none"`: the wrapper is where hovering is noticed and, from `sm` up,
     where the menu is positioned from, and nothing more -- the word, the caret
     and the list under it carry every bit of the meaning.

     Only from `sm` up. On a phone the bar holds two menus side by side, and a
     menu hung off the right of a word that is not the last thing in the bar
     runs off the left of the screen; there the wrapper is not positioned, so
     the list hangs off the right edge of the bar itself (`SiteHeader` makes
     that `relative`) and stays on screen whichever word opened it. -->
<div
  role="none"
  class="menu-item flex items-center gap-1 sm:relative"
  class:open={shown}
  class:live
  bind:this={item}
  onpointerenter={enter}
  onpointerleave={leave}
  onfocusout={left}
>
  {#if href}
    <a class={wordClass} {href} aria-current={current ? "page" : undefined}>{label}</a>

    <!-- The caret is the whole control on a touch screen, so it is a button of
         its own rather than a decoration on the link, and it is padded out to
         something a thumb can hit. -->
    <button
      class="-m-2 cursor-pointer p-2 text-slate-500 hover:text-slate-900"
      type="button"
      aria-expanded={shown}
      aria-controls={id}
      onclick={() => (shown = !shown)}
    >
      <span aria-hidden="true">&#9662;</span>
      <span class="sr-only">{toggle}</span>
    </button>
  {:else}
    <button
      class="flex cursor-pointer items-center gap-1"
      type="button"
      aria-current={current ? "page" : undefined}
      aria-expanded={shown}
      aria-controls={id}
      onclick={press}
    >
      <span class={wordClass}>{label}</span>
      <span class="text-slate-500 hover:text-slate-900" aria-hidden="true">&#9662;</span>
      <span class="sr-only">, {toggle}</span>
    </button>
  {/if}

  <!-- Taller than most screens if it ran to its content, so it scrolls within
       itself; `right-0` so it opens leftward, back across the bar, rather than
       off the end of the window. It sits against the bar rather
       than below a gap, so crossing into it does not take the pointer out of
       what it is hovering. -->
  <ul
    class="menu-list absolute top-full right-2 z-50 m-0 max-h-[70vh] w-60 list-none overflow-y-auto rounded border border-slate-200 bg-white p-1 shadow-lg sm:right-0"
    {id}
  >
    {@render children()}
  </ul>
</div>

<style>
  /*
    The menu is hidden markup rather than markup that is not there, so hovering
    reveals it with no script: a reader whose page has not hydrated, or who runs
    none at all, still gets every entry. `:not(.live)` hands that job over the
    moment the component mounts, so there is never a page where CSS and the
    component disagree about what is on screen.

    `@media (hover: hover)` keeps it off a touch screen, where a tap counts as a
    hover and then stays hovered until something else is touched -- the menu
    would open on the way to the link and sit there afterwards. The caret is
    what a touch screen presses instead, and `.open` is that press.
  */
  .menu-list {
    display: none;
  }

  .menu-item.open .menu-list {
    display: block;
  }

  @media (hover: hover) {
    .menu-item:not(.live):hover .menu-list,
    .menu-item:not(.live):focus-within .menu-list {
      display: block;
    }
  }
</style>
