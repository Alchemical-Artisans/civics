<!--
  The record number an agenda prints, linked to the city's record behind it.

  A Council agenda names a petition twice over -- "Doc 21-J - CCSP-26-7" -- and
  the second of those is a permit the city is running on OpenGov, where the
  whole application sits: the form as filed, the departments' memos, the
  abutters, every revision, and the letters for and against. The Council's own
  packet for 27 Marshland Street carries seven documents; the record carries
  twenty-five, the opposition letter and the planning memo among them. The
  number is the only thing joining the two, so the number is what carries the
  way there -- a link, and nothing else added to the page.

  The number is its own link text. A write-up is the city's words, and the city
  printed this one; a label saying where the link goes would be ours, so there
  is none, and the destination is announced to a screen reader instead.

  A number nobody has looked the record up for stays the plain text the document
  printed. `$lib/permits.ts` says why that lookup is by hand and cannot be a
  scrape: the portal's data service answers an unproven request with a 403, the
  proof being a Cloudflare Turnstile header, so the id behind a number is copied
  off the record's own page by a person. An unlinked number is the honest state
  of one not yet copied -- never a guess at an id.
-->
<script lang="ts">
  import { permitRecord } from "$lib/permits"

  let { number }: { number: string } = $props()

  const href = $derived(permitRecord(number))
</script>

{#if href}
  <a {href} target="_blank" rel="external noopener noreferrer">
    {number}<span class="sr-only">, on the city&rsquo;s permit portal, opens in a new tab</span>
  </a>
{:else}
  {number}
{/if}
