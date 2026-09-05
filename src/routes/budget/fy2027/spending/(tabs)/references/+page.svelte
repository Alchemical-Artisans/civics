<script lang="ts">
  // `BookReferences` used to sit outside every tab, in the shared layout,
  // so a reader never had to go looking for it -- true, but it meant six
  // topics' worth of references arrived under every one of them whether
  // asked for or not. Its own tab now: `items` and `book` are the same two
  // props the layout used to hand it, read off `data` the same way any
  // other route under it does, since the layout's own load still carries
  // them. `heading={false}` because this tab's own name in the nav above
  // it already says "References" -- the component's default heading is for
  // `debt`, `reserves` and `education`, each titled something else.
  import BookReferences from "$lib/BookReferences.svelte"

  let { data } = $props()
</script>

<BookReferences items={data.references} book={data.book} heading={false} />
