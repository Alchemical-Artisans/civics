<script lang="ts">
  import Timeline from "$lib/Timeline.svelte"
  import { Router } from "$lib/router"
  import { CONCERNS, HEARING, type Passage } from "./record"

  const MEETING = "city-council-2026-10-27"
  const ITEM = "battery-energy-storage-systems-ordinance"
</script>

<!--
  What the Council is deciding on the left, and how the ordinance got here in a
  column beside it -- the same shape as the two special permits on this
  sitting's agenda. There is no single address to put on a map: the overlay
  district is a zone, so the rail carries the record alone.

  `lg` and up only, 5fr to 2fr, for the reason the pairs give on 27 Marshland
  Street. Stacked, the order is the petition, the hearing, then the pairs.
-->
<div class="grid gap-x-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,2fr)]">
  <div>
    <p>
      <strong>Doc 21-B</strong> - Planning Director, Jacki Byerley, requests a hearing for the following
      Zoning Amendment &ndash; Battery Energy Storage Systems Ordinance: re: Amend Chapter 255 Zoning
      Ordinance and Zoning Map &ndash; Battery Energy Storage Systems Overlay District (BESS)&ndash; by
      inserting a new section 7.9 Battery Energy Storage Systems, amending section 3.1.3 Table of Use
      and Parking regulations by allowing a Tier 1, Tier 2 and Tier 3 BESS and amending the Zoning Map
      to include the BESS Overlay District. The overlay district will be creating regulations for the
      installation and use of free-standing battery energy storage systems (&ldquo;BESS&rdquo;), adding
      to the table the overlay district with the allowed Tiers and updating the zoning map to include
      the BESS Overlay District, or take any other action related to
    </p>

    <p>
      The Hilldale Avenue location the Planning and Development Committee recommended for this
      overlay district is before the Council tonight as
      <a
        href={Router.meetingItem(MEETING, "battery-energy-storage-systems-ordinance-hilldale-ave")}
      >
        Doc. 41-B</a
      >.
    </p>

    <hr />

    <!--
      What the neighbours asked the ordinance to do, beside what the ordinance
      itself says on the same point. The letters are linked at the foot, and
      `record.ts` says where each line comes from and where the ordinance is
      silent.
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
      <h2 id="concerns" class="sr-only">
        Concerns raised in correspondence, and the answers to them
      </h2>

      <div
        class="mt-4 hidden gap-x-8 border-b border-slate-200 pb-2 text-xs font-semibold tracking-wide text-slate-500 uppercase md:grid md:grid-cols-2"
      >
        <h3>Concerns raised</h3>
        <h3>The answer</h3>
      </div>

      {#each CONCERNS as concern (concern.subject)}
        <div class="border-b border-slate-200 py-4">
          <h3 class="mb-3 font-semibold text-slate-900">{concern.subject}</h3>
          <div class="grid gap-x-8 gap-y-4 text-sm md:grid-cols-2">
            <div>
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
              {#if concern.note}
                <p class="text-slate-600 italic">{concern.note}</p>
              {/if}
            </div>
          </div>
        </div>
      {/each}
    </section>
  </div>

  <!--
    The record of the ordinance, off the back of Document # 21-B, with the
    Planning Board's public hearing between the Council sittings it went
    between.
  -->
  <div>
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
      Document # 21-B, with the record of continuances<span class="sr-only">
        , PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/solicitors-letter`)} target="_blank" rel="noopener">
      Letter from Atty. Lisa Mead, City Solicitor, March 16, 2026, transmitting a revised BESS
      Zoning Ordinance<span class="sr-only">, PDF, one page, opens in a new tab</span>
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/proposed-ordinance`)} target="_blank" rel="noopener">
      Proposed ordinance, &sect;7.9 Battery Energy Storage Systems<span class="sr-only">
        , PDF, fourteen pages, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/walsh-opposition`)} target="_blank" rel="noopener">
      Email from Joe Walsh, 26 Dawn Circle, opposing expansion of the BESS overlay into the Hilldale
      Avenue corridor, August 26, 2026<span class="sr-only">
        , PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/carr-communication`)} target="_blank" rel="noopener">
      Email from Pamela J Carr, 60 Atlanta Street, opposing a battery farm on upper Hilldale Avenue,
      September 14, 2026<span class="sr-only">, PDF, three pages, opens in a new tab</span>
    </a>
  </li>
  <li>
    <a
      href={Router.excerpt(MEETING, `${ITEM}/desjardins-communication`)}
      target="_blank"
      rel="noopener"
    >
      Email from Diane Desjardins, 28 Country Meadow Road, opposing the overlay expansion, September
      14, 2026<span class="sr-only">, PDF, three pages, opens in a new tab</span>
    </a>
  </li>
  <li>
    <a
      href={Router.excerpt(MEETING, `${ITEM}/walsh-amendment-request`)}
      target="_blank"
      rel="noopener"
    >
      Email from Joe Walsh, 26 Dawn Circle, requesting noise protections be added to the ordinance,
      September 14, 2026<span class="sr-only">, PDF, one page, opens in a new tab</span>
    </a>
  </li>
  <li>
    <a href={Router.meetingItem("city-council-2026-09-15", ITEM)}>
      The rest of the record, as the Council had it on 15 September
    </a>
  </li>
</ul>
