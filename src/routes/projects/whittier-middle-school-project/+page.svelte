<!--
  The Whittier Middle School Project, as a project: the city's feasibility
  study for a 1957 middle school, the three enrollment options that turn on
  whether Tilton closes, and the dates the schedule already fixes.

  The School Committee's agenda calls it "JGW/Tilton School Building Updates"
  and will do so again at every sitting it comes back to; the undertaking runs
  from the Statement of Interest Haverhill filed in 2022 to a first day of
  school in September 2031, which is the wrong shape for an agenda line. What
  this page carries beyond the timeline is the city's own two sentences on why
  the school is being looked at, from the overview it published for the
  5 November session; the three options and the existing-conditions survey are
  on the item's own page, where the Committee saw them.
-->
<script lang="ts">
  import ProjectTimeline from "$lib/ProjectTimeline.svelte"
  import ShareButton from "$lib/ShareButton.svelte"
  import ShareMeta from "$lib/ShareMeta.svelte"
  import { PROJECTS, type Project } from "$lib/projects"
  import { Router } from "$lib/router"

  let { data } = $props()

  const PROJECT = PROJECTS.find((p) => p.slug === "whittier-middle-school-project") as Project
  const sharedUrl = Router.sharedProject(PROJECT.slug)
  const description =
    "Haverhill's Whittier Middle School Project: the MSBA feasibility study for J.G. Whittier Middle School, the enrollment options that turn on whether Tilton closes, and every sitting that has taken it up."

  const ITEM = Router.meetingItem(
    "school-committee-2026-10-22",
    "jgw-tilton-school-building-updates",
  )
</script>

<ShareMeta url={sharedUrl} title={PROJECT.title} {description} />

<svelte:head>
  <title>{PROJECT.title} - Haverhill</title>
  <meta name="description" content={description} />
</svelte:head>

<div class="mx-auto max-w-6xl px-4 py-8">
  <header class="mb-6 border-b border-slate-200 pb-6">
    <p class="text-sm text-slate-500">Project</p>
    <h1 class="text-2xl font-bold tracking-tight text-slate-900">{PROJECT.title}</h1>
    <div class="mt-2">
      <ShareButton url={sharedUrl} text={PROJECT.title} />
    </div>
  </header>

  <div class="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
    <!-- The district's own words for what the project is, from the overview
         sheet it published alongside the invitation to the 5 November
         session; the rest of that sheet, and the School Building Committee's
         survey of the building, are on the item's page. -->
    <section aria-labelledby="overview">
      <h2 id="overview" class="text-lg font-semibold text-slate-900">What is being considered</h2>
      <blockquote class="mt-3 border-l-4 border-slate-200 pl-4 text-slate-800">
        <p>
          Built in 1957, Whittier Middle School has served generations of Haverhill students without
          a major renovation. As the building ages, the City of Haverhill is partnering with the
          Massachusetts School Building Authority (MSBA) to explore long-term solutions that address
          facility challenges and support the educational needs of current and future students.
        </p>
      </blockquote>
      <p class="mt-3 text-sm text-slate-600">
        From
        <a class="text-sky-800 underline hover:text-slate-900" href={ITEM}>
          &ldquo;The Whittier Middle School Project: What You Need to Know&rdquo;
        </a>, published with the School Committee&rsquo;s agenda of October 22, 2026.
      </p>
    </section>

    <!-- Three entries so far: nothing to fold. -->
    <ProjectTimeline project={PROJECT} today={data.today} fold={false} />
  </div>
</div>
