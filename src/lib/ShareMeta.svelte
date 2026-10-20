<!--
  What a link to a page unfurls as on Facebook, X, Bluesky, LinkedIn and
  Discord: each reads the Open Graph tags (X its own `twitter:` ones, falling
  back to them) out of the prerendered HTML, so the card is specific to the
  page without any script running. The meeting layout writes its own, being
  the first page that had a "Share"; a project page renders this one beside
  its `ShareButton`, handed the same `url` so the card and the posted link
  cannot disagree.
-->
<script lang="ts">
  let { url, title, description }: { url: string; title: string; description: string } = $props()
</script>

<svelte:head>
  <meta property="og:type" content="article" />
  <meta property="og:site_name" content="Haverhill Meeting Calendar" />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:url" content={url} />
  <link rel="canonical" href={url} />
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />
</svelte:head>
