<!--
  The words of one block of the drought guide, links drawn as links.

  A block's text carries its links as `[label](address)`, and a token run is
  what `runs()` makes of them: one anchor per link, not one per word. An
  address of the form `ref:file` is one of the site's own committed references
  and is resolved here, the way the article itself resolves it.
-->
<script lang="ts">
  import { Router } from "$lib/router"
  import { runs, type Token } from "$lib/text-diff"

  let { tokens }: { tokens: Token[] } = $props()

  const SPACE = " "
  const address = (href: string) =>
    href.startsWith("ref:") ? Router.reference(href.slice(4)) : href
</script>

{#each runs(tokens) as run, i (i)}{#if run.href}{SPACE}<a
      href={address(run.href)}
      target="_blank"
      rel="external noopener noreferrer">{run.text.trimStart()}</a
    >{:else}{run.text}{/if}{/each}
