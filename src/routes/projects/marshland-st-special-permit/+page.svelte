<!--
  The 27 Marshland Street special permit, as a project: the application to
  replace one house with three townhouses, followed from the hearing the
  Council set on 28 July 2026 through each sitting that has taken it up.

  The timeline is the whole of the page, as Pentucket North's is. A permit is
  decided by one vote at the end of it, and until then the record -- opened,
  continued, continued again, answered -- is what the page has to show. What
  the Council is actually weighing, the departments' comments against the
  applicant's answers, is on the 20 October item page rather than restated
  here: the project says where the permit has got to, the item page says what
  is in front of the Council tonight.

  The permit number carries the link to the city's own portal, which holds a
  good deal the Council's packets do not -- the full application, the
  correspondence, every revision filed. See `src/lib/permits.ts` for why that
  record page is the only part of it that can be linked.
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

  const PROJECT = PROJECTS.find((p) => p.slug === "marshland-st-special-permit") as Project
  const sharedUrl = Router.sharedProject(PROJECT.slug)
  const description = `Haverhill's ${PROJECT.title}: the application to demolish a single-family house and build three attached townhouses at 27 Marshland Street, and every sitting that has taken it up.`
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
          Matt Silva for Sterling Commonwealth Builders requests approval to demolish existing
          single-family residence and construct three (3) attached townhouse condominium units on a
          single parcel at 27 Marshland St in the RH (Residential High) Zone. Each unit is proposed
          to contain three (3) bedrooms, 2 and one-half bathrooms, and an attached two-car garage
        </p>
      </blockquote>
      <p class="mt-3 text-sm text-slate-600">
        From the
        <a
          class="text-sky-800 underline hover:text-slate-900"
          href={Router.meetingItem("city-council-2026-10-20", "marshland-st-special-permit")}
          >City Council agenda of October 20, 2026</a
        >, Doc 21-J, the application as the Council has it. The city files it as
        <PermitRecord number="CCSP-26-7" />.
      </p>

      <AddressMap address="27 Marshland St, Haverhill, MA" lat={42.7874681} lon={-71.0794599} />
    </section>

    <ProjectTimeline project={PROJECT} today={data.today} />
  </div>
</div>
