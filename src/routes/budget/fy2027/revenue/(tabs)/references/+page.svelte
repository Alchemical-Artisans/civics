<script lang="ts">
  // The same split `spending` made first: `BookReferences` used to sit
  // outside every tab in the shared layout, so eight topics' worth of
  // references would arrive under whichever one was open, whether asked for
  // or not. Its own tab now: `items` and `book` come off `data`, read the
  // same way any other route under this layout does, since `+layout.ts`
  // still carries them. `heading={false}` because this tab's own name in
  // the nav above it already says "References".
  import BookReferences from "$lib/BookReferences.svelte"

  let { data } = $props()
</script>

<BookReferences items={data.references} book={data.book} heading={false} />
