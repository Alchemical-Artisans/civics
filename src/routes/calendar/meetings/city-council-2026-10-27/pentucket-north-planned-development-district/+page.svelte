<script lang="ts">
  import AddressMap from "$lib/AddressMap.svelte"
  import Timeline from "$lib/Timeline.svelte"
  import { Router } from "$lib/router"
  import { CONCERNS, HEARING, type Passage } from "./record"

  const MEETING = "city-council-2026-10-27"
  const ITEM = "pentucket-north-planned-development-district"
</script>

<!--
  What the Council is deciding on the left, where the thing is and how the
  petition got here in a column beside it -- the same shape as 27 Marshland
  Street, and for the same reason: the pairs are the reading, the map and the
  record are its setting.

  `lg` and up only, 5fr to 2fr, for the same reason as Marshland's page: the
  pairs want the width. Stacked, the order is the sentence, the place, the
  record, then the pairs and the ordinance.
-->
<div class="grid gap-x-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,2fr)]">
  <div>
    <p>
      <strong>Doc. 21-G- PDD-26-1;</strong> Attorney Russell Channen for client
      <em>Pentucket North Development, LLC</em> requests to amend Chapter 255 Zoning Ordinance and Zoning
      Map by creating a Special Permit Planned Development District in accordance with Section 8.5 of
      the Zoning Ordinance. Applicant, Pentucket North Development, LLC is requesting a special permit
      of a planned residential development on a portion of land owned by Cedardale, Inc, located off of
      Boston Road known as 931 Boston Road (Map 754 Block 2 Lot 21) to construct six duplex units and
      two single family units. The property is currently zoned Commercial Highway (CH)
    </p>

    <hr />

    <!--
      What the neighbours and the city asked for, beside what the applicant and
      the Planning Board answered -- the question in front of the Council
      tonight. The letters are linked at the foot, and `record.ts` says where
      each line comes from and where nothing in the packet answers one.
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
      <!-- `sr-only`: the two column heads below say what this is, and a heading
           over them saying it a third way was the same words again. -->
      <h2 id="concerns" class="sr-only">Concerns raised in review, and the answers to them</h2>

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

    <hr />

    <h2>Order</h2>

    <p>ORDERED:</p>

    <p>
      TO AMEND THE CITY OF HAVERHILL ZONING ORDINANCE CHAPTER 255 BY ADDING THE FOLLOWING: &ldquo;I
      STREET PLANNED RESIDENTIAL DEVELOPMENT DISTRTCT, (ISPRD)&rdquo; AS SET FORTH IN SECTION 8.5.C:
    </p>

    <p>
      <strong>Item 1.</strong> In Section 2.1.2, add "I Street Planned Residential Development
      District" to the list.<br />
      <strong>Item 2.</strong> Add the following new Section 8.5.C
    </p>

    <h3>8.5C I STREET PLANNED RESIDENTIAL DEVELOPMENT DISTRICT (ISPRD)</h3>

    <p>
      <strong>8.5.C.1 Purpose.</strong> The purpose of the I Street Planned Residential Development District
      ("ISPRD") is as follows:
    </p>

    <ol>
      <li>To promote a diversity of housing in the City; and</li>
      <li>To promote the reuse of vacant land transforming the same into 14 condominium units.</li>
    </ol>

    <p>
      <strong>8.5.C. 2 Location.</strong> The ISPRD is a portion of land located on Tax Parcel Map 754,
      Block 2, Lot21, containing approximately 55,820 square feet of land.
    </p>

    <p>
      <strong>8.5.C.3 As of Right Uses.</strong> The following uses are allowed in the ISPRD upon the
      issuance of Development Review approval pursuant to Section 10.1.4:
    </p>

    <ol>
      <li>Six (6) duplex and Two (2) single family Condominium units.</li>
    </ol>

    <p>
      <strong>8.5.C.4 Dimensional and Density Regulations.</strong> The following dimensional and density
      regulations shall apply in the ISPRD:
    </p>

    <table>
      <thead>
        <tr>
          <th scope="col">Set Back</th>
          <th scope="col">Proposed PD Lot</th>
        </tr>
      </thead>
      <tbody>
        <tr><th scope="row">Lot Area</th><td>55,820&rsquo;</td></tr>
        <tr><th scope="row">Lot Area Required Per Dwelling Unit</th><td>3,972&rsquo;</td></tr>
        <tr><th scope="row">Lot Frontage</th><td>207.36&rsquo;</td></tr>
        <tr><th scope="row">Lot Depth</th><td>291&rsquo;</td></tr>
        <tr><th scope="row">Front Setback</th><td>40&rsquo;</td></tr>
        <tr><th scope="row">Side Setback</th><td>15&rsquo;</td></tr>
        <tr><th scope="row">Rear Setback</th><td>15&rsquo;</td></tr>
        <tr><th scope="row">Building Height</th><td>&lt;40&rsquo;</td></tr>
        <tr><th scope="row">Building Height &ndash; Stores</th><td>&lt;3.5&rsquo;</td></tr>
        <tr><th scope="row">Building Coverage</th><td>18.1%</td></tr>
        <tr><th scope="row">Floor Area Ratio</th><td>&lt;0.50&rsquo;</td></tr>
        <tr><th scope="row">Open Space</th><td>51%</td></tr>
      </tbody>
    </table>

    <p>
      <strong>8.5C.5 Parking and Loading.</strong> The following parking requirements shall apply in the
      BRPRD. Both surface and underground parking areas are permissible.
    </p>

    <ol>
      <li>
        <strong>Multifamily Dwellings:</strong> 3.0 spaces per dwelling unit; 1 garage and 2 outdoor surface
        spaces.
      </li>
    </ol>

    <p>
      Parking and loading shall generally comply with the standards set forth in Section 6.1 of this
      Ordinance, unless waived by the City during Development Review.
    </p>

    <p>
      <strong>8.5.C.6 Roads and Utilities.</strong> The principal roadway(s) and driveways serving the
      site shall be adequate for the intended use and vehicular traffic and shall be maintained privately.
      The connection of all buildings in the ISPRD to the municipal water and sewer systems is required.
      All water, sewer, gas, electricity, cable, and telephone lines shall be installed underground.
    </p>

    <p>
      <strong>8.5.C.7 Performance Standards.</strong> All development in the ISPRD shall comply with the
      performance standards set forth in the Zoning Code, unless waived during developmental review.
    </p>
  </div>

  <!--
    The place and the record. The map is above the timeline for the same reason
    as Marshland's page: where is asked before when, and both are the setting
    rather than the substance.

    The timeline is the petition's own record, off the back of Document # 21-G,
    with the Planning Board's recommendation between the two Council sittings
    it was continued from.
  -->
  <div>
    <AddressMap address="931 Boston Road, Haverhill, MA" lat={42.7523473} lon={-71.1043102} />

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
      Document # 21-G, with the record of continuances<span class="sr-only">
        , PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a
      href={Router.excerpt(MEETING, `${ITEM}/planning-directors-letter`)}
      target="_blank"
      rel="noopener"
    >
      Letter from Jacki Byerley, AICP, Planning Director, October 15, 2026, reporting the Planning
      Board&rsquo;s recommendation of October 14, 2026<span class="sr-only">
        , PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/proposed-ordinance`)} target="_blank" rel="noopener">
      Order amending Chapter 255 by adding Section 8.5.C, the I Street Planned Residential
      Development District<span class="sr-only">, PDF, two pages, opens in a new tab</span>
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/application`)} target="_blank" rel="noopener">
      Planned Development District application, PDD-26-1<span class="sr-only">
        , PDF, three pages, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a
      href={Router.excerpt(MEETING, `${ITEM}/applicants-narrative`)}
      target="_blank"
      rel="noopener"
    >
      Letter from Russell S. Channen, Phillips, Gerstein &amp; Channen, LLP, April 28, 2026, the
      applicant&rsquo;s narrative on the special permit<span class="sr-only">
        , PDF, two pages, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/hearing-notice`)} target="_blank" rel="noopener">
      Confirmation of the hearing notice placed with the Haverhill Gazette, and the notice as
      published<span class="sr-only">, PDF, two pages, opens in a new tab</span>
    </a>
  </li>
  <li>
    <a
      href={Router.excerpt(MEETING, `${ITEM}/mahoney-communication`)}
      target="_blank"
      rel="noopener"
    >
      Email from Christine Mahoney, 59 I Street Resident &amp; Homeowner, opposing the proposed
      development, October 21, 2026<span class="sr-only">
        , PDF, two pages, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/neals-communication`)} target="_blank" rel="noopener">
      Email from Patti Neals, Executor of 37 I Street, opposing the proposed development, October
      22, 2026<span class="sr-only">, PDF, two pages, opens in a new tab</span>
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/impact-statement`)} target="_blank" rel="noopener">
      Impact Statement from Russell S. Channen for Pentucket North Builders, LLC, October 22, 2026<span
        class="sr-only"
      >
        , PDF, three pages, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.meetingItem("city-council-2026-08-25", ITEM)}>
      The rest of the record, as the Council had it on 25 August
    </a>
  </li>
</ul>
