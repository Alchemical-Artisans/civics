<!--
  A question on the ballot that is Haverhill's own, as the warrant prints it.
  The Commonwealth's questions are described in its voter guide, which a
  precinct page links to; this one is in no state publication, so it is quoted
  here, in the warrant's words.
-->
<script lang="ts">
  import ShareButton from "$lib/ShareButton.svelte"
  import ShareMeta from "$lib/ShareMeta.svelte"
  import { Router } from "$lib/router"
  import { PROJECT } from "../../election"

  let { data } = $props()
  const q = $derived(data.question)
  const sharedUrl = $derived(Router.sharedProject(PROJECT.slug, `questions/${q.number}`))
  const shareTitle = $derived(`Question ${q.number}: ${q.title} - ${PROJECT.title}`)
  const description = $derived(
    `Question ${q.number} on Haverhill's ballot in the ${PROJECT.title}, as the warrant prints it.`,
  )
</script>

<ShareMeta url={sharedUrl} title={shareTitle} {description} />

<svelte:head>
  <title>Question {q.number}: {q.title} - {PROJECT.title} - Haverhill</title>
  <meta name="description" content={description} />
</svelte:head>

<div class="mx-auto max-w-3xl px-4 py-8">
  <nav class="mb-6">
    <a
      class="text-sm text-slate-600 underline hover:text-slate-900"
      href={Router.project(PROJECT.slug)}
    >
      &larr; {PROJECT.title}
    </a>
  </nav>

  <h1 class="text-2xl font-bold tracking-tight text-slate-900">Question {q.number}: {q.title}</h1>
  <div class="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
    <p class="text-sm text-slate-600">Haverhill's own question, on every ballot in the city.</p>
    <ShareButton url={sharedUrl} text={shareTitle} />
  </div>

  <div class="prose mt-6 max-w-none prose-slate">
    <p>{q.question}</p>
    <h2>SUMMARY</h2>
    {#each q.summary as paragraph (paragraph)}
      <p>{paragraph}</p>
    {/each}
  </div>

  <p class="mt-6 text-sm text-slate-600">
    From the
    <a
      class="underline hover:text-slate-900"
      href={Router.meetingItem("city-council-2026-10-06", "election-warrant")}
      >warrant the City Clerk submitted to the Council</a
    >.
  </p>
</div>
