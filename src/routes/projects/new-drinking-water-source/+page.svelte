<!--
  The new drinking water source, as a project: the radial collector well on
  the Merrimack at 309 East Broadway, from the loan order of 2016 to the order
  of 2026 that would raise it. The words quoted are the Water/Wastewater
  Director's, from his memo behind the 2026 order.
-->
<script lang="ts">
  import ProjectTimeline from "$lib/ProjectTimeline.svelte"
  import ShareButton from "$lib/ShareButton.svelte"
  import ShareMeta from "$lib/ShareMeta.svelte"
  import { PROJECTS, type Project } from "$lib/projects"
  import { Router } from "$lib/router"

  let { data } = $props()

  const PROJECT = PROJECTS.find((p) => p.slug === "new-drinking-water-source") as Project
  const sharedUrl = Router.sharedProject(PROJECT.slug)
  const description = `Haverhill's ${PROJECT.title}: the radial collector well at 309 East Broadway, and every sitting of the City Council that has taken it up.`
</script>

<ShareMeta url={sharedUrl} title={PROJECT.title} {description} />

<svelte:head>
  <title>{PROJECT.title} - Haverhill</title>
  <meta name="description" content={description} />
</svelte:head>

<div class="mx-auto max-w-6xl px-4 py-8">
  <header class="mb-6 border-b border-slate-200 pb-6">
    <p class="text-sm text-slate-500">Project</p>
    <h1>{PROJECT.title}</h1>
    <div class="mt-2">
      <ShareButton url={sharedUrl} text={PROJECT.title} />
    </div>
  </header>

  <div class="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
    <section aria-labelledby="scope">
      <h2 id="scope">The project</h2>
      <blockquote class="mt-3 border-l-4 border-slate-200 pl-4 text-slate-800">
        <p>
          The project scope includes the continued engineering, permitting, and construction of the
          radial collector well (RCW), pump system, electric/control building, electric service, and
          approximately 13,000 feet 24-inch transmission main from the RCW to the water treatment
          plant to bring the RCW online.
        </p>
      </blockquote>
      <p class="mt-3 text-sm text-slate-600">
        From the memo of Robert E. Ward, Director of Public Works &ndash; Water/Wastewater, November
        25, 2026, behind the
        <a
          class="text-sky-800 underline hover:text-slate-900"
          href={Router.meetingItem(
            "city-council-2026-12-01",
            "new-drinking-water-source-loan-order",
          )}>amended loan order</a
        > before the City Council on December 1, 2026.
      </p>
    </section>

    <ProjectTimeline project={PROJECT} today={data.today} fold={false} />
  </div>
</div>
