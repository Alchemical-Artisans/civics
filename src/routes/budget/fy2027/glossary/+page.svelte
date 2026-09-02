<script lang="ts">
  // A script here because the glossary is data: the same terms are what
  // `GlossaryTerm` puts under a word on the other pages, and a definition
  // transcribed twice is a definition that will eventually disagree with
  // itself. See docs/budget-pages.md.
  import { TERMS } from "$lib/glossary"
  import { termSlug } from "$lib/glossary"
</script>

<!-- The book's own heading. Every term is printed as it prints them, in its
     order, which is alphabetical apart from where the book itself slips. -->
<h2>Glossary of Terms</h2>

<dl>
  {#each TERMS as entry (entry.term)}
    <dt id={termSlug(entry.term)}>{entry.printed ?? entry.term}</dt>
    <dd>{entry.definition}</dd>
  {/each}
</dl>
