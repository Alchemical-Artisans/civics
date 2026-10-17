<script lang="ts">
  import AddressMap from "$lib/AddressMap.svelte"
  import Timeline from "$lib/Timeline.svelte"
  import { Router } from "$lib/router"
  import { CONCERNS, HEARING, type Passage } from "./record"

  const MEETING = "city-council-2026-10-20"
  const ITEM = "marshland-st-special-permit"
</script>

<!--
  What the Council is deciding on the left, where the thing is and how the
  hearing got here in a column beside it -- the same shape a project page has.

  The rail runs the length of the item rather than sitting above it: the map
  and the record are context for the pairs below, and stacked over them they
  pushed the substance of the item down the page and left a column of nothing
  beside themselves. The split also puts the item's own sentence back in a
  reading column, which the page's full width had stretched past tracking.

  `lg` and up only, and 5fr to 2fr rather than 2fr to 1fr, because the left
  column has two columns of its own inside it: the pairs want the width more
  than the map does, and below `lg` they would have nothing left. Stacked,
  the order is the sentence, the place, the record, then the pairs.
-->
<div class="grid gap-x-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,2fr)]">
  <div>
    <p>
      <strong>Doc 21-J</strong>- <strong>CCSP-26-7</strong> &ndash;Matt Silva for Sterling Commonwealth
      Builders requests approval to demolish existing single-family residence and construct three (3)
      attached townhouse condominium units on a single parcel at 27 Marshland St in the RH (Residential
      High) Zone. Each unit is proposed to contain three (3) bedrooms, 2 and one-half bathrooms, and an
      attached two-car garage
    </p>

    <hr />

    <!--
      What the departments and the neighbours asked for, beside what the
      applicant has filed in answer -- the question actually in front of the
      Council tonight, and the one thing neither packet puts in one place. The
      comments are in the 6 October packet's departmental review record; the
      answers are in the two letters filed for tonight. `record.ts` holds the
      pairs and says where each line comes from.

      This page used to set both of tonight's letters down in full, some
      eleven hundred words of them, which is every word the packet's prose
      contains and far more than a reader needs to see what is being decided.
      The letters are linked below and are the place for the whole of them.
    -->
    {#snippet passage(item: Passage)}
      <figure class="not-last:mb-4">
        <blockquote class="border-l-2 border-slate-300 pl-3 text-slate-800">
          {#each item.quotes as quote (quote)}
            <p class="not-last:mb-2">{quote}</p>
          {/each}
        </blockquote>
        <figcaption class="mt-1 pl-3 text-xs text-slate-500">
          <a href={item.href} target="_blank" rel="noopener">
            {item.source}<span class="sr-only">, PDF, opens in a new tab</span>
          </a>
        </figcaption>
      </figure>
    {/snippet}

    <section aria-labelledby="concerns" class="not-prose my-6">
      <!-- `sr-only`: the two column heads below say what this is, and a
           heading over them saying it a third way was the same words again.
           It stays in the markup because the pairs' own subjects are `h3`s
           and the page's `h1` is the layout's, so taking it out altogether
           would leave them hanging a level off -- and because a section
           with no name is not a section to anyone reading by landmark. -->
      <h2 id="concerns" class="sr-only">
        Concerns raised in review, and the applicant&rsquo;s answers
      </h2>

      <!-- The column heads are the pair's labels, and they sit above the first
       row rather than on every one; below `md` the two stack, where a head
       over a single column would be a head over half a pair, so they go. -->
      <div
        class="mt-4 hidden gap-x-8 border-b border-slate-200 pb-2 text-xs font-semibold tracking-wide text-slate-500 uppercase md:grid md:grid-cols-2"
      >
        <h3>Concerns raised</h3>
        <h3>The applicant&rsquo;s answer</h3>
      </div>

      {#each CONCERNS as concern (concern.subject)}
        <!-- The subject is ours and sits across both columns: on a phone the two
         halves are one above the other, and it is what keeps them a pair. -->
        <div class="border-b border-slate-200 py-4">
          <h3 class="mb-3 font-semibold text-slate-900">{concern.subject}</h3>
          <div class="grid gap-x-8 gap-y-4 text-sm md:grid-cols-2">
            <div>
              <!-- Stacked, the column heads above are gone and the two halves of a
               pair run one into the other, so each says which it is. Hidden
               where the heads are doing that job. -->
              <p
                class="mb-1 text-xs font-semibold tracking-wide text-slate-500 uppercase md:hidden"
              >
                Concern
              </p>
              {#each concern.raised as item (item.source + item.quotes[0])}
                {@render passage(item)}
              {/each}
            </div>
            <div>
              <p
                class="mb-1 text-xs font-semibold tracking-wide text-slate-500 uppercase md:hidden"
              >
                Answer
              </p>
              {#each concern.answered as item (item.source + item.quotes[0])}
                {@render passage(item)}
              {/each}
            </div>
          </div>
        </div>
      {/each}
    </section>
  </div>

  <!--
    The place and the record. The map is above the timeline because a reader
    asks where before they ask when, and both are the item's setting rather
    than its substance, which is why neither is in the column that carries the
    reading.

    The timeline is the hearing's own record, off the back of Document # 21-J,
    drawn on the same rail a project's timeline uses. It replaced a
    right-aligned line reading "Continued from October 6, 2026": a hearing
    opened in July and continued twice is a sequence, and a sequence set as
    one bold line in the gutter says only that something came before and
    leaves a reader to find out what. The dates and the counts are the
    Council's own, the clerk's attestation under each.
  -->
  <div>
    <AddressMap address="27 Marshland St, Haverhill, MA" lat={42.7874681} lon={-71.0794599} />

    <section aria-labelledby="hearing" class="not-prose mb-6">
      <h2 id="hearing" class="text-lg font-semibold text-slate-900">The hearing</h2>
      <Timeline entries={HEARING} />
    </section>
  </div>
</div>

<hr />

<ul>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/cover-sheet`)} target="_blank" rel="noopener">
      Document # 21-J, with the record of the hearing and its two continuances<span class="sr-only">
        , PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/revisions-letter`)} target="_blank" rel="noopener">
      Letter from Jonathan R. Stark-Sachs, Johnson &amp; Borenstein, LLC, October 15, 2026<span
        class="sr-only"
      >
        , PDF, two pages, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a
      href={Router.excerpt(MEETING, `${ITEM}/engineering-response`)}
      target="_blank"
      rel="noopener"
    >
      Letter from Daniel Dragani, P.E., Engineering Solutions Group, October 13, 2026<span
        class="sr-only"
      >
        , PDF, two pages, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/civil-site-plan`)} target="_blank" rel="noopener">
      Revised conceptual civil site plan, Engineering Solutions Group LLC<span class="sr-only">
        , PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/landscape-plans`)} target="_blank" rel="noopener">
      Revised landscape and tree plans, Melo Design<span class="sr-only">
        , PDF, two pages, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/presentation`)} target="_blank" rel="noopener">
      27 Marshland Street Special Permit, the applicant&rsquo;s presentation<span class="sr-only">
        , PDF, eleven pages, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a
      href={Router.excerpt(MEETING, `${ITEM}/planning-director-memo`)}
      target="_blank"
      rel="noopener"
    >
      Memorandum from Jacki Byerley, AICP, Planning Director, September 11, 2026<span
        class="sr-only"
      >
        , PDF, two pages, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.meetingItem("city-council-2026-10-06", ITEM)}>
      The rest of the permit record, as the Council had it on 6 October
    </a>
  </li>
</ul>
