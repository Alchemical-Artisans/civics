<script lang="ts">
  // There is nothing worth landing on at `/` yet, so it forwards to the
  // calendar. The forwarding is a meta refresh rather than a redirect status
  // because GitHub Pages serves plain files and cannot send one — but a status
  // would be the wrong tool anyway. A 301 is cached by browsers, sometimes
  // indefinitely, and would keep sending people to /calendar long after a real
  // landing page replaced this file. Nothing about a meta refresh is cached
  // that way, so `/` is free to become a page of its own.
  //
  // SvelteKit's own `redirect()` in a `+page.ts` prerenders to this same meta
  // refresh, but preceded by `location.href = ...`, which pushes a history
  // entry. The back button would then land on `/` and be thrown forward again,
  // trapping visitors on the site. A meta refresh that fires while the page is
  // still loading replaces its history entry instead, so back goes where the
  // visitor came from.
  import { Router } from "$lib/router"
</script>

<svelte:head>
  <meta http-equiv="refresh" content="0;url={Router.calendar()}" />
</svelte:head>

<!-- Seen only if the refresh does not fire, e.g. by a crawler that reads the
     markup without following it. -->
<div class="mx-auto max-w-2xl px-4 py-12">
  <p class="text-slate-600">
    Continue to the <a href={Router.calendar()} class="underline">meeting calendar</a>.
  </p>
</div>
