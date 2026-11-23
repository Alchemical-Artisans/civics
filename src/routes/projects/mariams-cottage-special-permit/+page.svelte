<!--
  Mariam's Cottage, the bed and breakfast at 421 East Broadway, as a project:
  heard on 30 June 2026 and continued for a modified proposal, then continued
  sitting to sitting at the applicant's request.

  The timeline is the record here, as the other permits' is. The hearing, the
  letters for and against, and the vote to continue are on the item pages
  rather than restated.
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

  const PROJECT = PROJECTS.find((p) => p.slug === "mariams-cottage-special-permit") as Project
  const sharedUrl = Router.sharedProject(PROJECT.slug)
  const description = `Haverhill's ${PROJECT.title}: the application to run a bed and breakfast with small events at 421 East Broadway, and every sitting that took it up.`
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
          Attorney Jonathan Stark-Sachs for client Maryam Salehi-Ala-Yamin requests approval to
          operate &ldquo;Mariam&rsquo;s Cottage&rdquo; a family run bed and breakfast at 421 East
          Broadway allowed with a special permit in the RR (Rural Residential) zoning district and
          seeks to host small-scale weddings and similar outdoor events of up to 50 guests packaged
          with overnight stays
        </p>
      </blockquote>
      <p class="mt-3 text-sm text-slate-600">
        From the
        <a
          class="text-sky-800 underline hover:text-slate-900"
          href={Router.meetingItem("city-council-2026-06-30", "mariams-cottage-special-permit")}
          >City Council agenda of June 30, 2026</a
        >, Doc 21-D. The city files it as
        <PermitRecord number="CCSP-26-3" />.
      </p>

      <AddressMap address="421 East Broadway, Haverhill, MA" lat={42.783045} lon={-71.024913} />
    </section>

    <ProjectTimeline project={PROJECT} today={data.today} />
  </div>
</div>
