<script lang="ts">
  import { page } from "$app/state"
  import { locales, localizeHref } from "$lib/paraglide/runtime"
  import "./layout.css"
  import favicon from "$lib/assets/favicon.svg"

  let { children } = $props()
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
{@render children()}

<div style="display:none">
  {#each locales as locale (locale)}
    <!-- The one link not built by Router: it points at the page being rendered,
         and page.url.pathname already carries the base path. Adding the base a
         second time here is what broke prerendering when the site moved to a
         /repo-name subpath for GitHub Pages. -->
    <a href={localizeHref(page.url.pathname, { locale })}>{locale}</a>
  {/each}
</div>
