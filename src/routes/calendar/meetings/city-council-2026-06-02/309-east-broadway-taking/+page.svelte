<script lang="ts">
  import AddressMap from "$lib/AddressMap.svelte"
  import { Router } from "$lib/router"

  const MEETING = "city-council-2026-06-02"
  const ITEM = "309-east-broadway-taking"
  const LOAN = "309-east-broadway-loan-order"
</script>

<p>5.4. Mayor Barrett submits the following Order to Authorize the Taking of 309 East Broadway</p>

<ul>
  <li>
    <strong>5.4.1.</strong> Order- That the City is hereby authorized to acquire, either by purchase or
    eminent domain, the parcel of land located at 309 East Broadway and containing approximately 7.4 acres
    being all as described in a deed granted to the Owner recorded in the Essex South Registry of Deeds
    in Book 12514, Page 522, meaning and intending to include all rights. Title and interest extending
    from the top of bank to the mean low water mark of the Merrimack River, for water supply purposes,
    from Joyce E. Hill, for the amount of $1,800,000.00
  </li>
</ul>

<p class="text-right"><strong><em>THIS REQUIRES A TWO- THIRDS MAJORITY VOTE</em></strong></p>

<AddressMap address="309 East Broadway, Haverhill, MA" lat={42.7768269} lon={-71.0271785} />

<h2>Minutes</h2>

<p>
  President Jordan stated could you pull up <a href={Router.meetingItem(MEETING, LOAN)}>16.3</a>. we
  will vote on these separately, but they are related items.
</p>

<p>Asst. City Clerk Leonard-Flynn read:</p>

<p>
  <strong
    >Mayor Barrett submits a Loan Order for $900,000.00 for the Acquisition of Property at 309 East
    Broadway<br />Order That the City is hereby authorized to acquire, either by purchase or eminent
    domain, the parcel of land located at 309 East Broadway identified as Assessor&rsquo;s Parcel ID
    469-188-6, for the purpose of providing a new water supply well for City&rsquo;s water supply,
    and to take any other action incidental and related thereto</strong
  >
</p>

<p class="text-right"><strong><em>Filed on May 20, 2026</em></strong></p>

<p>
  Mayor Barrett addressed the council. She noted this has been before you before. We are trying to
  acquire this critical piece of our water infrastructure.
</p>

<p>
  Robert Ward, DPW Director, addressed the council. He noted this authorizes the acquisition of 309
  East Broadway and secure the funding to purchase. He stated after earlier concerns about eminent
  domain taking, the city reached a an agreement with the property owner to acquire the 7.5 acres
  property for 1.8 million for public water supply project. The owner will not contest the taking,
  with the transfer to happen at the end of July.
</p>

<p>
  Rob Williamson of Wright Pierce addressed the council. He went over the PowerPoint presentation
  describing the well, how they came to find the site. Robert Ward reported that the latest
  estimated cost of the project is approximately $26 million, exceeding the original loan
  authorization approved in 2016. He explained that additional funding will eventually be required
  and noted that water supply fees collected from developers have helped finance portions of the
  project. Rob Williamson stated that significant permitting work has already been completed and
  that only limited permitting remains.
</p>

<p>
  Attorney Michael Leon, the City&rsquo;s outside counsel, provided an overview of the negotiated
  taking agreement for the 7.5-acre Hill property. He explained that the City will acquire the
  property through an Order of Taking for the appraised value of $1.8 million, plus moving expenses.
  Attorney Leon noted that the agreement eliminates future challenges to the taking or valuation,
  clears any title issues, and provides the City with full ownership and control of the property for
  water supply purposes. Recording the taking is expected at the end of July to allow additional
  time for the property owners to vacate the premises. Several Councilors discussed the future use
  of the approximately 2-acre portion of the property containing the residence. Councilor Sullivan
  expressed concerns regarding any future sale of the property and whether such action could raise
  concerns with the Massachusetts Department of Environmental Protection (DEP). Attorney Leon stated
  that while the City would have flexibility in the future, any disposal of the property would
  require additional municipal action and review. He emphasized that the acquisition is being made
  entirely for water supply and protection purposes. Councilor Basiliere and Attorney Leon discussed
  the legal framework surrounding eminent domain. Attorney Leon explained a &ldquo;friendly&rdquo;
  eminent domain acquisition that provides full compensation to the property owners while serving a
  public purpose. Councilor Basiliere emphasized that eminent domain protections are rooted in
  constitutional principles requiring public use and just compensation. Councilor Diodati asked how
  much time the City is saving by avoiding litigation. Attorney Leon stated that while a taking
  becomes effective upon recording, disputes over valuation can take one to three years to resolve
  through litigation. Because the negotiated agreement establishes a final valuation, no future
  legal challenges are anticipated. Councilor Diodati also expressed support for retaining the
  property for future municipal use. Councilor Lewandowski praised the negotiated settlement and
  highlighted the long-term value of securing an expanded water supply for future generations.
  Attorney Leon added that the project will strengthen the City&rsquo;s water resources and provide
  greater certainty for future economic development while utilizing groundwater drawn from beneath
  the Merrimack River rather than direct river withdrawals. Councilors McGonagle and LePage raised
  concerns regarding the acquisition of the house and surrounding acreage, as well as environmental
  responsibilities associated with underground oil tanks located on the property. Attorney Leon
  confirmed that the City is acquiring the property &ldquo;as is&rdquo; and will assume
  responsibility for any associated issues. He noted that future decisions regarding the
  property&rsquo;s use remain open. Councilor Toohey expressed strong support for the acquisition,
  stating that the City is addressing a significant long-term water supply challenge and praising
  both the negotiated approach and the efforts of those involved in the project. President Jordan
  stated that he was pleased the matter had been resolved and asked for clarification regarding
  project financing. Robert Ward confirmed that approximately $917,000 in existing Water Department
  capital funds will be used toward the purchase, with the remaining balance financed through
  bonding. The discussion concluded with general agreement that the acquisition represents an
  important investment in the City&rsquo;s future water supply infrastructure.
</p>

<p><strong>President Jordan this is for item: 5.4.1</strong></p>

<p>MOTION BY COUNCILOR SULLIVAN, SECOND BY COUNCILOR DIODATI</p>

<p>
  Asst. City Clerk Leonard-Flynn: Vice President Michitson-yes, Councilor Basiliere-yes, Councilor
  Diodati-yes, Councilor Sullivan-yes, Councilor Lewandowski-yes, Councilor Toohey-yes, Councilor
  McGonagle-yes, Councilor LePage-yes, Councilor Rogers-yes, President Jordan-yes
</p>

<p>PASSED YEAS 10, NAYS 0, ABSENT 1 (FERREIRA)</p>

<hr />

<ul>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/mayors-letter`)} target="_blank" rel="noopener">
      Letter from Mayor Melinda E. Barrett, May 29, 2026<span class="sr-only"
        >, PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/solicitors-memo`)} target="_blank" rel="noopener">
      Memo from Joseph Ruotolo, Jr. and Lisa Mead, City Solicitors, May 29, 2026<span
        class="sr-only">, PDF, one page, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/order`)} target="_blank" rel="noopener">
      Haverhill City Council, Order to Authorize the Taking of 309 East Broadway<span
        class="sr-only">, PDF, two pages, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/order-of-taking`)} target="_blank" rel="noopener">
      Order of Taking for Mayor&rsquo;s execution<span class="sr-only"
        >, PDF, four pages, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/dpw-memo`)} target="_blank" rel="noopener">
      Memo from Robert E. Ward, DPW Director, May 28, 2026<span class="sr-only"
        >, PDF, two pages, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/taking-agreement`)} target="_blank" rel="noopener">
      Taking Agreement between the City and the property owner<span class="sr-only"
        >, PDF, fifteen pages, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.excerpt(MEETING, `${ITEM}/location-map`)} target="_blank" rel="noopener">
      Location map showing 309 East Broadway<span class="sr-only"
        >, PDF, two pages, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a
      href={Router.pdfPage(
        "https://media-001-us.cdn.govstack.com/haverhillma-003-us/media/vuxlv1m5/full-agenda-6226.pdf",
        60,
      )}
      target="_blank"
      rel="external noopener noreferrer"
    >
      Real estate appraisal report, Petersen LaChance Regan Pino, LLC, May 7, 2025<span
        class="sr-only">, page 60 of the agenda, PDF, 96 pages, opens in a new tab</span
      >
    </a>
  </li>
  <li>
    <a href={Router.meeting("city-council-2026-02-10")}>City Council Minutes, February 10, 2026</a>
  </li>
  <li>
    <a href={Router.meeting("city-council-2026-03-10")}>City Council Minutes, March 10, 2026</a>
  </li>
</ul>
