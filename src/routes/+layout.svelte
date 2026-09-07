<script lang="ts">
  import { page } from "$app/state"
  import { locales, localizeHref } from "$lib/paraglide/runtime"
  import "./layout.css"
  import favicon from "$lib/assets/favicon.svg"
  import SiteHeader from "$lib/SiteHeader.svelte"
  import SiteFooter from "$lib/SiteFooter.svelte"

  let { data, children } = $props()

  // The budget half renders the footer itself, above the budget calendar that
  // is fixed to the bottom of every one of its pages; a second copy here would
  // sit behind that calendar. `route.id`, not the URL -- same reason as
  // SiteHeader: with `paths.relative` on the two disagree during prerendering.
  const onBudget = $derived((page.route.id ?? "").startsWith("/budget"))
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<SiteHeader years={data.budgetYears} />
{@render children()}
{#if !onBudget}<SiteFooter />{/if}

<div style="display:none">
  {#each locales as locale (locale)}
    <!-- The one link not built by Router: it points at the page being rendered,
         and page.url.pathname already carries the base path. Adding the base a
         second time here is what broke prerendering when the site moved to a
         /repo-name subpath for GitHub Pages. -->
    <a href={localizeHref(page.url.pathname, { locale })}>{locale}</a>
  {/each}
</div>
