<script lang="ts">
  import AddressMap from "$lib/AddressMap.svelte"
  import PermitRecord from "$lib/PermitRecord.svelte"
  import { Router } from "$lib/router"

  const MEETING = "city-council-2025-12-09"
  const ITEM = "233-winter-st-special-permit"

  /** Every document cut out of the packet for this item, in the packet's order. */
  const DOCUMENTS: { slug: string; title: string; pages: string }[] = [
    {
      slug: "cover-sheet",
      title: "Document # 91, continued to December 9, 2025, in City Council October 7, 2025",
      pages: "one page",
    },
    { slug: "application", title: "Application, CCSP-25-7", pages: "3 pages" },
    {
      slug: "department-reviews-july-2025",
      title: "Department reviews, July 2025: Health, Police, Building Inspector, Fire",
      pages: "4 pages",
    },
    {
      slug: "attorney-letter",
      title:
        "Letter from Paul A. Magliocchetti, Sheehan, Schiavoni, Jutras & Magliocchetti, LLP, June 4, 2025",
      pages: "3 pages",
    },
    { slug: "quitclaim-deed", title: "Quitclaim Deed", pages: "3 pages" },
    {
      slug: "special-permit-criteria",
      title:
        "Special Permit Application-233 Winter Street, Haverhill, MA: City Council Rules and Regulations for Special Permits Information Required",
      pages: "5 pages",
    },
    { slug: "plans", title: "Site plans and building plans", pages: "40 pages" },
    {
      slug: "department-reviews-october-2025",
      title: "Department reviews, October 2025",
      pages: "12 pages",
    },
    {
      slug: "traffic-memo",
      title: "TEPP LLC memorandum, Potential Pedestrian Crossing, October 1, 2025",
      pages: "3 pages",
    },
    {
      slug: "planning-director-memo",
      title:
        "Memo from William Pillsbury, Economic Development and Planning Director, September 30, 2025",
      pages: "one page",
    },
    { slug: "hearing-notice", title: "Notice of Public Hearing, July 31, 2025", pages: "one page" },
    {
      slug: "presentation",
      title: "233 Winter Street Mixed-Use Development, presentation",
      pages: "14 pages",
    },
  ]
</script>

<p>
  <u>Document 91 - <PermitRecord number="CCSP 25-7" /></u>; Attorney Paul Magliocchetti for client
  <em>233 Winter Street LLC</em> requests to construct a Mixed-Use Store and a 10-Unit Multifamily Dwelling
  at 233 Winter st; Map 306, Block 75, Lots 3
</p>

<p><em>Continued from October 7, 2025</em></p>

<AddressMap address="233 Winter St, Haverhill, MA" lat={42.77803} lon={-71.0858837} />

<h2>Minutes</h2>

<p><strong>President Sullivan re-opened the hearing.</strong></p>

<p>
  Attorney Paul Magliocchetti addressed the council on behalf of 233 Winter Street, LLC, principals
  Juan Cepeda and family, regarding a proposed mixed-use project consisting of a Latino grocery
  store with 10 residential units above. He explained the project history, including initial
  approval for a single-story grocery store, subsequent underground construction issues, financing
  challenges, and unpermitted work that was promptly removed at the owner&rsquo;s expense after
  notification by building inspectors. Attorney Magliocchetti emphasized that the applicant is a
  small business owner, not a professional developer, and argued the project meets special permit
  criteria, addresses housing needs, comply with affordability requirements, and will have a
  positive fiscal impact. Mr. Cepeda apologized for prior construction issues and described his
  background and financial investment in the project. A consultant and design team presented
  architectural elevations, site plans, parking arrangements, and compliance with city requirements.
  One outstanding issue noted was a police department concern regarding a potential pedestrian
  island at the crosswalk, which engineers advised against. The applicant requested council
  approval, noting prior pre-planning reviews and overall community benefits.
</p>

<p>
  Council members questioned the proposed 233 Winter Street mixed-use project primarily on traffic,
  parking, unit size, and financing concerns. Councilor Toohey expressed concern for the project as
  designed, citing heavy Winter Street traffic, pedestrian safety, limited parking, and very small
  two-bedroom units, and expressed concern about project scope and the applicant&rsquo;s
  inexperience. Vice President Jordan raised similar concerns about unit sizes, projected rents,
  traffic impacts, and challenged the fiscal analysis but Ms. Barrett earlier showing a positive
  revenue impact. Councilors Michitson and McGonagle suggested reducing the residential units from
  10 to 8 and emphasized unresolved traffic, parking, crosswalk safety, and delivery access issues.
  In contrast, Councilor Ferreira strongly supported the project, citing housing need, transit
  access, walkability, mixed-use goals, and fairness to the applicant. The applicant team defended
  the design, financing, traffic study, and parking plan, agreed to work with the city and police on
  pedestrian safety measures, and warned that reducing units would significantly affect project
  feasibility. Councilors continued deliberation on the 233 Winter Street project, largely
  expressing support for redeveloping a blighted site with mixed-use development while emphasizing
  pedestrian safety, traffic mitigation, and unit configuration. Several members, including
  Councilors Lewandowski and Basiliere, supported the project concept but conditioned approval on
  enhanced pedestrian safety measures&mdash;specifically a rapid flashing beacon and a pedestrian
  refuge island or equivalent safety solution as determined by police and engineering&mdash;and
  raised concerns about the number and size of residential units. After extensive discussion, the
  applicant proposed a compromise maintaining 10 units but reconfiguring them from eight two-bedroom
  and two one-bedroom units to six two-bedroom and four one-bedroom units to address size concerns.
  Multiple councilors voiced support for this compromise, highlighted the city&rsquo;s housing
  needs, affordability challenges for young adults and families, and the value of a locally owned
  grocery store, while also agreeing that traffic and safety conditions should be addressed through
  enforceable conditions. Additional discussion noted affordability compliance, with consensus that
  the statutory affordable housing requirement would be met either through an affordable unit or a
  contribution, subject to legal permissibility.
</p>

<p>
  <strong>President Sullivan asked if anyone would like to speak in favor.</strong> Steve Pascoe of
  Danville NH addressed the council. He stated that based on over 20 years of experience, smaller
  two-bedroom units rent best and the proposed unit sizes are appropriate. He noted that reducing
  units affects cash flow but felt the developer&rsquo;s willingness to proceed despite costs
  reflects positively on his commitment to the project and community.<br />
  <strong>President Sullivan asked if anyone would like to speak in opposition. No one spoke</strong
  ><br />
  <strong>President Sullivan closed the hearing.</strong>
</p>

<p>President Sullivan stated Madam Clerk can you read the first condition.</p>

<p>
  Madam Clerk stated that a pedestrian island be a condition or a safety equivalent that was a
  motion by Councilor Lewandowski and a second by McGonagle
</p>

<p>
  City Clerk Wright: Vice President Jordan-yes, Councilor Basiliere-yes, Councilor Hobbs
  Everett-yes, Councilor Michitson-yes, Councilor Ferreira-yes, Councilor Lewandowski-yes, Councilor
  Toohey-yes, Councilor McGonagle-yes, Councilor LePage-yes, President Sullivan-yes. YEAS 10, NAYS
  0, ABSENT 1 (Rogers)
</p>

<p><strong>President Sullivan stated that passes.</strong></p>

<p>President Sullivan stated next condition.</p>

<p>
  City Clerk Wright stated I had a couple of other items discussed and I do not know if they were
  conditions from Councilor Lewandowski about the flashing beacon. But you already agreed to that.
</p>

<p>
  Attorney Magliocchetti stated it is already on the plan.<br />
  City Clerk Wright stated there was another crosswalk condition about the lighting, but I didn&rsquo;t
  get further than lighting.<br />
  Attorney Magliochetti stated everything is all set with the crosswalk except for the island.<br />
  City Clerk Wright stated there was a discussion about private trash and storage and a removal plan for
  that.<br />
  Attorney Magliocchetti stated I believe one has already been done.<br />
  Juan Cepada stated for my business the company can come 2-3 times during the week.<br />
  President Sullivan stated you already have that in place.<br />
  Juan Cepada stated yes.<br />
  Attorney Magliocchetti stated I believe that would be a requirement for an occupancy permit.<br />
  City Clerk Wright stated it was also discussed about a snow removal plan.<br />
  Attorney Magliocchetti stated that has already been done. It is going to be taken off site.<br />
  City Clerk Wright stated the other is a reduction in units, but I don&rsquo;t know if Councilor Michitson
  pulled that or not.<br />
  Councilor Michitson stated I did.<br />
  Attorney Magliocchetti stated we reconfigured that was the motion.<br />
  Councilor Michitson stated the 6 and 4.<br />
  Attorney Magliocchetti stated instead of 8 and 2.<br />
  City Clerk Wright stated so you are keeping the motion for that.<br />
  President Sullivan stated for the 6 and 4.<br />
  Councilor Michitson stated yes.<br />
  City Clerk Wright stated 6 (2) bedrooms 4 (1) bedrooms units.<br />
  Attorney Magliocchetti stated correct.
</p>

<p>
  City Clerk Wright stated so then I had a motion from Councilor Michitson on that with a second
  from Councilor Basiliere.
</p>

<p>President Sullivan stated Madam Clerk please call the roll.</p>

<p>
  City Clerk Wright: Vice President Jordan-yes, Councilor Basiliere-yes, Councilor Hobbs
  Everett-yes, Councilor Michitson-yes, Councilor Ferreira-yes, Councilor Lewandowski-yes, Councilor
  Toohey-no, Councilor McGonagle-yes, Councilor LePage-yes, President Sullivan-yes. YEAS 9, NAYS 1,
  (Toohey), ABSENT 1 (Rogers)
</p>

<p><strong>President Sullivan stated that passes.</strong></p>

<p>President Sullivan stated were there any other conditions.</p>

<p>City Clerk Wright stated not that I had written down.</p>

<p>Vice President Jordan stated the affordable.</p>

<p>
  City Clerk Wright stated I am sorry, the affordable. Which is if allowed, which we confirmed is
  allowed require that one unit be affordable rather than having it go to the housing trust. There
  was a motion by Vice President Jordan. There was not a second.
</p>

<p>Councilor Michitson stated second.</p>

<p>
  City Clerk Wright: Vice President Jordan-yes, Councilor Basiliere-yes, Councilor Hobbs
  Everett-yes, Councilor Michitson-yes, Councilor Ferreira-yes, Councilor Lewandowski-yes, Councilor
  Toohey-yes, Councilor McGonagle-yes, Councilor LePage-yes, President Sullivan-yes. YEAS 10, NAYS
  0, ABSENT 1 (Rogers)
</p>

<p><strong>President Sullivan stated that passes.</strong></p>

<p>President Sullivan stated we need a vote on the main question.</p>

<p>
  City Clerk Wright stated I had a motion by Councilor McGonagle and a second by Vice President
  Jordan and that includes all department conditions.
</p>

<p>President Sullivan stated Madam Clerk please call the roll.</p>

<p>
  City Clerk Wright: Vice President Jordan-yes, Councilor Basiliere-yes, Councilor Hobbs
  Everett-yes, Councilor Michitson-yes, Councilor Ferreira-yes, Councilor Lewandowski-yes, Councilor
  Toohey-yes, Councilor McGonagle-yes, Councilor LePage-yes, President Sullivan-yes. YEAS 10, NAYS
  0, ABSENT 1 (Rogers)
</p>

<p><strong>President Sullivan stated that passes.</strong></p>

<hr />

<!-- The hearing was opened on 7 October 2025 and continued to this sitting at
     the applicant's agreement, which the cover sheet records; that sitting
     has no write-up here, so the link is to the sitting itself. -->
<ul>
  {#each DOCUMENTS as doc (doc.slug)}
    <li>
      <a href={Router.excerpt(MEETING, `${ITEM}/${doc.slug}`)} target="_blank" rel="noopener">
        {doc.title}<span class="sr-only">, PDF, {doc.pages}, opens in a new tab</span>
      </a>
    </li>
  {/each}
  <li>
    <a href={Router.meeting("city-council-2025-10-07")}>
      City Council Minutes, Tuesday, October 7, 2025
    </a>
  </li>
</ul>
