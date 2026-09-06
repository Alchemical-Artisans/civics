<script lang="ts">
  // `/` does not introduce the site, it opens the budget. An index costs every
  // visitor a hop to reach what they came for, which is the objection that
  // turned the meeting page into the write-up rather than a stop on the way to
  // it; a page whose whole content is two links onward is that same stop under
  // a different name.
  //
  // The forwarding is a meta refresh rather than a redirect status, and both
  // halves of that are deliberate.
  //
  // It is not a 301. GitHub Pages serves plain files and cannot send one, but a
  // permanent redirect would be the wrong tool even where it could: browsers
  // cache them, sometimes for as long as the profile lives, and would keep
  // sending people to FY2027 long after FY2028 replaced it. Nothing about a
  // meta refresh is cached that way, so the destination is free to move every
  // year -- which is exactly what it will do.
  //
  // It is not SvelteKit's `redirect()` either. Thrown from a `+page.ts` that
  // prerenders to this same meta refresh preceded by `location.href = ...`,
  // which pushes a history entry. The back button would then land on `/` and be
  // thrown forward again, trapping visitors on the site. A meta refresh that
  // fires while the page is still loading replaces its history entry instead,
  // so back goes where the visitor came from; `page.svelte.e2e.ts` holds that
  // down.
  import { Router } from "$lib/router"
  import { bookName } from "$lib/heading"

  let { data } = $props()

  // Resolved on the root layout, which the header needs it for too -- the
  // front door and the header's budget link are the same destination.
  //
  // With no book written up there is no budget page to open at all -- the
  // years the city publishes are links to its own PDFs, in the menu at the top
  // -- so the forward falls back to the other half of the site rather than
  // sending a visitor off to the city's CDN.
  const book = $derived(data.budgetBook)
  const destination = $derived(book ? Router.budgetBook(book.id) : Router.calendar())
  const label = $derived(book ? `the ${bookName(book.year)}` : "the meeting calendar")
</script>

<svelte:head>
  <title>Meetinghouse</title>
  <meta http-equiv="refresh" content="0;url={destination}" />
</svelte:head>

<!-- Seen only if the refresh does not fire, e.g. by a crawler that reads the
     markup without following it. The calendar is not repeated here: the header
     above carries it on every page, this one included. -->
<div class="mx-auto max-w-2xl px-4 py-12">
  <p class="text-slate-600">
    Continue to <a class="underline" href={destination}>{label}</a>.
  </p>
</div>
