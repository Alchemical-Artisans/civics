<!--
  The 233 Winter Street special permit, as a project: the mixed-use store and
  ten units the Council heard on 7 October 2025, continued, and granted on
  conditions on 9 December.

  The timeline is the whole of the record here, as the Marshland Street
  permit's is: one sitting that opened the hearing and continued it, and one
  that decided it. The discussion and each condition's vote are in the minutes
  on the 9 December item page rather than restated here.
-->
<script lang="ts">
  import AddressMap from "$lib/AddressMap.svelte"
  import PermitRecord from "$lib/PermitRecord.svelte"
  import ProjectTimeline from "$lib/ProjectTimeline.svelte"
  import ShareButton from "$lib/ShareButton.svelte"
  import ShareMeta from "$lib/ShareMeta.svelte"
  import { PROJECTS, type Project } from "$lib/projects"
  import { Router } from "$lib/router"

  let { data } = $props()

  const PROJECT = PROJECTS.find((p) => p.slug === "233-winter-st-special-permit") as Project
  const sharedUrl = Router.sharedProject(PROJECT.slug)
  const description = `Haverhill's ${PROJECT.title}: the application to build a mixed-use store and a 10-unit multifamily dwelling at 233 Winter Street, and every sitting that took it up.`
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
    <section aria-labelledby="application">
      <h2 id="application">The application</h2>
      <blockquote class="mt-3 border-l-4 border-slate-200 pl-4 text-slate-800">
        <p>
          Attorney Paul Magliocchetti for client <em>233 Winter Street LLC</em> requests to construct
          a Mixed-Use Store and a 10-Unit Multifamily Dwelling at 233 Winter st; Map 306, Block 75, Lots
          3
        </p>
      </blockquote>
      <p class="mt-3 text-sm text-slate-600">
        From the
        <a
          class="text-sky-800 underline hover:text-slate-900"
          href={Router.meetingItem("city-council-2025-12-09", "233-winter-st-special-permit")}
          >City Council agenda of December 9, 2025</a
        >, Document 91. The city files it as
        <PermitRecord number="CCSP 25-7" />.
      </p>

      <AddressMap address="233 Winter St, Haverhill, MA" lat={42.77803} lon={-71.0858837} />
    </section>

    <!-- Two steps: nothing to fold. -->
    <ProjectTimeline project={PROJECT} today={data.today} fold={false} />
  </div>
</div>
