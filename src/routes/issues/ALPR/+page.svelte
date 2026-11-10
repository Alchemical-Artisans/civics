<script lang="ts">
  import ShareButton from "$lib/ShareButton.svelte"
  import ShareMeta from "$lib/ShareMeta.svelte"
  import { formatLongDate } from "$lib/calendar"
  import { Router } from "$lib/router"

  let { data } = $props()

  // Placeholders until the page is written. The title is the one
  // `<svelte:head>` sets below, so a share card and a tab name the page alike.
  const TITLE = "License Plate Readers in Haverhill"
  const sharedUrl = Router.alpr()
  const description = ""

  // The packet handed out at the Council's sitting of 11 August 2026, which
  // carries the department's own ALPR policy (41.3.9) and its Flock handout.
  const PACKET = Router.reference("PublicSafetyLPR/ProposedOrdinanceFromHaverhillLawyers.pdf")
  const RING_4 = Router.reference("PublicSafetyLPR/Ring_4of6.pdf")
  const FLOCK = Router.reference("PublicSafetyLPR/FlockContractwithHaverhill.pdf")
  const CRS_REPORT = Router.reference("PublicSafetyLPR/R48160.3.pdf")
  const HHS_CAMERAS = Router.reference(
    "PublicSafetyLPR/Haverhill_High_School_Exterior_Camera_Replacement_Proposal_PM05548713P_3-30-23.pdf",
  )
  const SCHOOL_INVOICE_2023 = Router.reference("PublicSafetyLPR/Invoice_W1627800_1.pdf")
  const SCHOOL_INVOICE_2024 = Router.reference(
    "PublicSafetyLPR/Invc_IN00142325_-_Dr._Paul_Nettle_School.pdf",
  )
  // The ACLU's own file, byte for byte (checked against assets.aclu.org).
  const MODEL_BILL = Router.reference(
    "PublicSafetyLPR/Local-Automatic-License-Plate-Reader-Guardrails-Model-Bill-1126.pdf",
  )

  // The two bills side by side, in plain language. Each summary is read
  // off the section it cites; "No section on this" means none was found on
  // reading the whole bill. Page numbers are the PDF's own: the packet's
  // for the city draft, the ACLU file's for the model bill.
  const COMPARISON = [
    {
      topic: "What counts as a license plate reader",
      city: "Any system that automatically reads plates or other vehicle information, whether fixed, mobile, or portable, along with its software and databases.",
      citySection: "§ XXX-2(A), packet page 9",
      cityPage: 9,
      aclu: "Any system or software that turns images of plates into computer-readable data. Cameras that only switch on for a specific violation, like speeding or running a red light, are not included.",
      acluSection: "Section 1(A), page 1",
      acluPage: 1,
      pick: "City draft",
      why: "It covers more systems: it includes other information about a vehicle, not just the plate, so a system that identifies cars by make, color, or features is still covered.",
    },
    {
      topic: "What it can be used for",
      city: "Purposes listed in a police use policy the City Council approves, including investigating crimes, stolen vehicles, missing persons, hit-and-runs, and other law-enforcement or public-safety purposes named in that policy.",
      citySection: "§ XXX-7(B), packet pages 13 to 14",
      cityPage: 13,
      aclu: "Only checking plates against specific lists (stolen, unregistered or uninsured, uninspected, an outstanding felony warrant, a missing person, or a felony), plus parking enforcement, access to secured areas, and toll collection.",
      acluSection: "Section 2(B), pages 1 to 2",
      acluPage: 1,
      pick: "ACLU model bill",
      why: "It is a closed list. The city draft allows any purpose named in a police use policy, which can be widened later without changing the ordinance.",
    },
    {
      topic: "What is not allowed",
      city: "Personal, political, retaliatory, discriminatory, or commercial use; harassment; tracking someone for lawful protected activity; generalized surveillance without an authorized purpose; and selling the data.",
      citySection: "§ XXX-7(C), packet page 14",
      cityPage: 14,
      aclu: "Any use not on the allowed list, and enforcement aimed at a group based on race, ethnicity, or income.",
      acluSection: "Section 2(A) and (C), pages 1 to 2",
      acluPage: 1,
      pick: "ACLU model bill, plus the city's list",
      why: "The ACLU bill bans every use that is not on its allowed list. Keeping the city's named bans as well makes the most common misuses explicit.",
    },
    {
      topic: "Who approves the system",
      city: "The City Council must approve buying or expanding a system, and any new data-sharing agreement, after a public impact report is posted 14 days before the vote.",
      citySection: "§ XXX-4 to XXX-6, packet pages 10 to 13",
      cityPage: 10,
      aclu: "No section on this. The bill sets the rules directly instead.",
      acluSection: "",
      acluPage: 0,
      pick: "City draft, with more public oversight",
      why: "The City Council did vote on Flock in April 2025, but only to allow a contract longer than three years. That vote set no rules on how the cameras could be used and required no public report (Flock contract, page 72). The public discussion came in August 2026, more than four years after the first Flock order (Flock contract, pages 20 to 22). The draft's Council vote and 14-day public notice are a start. A public hearing before any approval, a public list of camera locations, and a yearly report posted where residents can read it would give residents a say before a system is in use, not after.",
    },
    {
      topic: "How long data is kept",
      city: 'No fixed limit. Data is kept "no longer than reasonably necessary", with the actual period set in the police use policy.',
      citySection: "§ XXX-10, packet page 16",
      cityPage: 16,
      aclu: "Deleted after 48 hours, unless it is needed as evidence of a listed offense, for tolls, at another agency's sworn request for an active case, or under a warrant.",
      acluSection: "Section 3(A), pages 2 to 3",
      acluPage: 2,
      pick: "ACLU model bill",
      why: "48 hours is a fixed, short limit. The city draft sets no number, and the current police policy keeps data for 30 days (Policy 41.3.9, page 8).",
    },
    {
      topic: "Sharing with other agencies",
      city: "No automatic or bulk access. Data can be shared when the law, a court order, or the police use policy allows it. Joining a regional or national sharing network needs City Council approval.",
      citySection: "§ XXX-11, packet pages 16 to 17",
      cityPage: 16,
      aclu: "Only specific data (one camera or area, up to 48 hours) to a Massachusetts agency or one within 25 miles that agrees not to pass it on, or to anyone with a probable cause warrant.",
      acluSection: "Section 5 and Section 1(E), pages 1 and 4",
      acluPage: 4,
      pick: "ACLU model bill",
      why: "It allows only specific data, to nearby or in-state agencies that agree not to pass it on, or with a warrant. The city draft allows sharing under a police use policy.",
    },
    {
      topic: "Private cameras, like businesses or homes",
      city: "Not covered, unless the system or its data is given to the city, run for the city, or used under an agreement with the city.",
      citySection: "§ XXX-3(D), packet page 10",
      cityPage: 10,
      aclu: "Police need a warrant to demand access to private cameras, and can only accept data offered freely about a crime against that business or property. Businesses must post signs near their cameras.",
      acluSection: "Section 4, pages 3 to 4",
      acluPage: 3,
      pick: "ACLU model bill",
      why: "It requires a warrant before police can demand footage from private cameras, such as doorbell cameras. The city draft does not cover them.",
      note: "Sharing footage with police: at its September 3, 2026 meeting, before voting on a license, the License Commission asked the applicant about installing cameras and whether they planned to work with the police (Haverhill Community TV recording, from 13:25). The current police policy and the city draft set no limits on police asking for private footage; the city draft would apply only to the footage once the city has it. The ACLU model would require a warrant to demand it, and would let police accept footage offered freely only about a crime on that business's property, against its customers, or against its employees.",
    },
    {
      topic: "Immigration enforcement",
      city: "Use for federal civil immigration enforcement is banned, except as Massachusetts law (M.G.L. c. 147, § 64) allows.",
      citySection: "§ XXX-7(C)(6) and (E), XXX-8(E), XXX-9(E), packet pages 14 to 16",
      cityPage: 14,
      aclu: "No separate section. The limits on use and sharing apply to every agency.",
      acluSection: "",
      acluPage: 0,
      pick: "City draft",
      why: "It is the only one with explicit protections tied to Massachusetts law (M.G.L. c. 147, \u00a7 64).",
    },
    {
      topic: "Data security",
      city: '"Reasonable" safeguards, individual logins, and required training.',
      citySection: "§ XXX-13, packet page 18",
      cityPage: 18,
      aclu: "End-to-end encryption while data is stored and sent.",
      acluSection: "Section 3(C), page 3",
      acluPage: 3,
      pick: "ACLU model bill",
      why: 'End-to-end encryption is a specific standard that can be checked. "Reasonable" safeguards cannot.',
    },
    {
      topic: "Audits and public reporting",
      city: "Audited at least once a year, and a yearly report to the Mayor and City Council by March 1, including the number and general locations of cameras, searches, sharing, and costs.",
      citySection: "§ XXX-14, packet pages 18 to 19",
      cityPage: 18,
      aclu: "No section on this.",
      acluSection: "",
      acluPage: 0,
      pick: "City draft",
      why: "It is the only one that requires audits and a yearly report. Making the report public, and the audits independent of the Police Department, would make it stronger.",
    },
    {
      topic: "Emergencies",
      city: "The Police Chief can use a system without Council approval in an emergency, and must report to the Mayor and Council within 90 days.",
      citySection: "§ XXX-15, packet pages 19 to 20",
      cityPage: 19,
      aclu: "No section on this.",
      acluSection: "",
      acluPage: 0,
      pick: "City draft",
      why: "If emergency use is allowed at all, the city draft's limits apply: no monitoring of protest or religious activity, and a written report within 90 days.",
    },
    {
      topic: "Systems already in use",
      city: "An inventory within 180 days, and existing systems brought into line within 180 days unless the Council extends it.",
      citySection: "§ XXX-16, packet page 20",
      cityPage: 20,
      aclu: "Existing contracts that do not follow the bill must be amended or ended.",
      acluSection: "Section 2(D), page 2",
      acluPage: 2,
      pick: "ACLU model bill",
      why: "Contracts that do not follow the rules must be changed or ended. The city draft allows 180 days, which the Council can extend.",
    },
    {
      topic: "Evidence collected against the rules",
      city: "The ordinance creates no rule about evidence in court.",
      citySection: "§ XXX-17(F), packet page 21",
      cityPage: 21,
      aclu: "Data collected or shared in violation cannot be used as evidence, except to help a defendant.",
      acluSection: "Section 6, pages 4 to 5",
      acluPage: 4,
      pick: "ACLU model bill",
      why: "Evidence collected in violation cannot be used, which gives the rules consequences in court.",
    },
    {
      topic: "If the rules are broken",
      city: "Discipline for city staff and contract remedies for vendors. The draft states it gives residents no right to sue.",
      citySection: "§ XXX-18(D) to (F), packet page 21",
      cityPage: 21,
      aclu: "A person harmed can sue for actual damages or $1,000, plus lawyer's fees.",
      acluSection: "Section 7, page 5",
      acluPage: 5,
      pick: "ACLU model bill",
      why: "Residents can sue, so enforcement does not depend only on the city disciplining its own staff or its vendors. That matters for a system residents cannot opt out of: anyone who drives past a camera is recorded.",
    },
  ]
</script>

<ShareMeta url={sharedUrl} title={TITLE} {description} />

<svelte:head>
  <title>{TITLE}</title>
</svelte:head>

<h1>License Plate Readers in Haverhill</h1>

<!-- The day this build ran, in the city, from the layout's server load. -->
<p class="m-0 mt-1 flex flex-wrap items-baseline gap-x-2 text-sm text-slate-600">
  <span class="font-semibold text-slate-700">Published</span>
  <span>{formatLongDate(data.today)}</span>
</p>

<div class="mt-2">
  <ShareButton url={sharedUrl} text={TITLE} />
</div>

<h2>What ALPR Is and How It Works</h2>

<!-- The department's own definition, quoted exactly, with its source. -->
<blockquote>
  <p>
    "Automated License Plate Recognition (ALPR) System: A system consisting of cameras, software,
    databases, and related equipment designed to capture, read, compare, and store digital images
    and associated data from vehicle license plates."
  </p>
  <footer>
    Haverhill Police Department, <a href="{PACKET}#page=47"
      >Policy &amp; Procedure 41.3.9, ALPR Systems</a
    >, revised May 20, 2026, page 2
  </footer>
</blockquote>

<p>
  For a plain-language history of how plate readers went from a stolen-car tool to networked
  tracking, see DeFlockILM's explainer (<a
    href="https://deflockilm.org/alpr-explained/"
    target="_blank"
    rel="external noopener noreferrer">ALPR, Explained</a
  >, October 5, 2026), written by a citizen privacy group in North Carolina.
</p>

<h2>Why the City Wants It</h2>

<!-- The department's stated purpose, from its handout to the Council. -->
<blockquote>
  <p>
    "The Haverhill Police Department utilizes Flock Safety technology as an investigative tool to
    assist officers and detectives in solving crimes, locating vehicles associated with
    investigations, developing investigative leads, and protecting the community."
  </p>
  <footer>
    Haverhill Police Department, <a href="{PACKET}#page=32"
      >Flock Safety Technology: Purpose, Safeguards, Accountability &amp; Community Questions</a
    >, handed out at the City Council meeting of August 11, 2026
  </footer>
</blockquote>

<h2>Other Surveillance</h2>

<p>
  License plate readers are not the only surveillance technology Haverhill Police have used. Some of
  it was bought or joined by Haverhill itself, and some is available to every police department in
  Massachusetts through a state contract.
</p>

<!-- Statewide versus Haverhill, per item, from: Atlas CSV rows AOS000122
     (PredPol) and AOS012874 (CrimeTracer); the Ring PDFs. -->
<ul>
  <li>
    <strong>PredPol (now Geolitica), predictive policing.</strong> Haverhill. Subscription began
    January 6, 2014 (<a
      href="https://cdn.muckrock.com/foia_files/2018/11/19/HAVERHILL_PredPol_SaaS_Agreement_2016.12.08_-_renewal_contract.pdf"
      target="_blank"
      rel="external noopener noreferrer">PredPol renewal agreement</a
    >, page 1).
  </li>
  <li>
    <strong>Ring Neighbors Portal.</strong> Haverhill. The Police Department announced it was
    joining on April 17, 2019 (<a href="{RING_4}#page=1">Ring_4of6.pdf</a>, page 1).
  </li>
  <li>
    <strong
      >CrimeTracer (formerly Coplink X), by SoundThinking, the company that makes ShotSpotter.</strong
    >
    Statewide. Available to police across Massachusetts through a state contract announced December 6,
    2022 (<a
      href="https://www.soundthinking.com/press-releases/shotspotter-selected-by-commonwealth-of-massachusetts-for-statewide-deployment-of-coplink-x/"
      target="_blank"
      rel="external noopener noreferrer">SoundThinking</a
    >).
  </li>
  <li>
    <strong>City surveillance cameras.</strong> Haverhill. The Police Department lists "city
    surveillance cameras" among the evidence it uses alongside Flock (<a href="{PACKET}#page=33"
      >packet</a
    >, page 33), and its case list mentions "city camera footage" (<a href="{PACKET}#page=44"
      >packet</a
    >, page 44).
  </li>
  <li>
    <strong>Cameras at Haverhill schools.</strong> Haverhill. Haverhill Public Schools pays
    Convergint Technologies for security systems at its schools. A March 2023 proposal replaced the
    exterior cameras at Haverhill High School, covering the main entrance, bus lanes, and loading
    dock, for $14,036.09, with cameras that include "analytics with deep learning" (<a
      href="{HHS_CAMERAS}#page=2">proposal</a
    >, pages 2 to 4). Invoices also show a door card reader repair at the high school in 2023 (<a
      href={SCHOOL_INVOICE_2023}>invoice</a
    >) and a three-year security service contract at Dr. Paul Nettle Middle School (<a
      href={SCHOOL_INVOICE_2024}>invoice</a
    >, 2024). These are a selection of the records released; the full set is
    <a
      href="https://www.muckrock.com/foi/haverhill-265/public-records-request-convergint-technologies-163191/#files"
      target="_blank"
      rel="external noopener noreferrer">on MuckRock</a
    >.
  </li>
</ul>

<!-- ShotSpotter is not in use in Haverhill as far as any record found shows.
     It is noted for the ordinance: limits on gunshot detection could be
     written in alongside ALPR. -->
<p>
  <strong>A note on ShotSpotter.</strong> ShotSpotter, also made by SoundThinking, listens for
  gunshots with microphones placed around a city. No record found shows it in use in Haverhill.
  Where it has been used it has had serious problems, including alerts that rarely lead to evidence
  of a gun crime and sensors placed mostly in Black and Latino neighborhoods, and Chicago stopped
  using it in 2024 (<a
    href="https://www.npr.org/2024/10/20/nx-s1-5131546/researchers-are-skeptical-of-this-gunfire-detection-system-chicago-no-longer-uses-it"
    target="_blank"
    rel="external noopener noreferrer">NPR, October 20, 2024</a
  >;
  <a
    href="https://igchicago.org/publications/cpd-use-of-shotspotter-technology/"
    target="_blank"
    rel="external noopener noreferrer">Chicago Office of Inspector General, 2021</a
  >). Haverhill should not consider adding it, and the ordinance should prohibit its use.
</p>

<!-- More on each goes here. -->

<h2>Current Policies</h2>

<p>
  The rules in place now. The city's proposed ordinance is compared with the ACLU model bill further
  down this page.
</p>

<h3>Police Department Policy 41.3.9</h3>

<p class="text-sm text-slate-600">
  Source: Haverhill Police Department, <a href="{PACKET}#page=46"
    >Policy &amp; Procedure 41.3.9, ALPR Systems</a
  >, issued November 9, 2012, revised May 20, 2026 (PDF pages 46 to 54)
</p>

<p>
  This is the Police Department's own policy, approved by the Chief of Police (<a
    href="{PACKET}#page=46">page 1</a
  >). It is not a law passed by the City Council, and the department can amend it (<a
    href="{PACKET}#page=54">page 9</a
  >). It lists the uses allowed (<a href="{PACKET}#page=48">page 3</a>), keeps data that is not
  evidence for 30 days (<a href="{PACKET}#page=53">page 8</a>), and requires audits inside the
  department at least every three months (<a href="{PACKET}#page=52">page 7</a>).
</p>

<h3>Massachusetts Law</h3>

<p class="text-sm text-slate-600">
  These apply across Massachusetts, not only in Haverhill. Sources: <a
    href="https://caselaw.findlaw.com/court/spr-jud-crt-mas-bar/2060202.html"
    target="_blank"
    rel="external noopener noreferrer">Commonwealth v. McCarthy</a
  >, Supreme Judicial Court, April 16, 2020; M.G.L. c. 147, § 64, as summarized in the
  <a href="{PACKET}#page=5">special counsel's memo</a> (PDF page 5)
</p>

<ul>
  <li>
    <strong>Commonwealth v. McCarthy (2020).</strong> The state's highest court held that four
    cameras on two bridges were not a search, but warned that enough cameras in enough places would
    be (<a
      href="https://caselaw.findlaw.com/court/spr-jud-crt-mas-bar/2060202.html"
      target="_blank"
      rel="external noopener noreferrer">Commonwealth v. McCarthy</a
    >).
  </li>
  <li>
    <strong>M.G.L. c. 147, § 64 (in effect since September 4, 2026).</strong> Limits police from
    using state or local resources for, or taking part in, federal civil immigration enforcement
    except in specified circumstances, and limits sharing nonpublic information with federal
    immigration authorities (<a href="{PACKET}#page=5">special counsel's memo</a>, PDF page 5).
  </li>
</ul>

<h2>Common Justifications</h2>

<p>
  Reasons the city and the Police Department have given for license plate readers, in their own
  words, with what to know about each.
</p>

<p>
  <strong>A note on where the numbers come from.</strong> Much of what the city was given about
  Flock came from Flock. The department's handout relies on "Flock's own current policy" (<a
    href="{PACKET}#page=33">packet page 33</a
  >), and the packet included a Flock marketing guide for councils (packet pages 24 to 29, not
  reproduced here because Flock lists it as private and not for sharing). That guide tells councils
  "LPR is not a 'search' under the Fourth Amendment" (packet page 28), but a federal judge has since
  ruled that a warrantless Flock search was one (<a
    href="https://www.courtlistener.com/docket/73367327/united-states-v-kyle/"
    target="_blank"
    rel="external noopener noreferrer">United States v. Kyle</a
  >). It says federal agencies are excluded from Flock's nationwide network (packet page 27), but
  Illinois' Secretary of State found that Flock had let U.S. Customs and Border Protection access
  cameras on Illinois roads, against state law (<a
    href="https://www.nbcchicago.com/news/local/company-violated-illinois-law-by-sharing-license-plate-data-with-customs-and-border-protection-giannoulias/3814914/"
    target="_blank"
    rel="external noopener noreferrer">NBC Chicago, August 25, 2025</a
  >). It also offers Flock's own "Outcomes" tool to produce success numbers "come time for renewal"
  (packet page 29).
</p>

<p>
  Any company selling a product has a reason to make it look as accurate and useful as possible.
  That is true of Flock and of every surveillance vendor that might replace it. Numbers that come
  from the vendor should be treated with skepticism unless independent sources back them up.
</p>

<h3>Solving Crimes</h3>

<p>
  <strong>What was said:</strong> "Flock technology has become an important investigative tool for
  the Police Department, providing timely vehicle identification, location information, and
  investigative leads that help officers identify involved parties, corroborate evidence, and move
  cases toward resolution." (<a href="{PACKET}#page=43">Police Department case list</a>, packet page
  43)
</p>

<p>
  <strong>What to know:</strong> Solving crimes does not cancel the right to privacy. Police may
  search only in ways the law allows. The Fourth Amendment says: "The right of the people to be
  secure in their persons, houses, papers, and effects, against unreasonable searches and seizures,
  shall not be violated, and no Warrants shall issue, but upon probable cause, supported by Oath or
  affirmation, and particularly describing the place to be searched, and the persons or things to be
  seized" (<a
    href="https://www.archives.gov/founding-docs/bill-of-rights-transcript"
    target="_blank"
    rel="external noopener noreferrer">U.S. Constitution, Fourth Amendment</a
  >). Courts have not settled whether searching a license plate database is a search that needs a
  warrant (<a
    href="https://www.congress.gov/crs_external_products/IF/HTML/IF13068.html"
    target="_blank"
    rel="external noopener noreferrer">Congressional Research Service, July 2025</a
  >). In October 2026, a federal judge in Oklahoma ruled that a deputy's search of a month of one
  car's location history in Flock's database, without a warrant, violated the Fourth Amendment, and
  called the system "a type of indiscriminate mass surveillance" (<a
    href="https://www.courtlistener.com/docket/73367327/united-states-v-kyle/"
    target="_blank"
    rel="external noopener noreferrer">United States v. Kyle</a
  >, N.D. Okla.;
  <a
    href="https://cbs12.com/news/florida/federal-judge-rules-warrantless-license-plate-reader-search-violated-fourth-amendment-flock-license-plate-reader-alpr-database-melisa-susan-kyle-oklahoma-vehicle-data-judge-sara-hill"
    target="_blank"
    rel="external noopener noreferrer">CBS12, October 3, 2026</a
  >). In Massachusetts, the Supreme Judicial Court has said that enough cameras in enough places
  would be a search (<a
    href="https://caselaw.findlaw.com/court/spr-jud-crt-mas-bar/2060202.html"
    target="_blank"
    rel="external noopener noreferrer">Commonwealth v. McCarthy</a
  >, 2020).
</p>

<p>
  How much plate readers help is also not well measured. The Congressional Research Service found no
  public data on how often they are used or how they contribute to cases (<a
    href="{CRS_REPORT}#page=2">Congressional Research Service, R48160</a
  >, page 2). The department's case list is a selection it chose, and it does not say how many
  searches led nowhere. Flock's own method undercuts its CEO's claim of 1 million crimes solved in a
  year (<a
    href="https://www.cbsnews.com/news/flocks-ceo-claims-its-tech-solved-1-million-crimes-data-shows-otherwise/"
    target="_blank"
    rel="external noopener noreferrer">CBS News</a
  >).
</p>

<p>The research that does exist is mixed. A review by the National Policing Institute found:</p>

<blockquote>
  "Lum and colleagues (2011) found no reduction in auto theft or crime generally when ALPR-equipped
  patrols were assigned to hot spots. Taylor, Koper, and Woods (2012) found more stolen vehicle
  recoveries and auto theft arrests, but no drop in theft itself. A related quasi-randomized test
  found little evidence that displaying LPRs added to the deterrent value of patrol (Koper et al.,
  2022). All were part of a broader NIJ-funded evaluation of LPR cost-benefit effectiveness (Koper
  et al., 2018), the most comprehensive assessment of the technology to date." (<a
    href="https://www.policinginstitute.org/infocus/alpr-backlash-what-agencies-need-to-know/"
    target="_blank"
    rel="external noopener noreferrer">National Policing Institute, August 27, 2026</a
  >)
</blockquote>

<p>
  The same review notes that studies of plate readers used in investigations are "more encouraging
  and less conclusive". Either way, the numbers vendors share come from their networks nationwide,
  so it is not clear how much plate readers actually help in Haverhill. The department saying it
  feels the system helps is not enough to justify it. Haverhill-specific results, including the
  searches that led nowhere, should be public before any system is approved.
</p>

<h3>No Expectation of Privacy on Public Roads</h3>

<p>
  <strong>What was said:</strong> Flock "captures images of vehicles and license plates that pass
  designated cameras in areas where there is no reasonable expectation of privacy." (<a
    href="{PACKET}#page=32">Police Department Flock handout</a
  >, packet page 32)
</p>

<p>
  <strong>What to know:</strong> One photo of a car on a public road is generally not a search. A
  record of where a car goes over days or weeks is different. Under the "mosaic" idea, enough
  location points add up to a picture of someone's life, and the Supreme Court found a privacy
  interest in historical phone location records in 2018 even though they were held by a phone
  company (<a
    href="https://www.congress.gov/crs_external_products/IF/HTML/IF13068.html"
    target="_blank"
    rel="external noopener noreferrer">Congressional Research Service, July 2025</a
  >). Massachusetts' highest court applied the same reasoning to plate readers in
  <a
    href="https://caselaw.findlaw.com/court/spr-jud-crt-mas-bar/2060202.html"
    target="_blank"
    rel="external noopener noreferrer">Commonwealth v. McCarthy</a
  >.
</p>

<h3>Not Facial Recognition</h3>

<p>
  <strong>What was said:</strong> "Flock does NOT use facial recognition." "Flock does NOT tell
  officers who a person is." (<a href="{PACKET}#page=33">Police Department Flock handout</a>, packet
  page 33)
</p>

<p>
  <strong>What to know:</strong> A plate reader does not need a face to track a person. A plate is
  registered to a person, and Flock records vehicle details as well as the plate (<a
    href="{PACKET}#page=32">packet page 32</a
  >). The same statement also means a plate read cannot show who was driving, which is why it should
  never be the only evidence placing someone somewhere (see Additions I Would Suggest).
</p>

<p>
  The limit is in the software, not the hardware. A plate reader is a camera, and what it looks for
  is decided by the vendor's software. When reporters at Wired and 404 Media examined the software
  from a stolen Flock camera, they found it already detects people who enter the frame and records
  where they appear, and that the camera receives remote updates. They found no evidence of facial
  recognition (<a
    href="https://san.com/cc/hackers-stole-a-flock-camera-heres-what-they-found-inside/"
    target="_blank"
    rel="external noopener noreferrer">Straight Arrow News, September 16, 2026</a
  >). Flock also already sells a search for people by description, such as "man in blue shirt and
  cowboy hat", on its video cameras, and says it does not work on its plate readers (<a
    href="https://www.flocksafety.com/products/flock-freeform"
    target="_blank"
    rel="external noopener noreferrer">Flock Safety, FreeForm Search</a
  >). Because these are software choices, a vendor update could extend a plate reader toward
  searching for people, or toward facial recognition, without any new cameras being installed (see
  The Vendor Controls the Software). Flock's own patent describes searching camera footage for
  matching faces (<a
    href="https://patents.google.com/patent/US11416545B1/en"
    target="_blank"
    rel="external noopener noreferrer">U.S. Patent 11,416,545</a
  >).
</p>

<h3>No Nationwide Data Sharing</h3>

<p>
  <strong>What was said:</strong> "The Haverhill Police Department does not participate in
  unrestricted nationwide ALPR data sharing networks." (<a href="{PACKET}#page=47">Policy 41.3.9</a
  >, page 2)
</p>

<p>
  <strong>What to know:</strong> The word "unrestricted" matters. The same policy allows sharing
  with "specifically authorized agencies and users approved by the Department" (<a
    href="{PACKET}#page=52">page 7</a
  >), and the department can change the policy itself (<a href="{PACKET}#page=54">page 9</a>).
  Elsewhere, federal agencies have searched local plate data in sanctuary states, potentially for
  immigration enforcement (<a
    href="https://www.npr.org/2025/11/07/nx-s1-5587724/some-sanctuary-states-discover-feds-mining-local-license-plate-data"
    target="_blank"
    rel="external noopener noreferrer">NPR, November 7, 2025</a
  >).
</p>

<p>
  The five-year Flock order form the Police Chief signed in 2024 includes "Nationwide Network (LP
  Lookup Only)", which "Allows agencies to look up license plates on all cameras opted in to the
  nationwide Flock network" (<a href="{FLOCK}#page=70">Flock contract, page 70</a>). The Police
  Department told the City Council on August 11, 2026 that Haverhill was not opted in (<a
    href="http://haverhillcommunitytv.org/video/haverhill-city-council-meeting-august-11-2026"
    target="_blank"
    rel="external noopener noreferrer">Haverhill Community TV recording</a
  >). The records give no way to confirm that either way, and no limits on sharing were discussed
  with residents before the cameras went up. That is why written limits in the ordinance matter. The
  city draft would require a City Council vote before joining any regional or national sharing
  network (<a href="{PACKET}#page=16">§ XXX-11</a>, packet pages 16 to 17), and the ACLU model bill
  would limit sharing further (see the comparison below).
</p>

<h2>Concerns</h2>

<h3>False Positives</h3>

<p>
  The current police policy itself says: "Officers shall recognize that ALPR systems may generate
  false alerts or inaccurate reads" (<a href="{PACKET}#page=50">Policy 41.3.9</a>, page 5). How
  often that happens is higher than many people assume. In a randomized controlled trial run by the
  Vallejo, California Police Department, 35% of all alerts from readers mounted on police cars were
  misreads, and 37% from fixed readers (<a
    href="https://www.theiacp.org/sites/default/files/2018-08/March%202018%20RIB.pdf"
    target="_blank"
    rel="external noopener noreferrer">International Association of Chiefs of Police, March 2018</a
  >). That is roughly one wrong alert in every three.
</p>

<p>
  A figure of around 90% accuracy is sometimes quoted, but the Congressional Research Service notes
  it is one observer's estimate rather than a formal study, and that innocent people can come under
  investigation when their plate matches a wrong read (<a href="{CRS_REPORT}#page=11"
    >Congressional Research Service, R48160</a
  >, page 11). When a read is wrong, police may stop the wrong car, sometimes at gunpoint. In
  February 2026 in Sherwood, Arkansas, a Flock camera misread one letter of a family's plate as a
  stolen car's, and officers held the couple at gunpoint and handcuffed them while their
  six-week-old baby was in the back seat (<a
    href="https://katv.com/news/local/sherwood-stop-sparked-after-flock-camera-misread-plate-by-one-letter-as-stolen-katv-news-share-inform-public-community-safety"
    target="_blank"
    rel="external noopener noreferrer">KATV</a
  >). More examples are under Additions I Would Suggest.
</p>

<h3>Potential for Abuse</h3>

<p>
  Plate data shows where people go: doctors, places of worship, protests, and homes. The judge in
  United States v. Kyle pointed to visits to medical providers, lawyers, and fertility clinics as
  examples of what a month of plate data can reveal (<a
    href="https://cbs12.com/news/florida/federal-judge-rules-warrantless-license-plate-reader-search-violated-fourth-amendment-flock-license-plate-reader-alpr-database-melisa-susan-kyle-oklahoma-vehicle-data-judge-sara-hill"
    target="_blank"
    rel="external noopener noreferrer">CBS12, October 3, 2026</a
  >). The current rules depend on the department checking itself, through internal audits (see
  Enforcement and Verification). Elsewhere, federal agencies have searched local plate data in
  sanctuary states, potentially for immigration enforcement (<a
    href="https://www.npr.org/2025/11/07/nx-s1-5587724/some-sanctuary-states-discover-feds-mining-local-license-plate-data"
    target="_blank"
    rel="external noopener noreferrer">NPR, November 7, 2025</a
  >).
</p>

<p>
  Officers have also used Flock to stalk and harass people. By July 2026 there were at least two
  dozen cases of officers resigning or being arrested for using Flock to track romantic interests (<a
    href="https://www.cnn.com/2026/07/26/us/flock-cameras-surveillance-abuse"
    target="_blank"
    rel="external noopener noreferrer">CNN, July 26, 2026</a
  >). Some examples:
</p>

<ul>
  <li>
    A Kentucky officer was arrested after allegedly tracking an ex-girlfriend through Flock more
    than 2,000 times (<a
      href="https://www.cnn.com/2026/08/26/us/flock-kentucky-police-officer-arrest"
      target="_blank"
      rel="external noopener noreferrer">CNN, August 26, 2026</a
    >).
  </li>
  <li>
    Five Indianapolis officers were charged with misusing Flock, mainly to search for ex-partners
    and people they knew. One was charged with stalking after allegedly searching a woman's plate
    more than 170 times and leaving a note on her car (<a
      href="https://abcnews.com/US/5-indianapolis-police-officers-charged-misusing-license-plate/story?id=136696856"
      target="_blank"
      rel="external noopener noreferrer">ABC News, September 24, 2026</a
    >;
    <a
      href="https://www.wfyi.org/wfyi-news/2026-09-24/five-indianapolis-police-officers-charged-for-misusing-flock-cameras"
      target="_blank"
      rel="external noopener noreferrer">WFYI, September 24, 2026</a
    >).
  </li>
  <li>
    A Mooresville, North Carolina officer was arrested after allegedly using Flock 31 times to track
    her boyfriend's ex-wife, listing most of the searches as traffic violations (<a
      href="https://abcnews.com/US/officer-allegedly-flock-license-plate-cameras-track-boyfriends/story?id=135418955"
      target="_blank"
      rel="external noopener noreferrer">ABC News, August 6, 2026</a
    >).
  </li>
</ul>

<p>
  Many of these cases were caught by audits, which shows audits matter (<a
    href="https://www.cnn.com/2026/08/26/us/flock-kentucky-police-officer-arrest"
    target="_blank"
    rel="external noopener noreferrer">CNN, August 26, 2026</a
  >;
  <a
    href="https://abcnews.com/US/officer-allegedly-flock-license-plate-cameras-track-boyfriends/story?id=135418955"
    target="_blank"
    rel="external noopener noreferrer">ABC News, August 6, 2026</a
  >). The Mooresville case also shows that the reason an officer types in for a search can be false,
  so an audit that only checks that a reason was given is not enough.
</p>

<h3>Overreach</h3>

<p>
  Haverhill had 19 Flock cameras at the city's entry and exit points (<a
    href="https://newslinklive.com/2026/08/13/haverhill-moves-to-regulate-use-of-flock-cameras-amid-surveillance-concerns/"
    target="_blank"
    rel="external noopener noreferrer">Newslink</a
  >;
  <a
    href="https://whav.net/2026/08/11/haverhill-council-debates-security-vs-surveillance-cameras/"
    target="_blank"
    rel="external noopener noreferrer">WHAV</a
  >). Massachusetts' highest court has said that enough cameras in enough places would be a search (<a
    href="https://caselaw.findlaw.com/court/spr-jud-crt-mas-bar/2060202.html"
    target="_blank"
    rel="external noopener noreferrer">Commonwealth v. McCarthy</a
  >). Other cities, including Cambridge, have canceled their Flock contracts over these concerns (<a
    href="https://www.npr.org/2026/02/17/nx-s1-5612825/flock-contracts-canceled-immigration-survillance-concerns"
    target="_blank"
    rel="external noopener noreferrer">NPR, February 17, 2026</a
  >).
</p>

<p>
  Haverhill has now canceled its Flock contract (<a
    href="https://www.haverhillma.gov/news/posts/city-of-haverhill-canceling-flock-safety-contract"
    target="_blank"
    rel="external noopener noreferrer">City of Haverhill, November 5, 2026</a
  >), but that does not fix the underlying problem. The cameras were added, renewed, and given a
  five-year term out of public view, and residents learned about them years later (see Added Without
  Oversight or Notice). It should not have taken a public outcry for this to come to light. Without
  written rules requiring public notice and a vote first, the next system, from any vendor, could be
  added the same way.
</p>

<h3>Enforcement and Verification</h3>

<p>
  Under the current policy, audits are done inside the Police Department, at least every three
  months, by the ALPR Administrator (the Captain of the Criminal Investigations Division), and the
  audit records are kept by the department (<a href="{PACKET}#page=49">Policy 41.3.9</a>, pages 4
  and 7). The policy does not require any public report, so the only way for a resident to check
  that it is being followed is a public records request (<a href="{PACKET}#page=54">page 9</a>). The
  policy also lists what the Flock contract "shall require" of the company (<a
    href="{PACKET}#page=53">page 8</a
  >), but names no way for the city or the public to check that the company does it.
</p>

<p>
  The draft ordinance would add a yearly report to the Mayor and City Council (<a
    href="{PACKET}#page=18">§ XXX-14</a
  >) and terms vendors must agree to (<a href="{PACKET}#page=17">§ XXX-12</a>). A vendor that breaks
  those terms would be dealt with through its contract. The draft also states that it gives
  residents no right to sue if the rules are broken (<a href="{PACKET}#page=21"
    >§ XXX-18(E) and (F)</a
  >). That is a concern for a system residents cannot opt out of: anyone who drives past a camera is
  recorded, whether or not they agree to it.
</p>

<p>
  Vendors do not always follow what a city decides. After Cambridge deactivated its Flock cameras,
  Flock installed two more without the city's knowledge, from a work order that should have been
  canceled, and Cambridge ended the contract (<a
    href="https://www.cambridgema.gov/news/2025/12/statementontheflocksafetyalprcontracttermination"
    target="_blank"
    rel="external noopener noreferrer">City of Cambridge, December 10, 2025</a
  >).
</p>

<!-- More goes here. -->

<h3>Added Without Oversight or Notice</h3>

<p>
  The Flock cameras were in place for years before residents were asked about them. The Flock
  contract's own attachments show the steps:
</p>

<ul>
  <li>
    <strong>January 2022:</strong> the Police Chief signed a Flock order form for 8 cameras, for 24
    months, renewing automatically unless canceled (<a href="{FLOCK}#page=20">page 20</a>,
    <a href="{FLOCK}#page=22">page 22</a>,
    <a href="{FLOCK}#page=33">page 33</a>). The department's current plate reader policy took effect
    in December 2022 (<a href="{PACKET}#page=46">Policy 41.3.9</a>, page 1).
  </li>
  <li>
    <strong>January 2024:</strong> the Police Chief signed a new order form for 11 cameras with a
    60-month (five-year) term, $137,500 in total (<a href="{FLOCK}#page=66">page 66</a>,
    <a href="{FLOCK}#page=68">page 68</a>).
  </li>
  <li>
    <strong>April 2025:</strong> the City Council's first vote on Flock, more than three years after
    the first order. It only allowed the Mayor to sign a contract longer than three years. The order
    gives no reason for the longer term and sets no rules on use (<a href="{FLOCK}#page=72"
      >page 72</a
    >).
  </li>
  <li>
    <strong>June 2025:</strong> the city signed a $110,000 contract running through December 31,
    2029, which can be "extended, in writing, at the sole discretion of the City" (<a
      href="{FLOCK}#page=3">page 3</a
    >).
  </li>
  <li>
    <strong>August 2026:</strong> the first public discussion, when the department handed out its
    information at a City Council meeting (<a href="{PACKET}#page=32">packet page 32</a>;
    <a
      href="https://whav.net/2026/08/11/haverhill-council-debates-security-vs-surveillance-cameras/"
      target="_blank"
      rel="external noopener noreferrer">WHAV</a
    >).
  </li>
</ul>

<p>
  I have not found any public notice to residents explaining why the cameras were added, why a
  five-year term was needed, or where the cameras were placed.
</p>

<p>
  This is not the first time. When the Police Department joined Ring's Neighbors app in 2019, the
  announcement was a press release, and the department's email that afternoon asked only: "Please
  post this to facebook." (<a href="{RING_4}#page=1">Ring_4of6.pdf</a>, pages 1 to 3). Another
  notice may have gone out, but I did not find one in these records. A Facebook post is not the same
  as informing the City Council or raising it at a public meeting. Opting a city into surveillance
  should take more than a Facebook post.
</p>

<p>
  The release itself appears to have been written by Ring's public relations team. A draft dated
  "April X, 2019" has the same text (<a href="{RING_4}#page=4">page 4</a>), Ring's public relations
  coordinator is listed as a media contact, and it ends with Ring's own claim that "one Los Angeles
  neighborhood saw a 55 percent decrease in home break-ins", with no independent source (<a
    href="{RING_4}#page=2">page 2</a
  >).
</p>

<h3>The Vendor Controls the Software</h3>

<p>
  This section uses Flock as the example because its contract with Haverhill is public. The concern
  is not limited to Flock. Any third-party surveillance company is likely to have similar terms,
  keeping control of its own software and treating how it works as proprietary, so the same
  questions apply to any vendor the city might use next.
</p>

<p>
  What a plate reader can search for is decided by the company's software, not by the city. Flock's
  "Vehicle Fingerprint" already searches for more than plates: "type, make, color, state
  registration, missing/covered plates, bumper stickers, decals, roof racks, and bike racks" (<a
    href="{FLOCK}#page=43">Flock contract, page 43</a
  >).
</p>

<p>The contract leaves the software in Flock's hands:</p>

<ul>
  <li>
    "Flock may make any upgrades to system or platform that it deems necessary or useful", including
    for "the competitive strength of, or market for, Flock's products" (<a href="{FLOCK}#page=44"
      >page 44</a
    >).
  </li>
  <li>
    Flock's "Proprietary Information" includes "non-public information regarding features,
    functionality and performance of the Services" (<a href="{FLOCK}#page=47">page 47</a>), and the
    city may not examine how the software works (<a href="{FLOCK}#page=48">page 48</a>).
  </li>
  <li>
    Flock may use anonymized data from the cameras for "the training of machine learning algorithms"
    (<a href="{FLOCK}#page=47">page 47</a>).
  </li>
</ul>

<p>
  The Police Department's handout says Flock does not use facial recognition (<a
    href="{PACKET}#page=33">packet page 33</a
  >), but that describes the product as it is today. Software that searches for bumper stickers
  could be changed to search for people, or to recognize faces, if the company chose to. Flock's
  plate reader software already detects people in the frame and receives remote updates (<a
    href="https://san.com/cc/hackers-stole-a-flock-camera-heres-what-they-found-inside/"
    target="_blank"
    rel="external noopener noreferrer">Straight Arrow News</a
  >), and Flock already offers people search on its video cameras (<a
    href="https://www.flocksafety.com/products/flock-freeform"
    target="_blank"
    rel="external noopener noreferrer">Flock Safety</a
  >). The current police policy limits how plate reader data is used and shared, but it does not
  limit which features the vendor provides or bar searching for people (<a href="{PACKET}#page=46"
    >Policy 41.3.9</a
  >, pages 1 to 9). Because the vendor's software is proprietary, neither the city nor residents can
  check what it does.
</p>

<p>
  Flock's patents show where its software could go. U.S. Patent 11,416,545, granted to Flock Group
  Inc in 2022 with its CEO and a co-founder as inventors, describes one system that searches video
  from many unrelated cameras, including home security systems and store cameras. It describes
  searching that footage for "a person with matching face recognition data points", and sending an
  alert when a person seen on camera "is statistically similar to the teenage daughter of a
  subscriber" (<a
    href="https://patents.google.com/patent/US11416545B1/en"
    target="_blank"
    rel="external noopener noreferrer">U.S. Patent 11,416,545</a
  >; see also
  <a
    href="https://deflockilm.org/flock-tracking-patent/"
    target="_blank"
    rel="external noopener noreferrer">DeFlockILM, September 17, 2026</a
  >). A patent describes what a company could build, not what it has built, and Flock says its plate
  readers do not use facial recognition. But it shows the company has already designed for it, and
  that the only thing between a plate reader and a people tracker is software the city does not
  control.
</p>

<p>
  Selling data is not the only issue. The 2024 agreement says Flock "does not own and shall not sell
  Customer Data" (<a href="{FLOCK}#page=46">page 46</a>), but it also gives Flock a "worldwide,
  perpetual, royalty-free right to use and distribute" anonymized data "to improve and enhance the
  Services and for other development, diagnostic and corrective purposes, and other Flock offerings"
  (<a href="{FLOCK}#page=47">page 47</a>). The 2022 agreement gave Flock a "perpetual" license,
  lasting "during and after the term", to disclose the department's data and footage to law
  enforcement (<a href="{FLOCK}#page=31">page 31</a>).
</p>

<p>
  The police policy says the agreement with Flock "shall require" that the vendor "not independently
  sell, mine, monetize, or commercially distribute Department ALPR data" (<a href="{PACKET}#page=53"
    >Policy 41.3.9</a
  >, page 8). The contract itself allows Flock to use the data to train AI, to build other products,
  and to distribute it, and nothing in the contract or the policy limits who Flock shares it with
  for those purposes. The contract does not say how the data is anonymized, and because it is
  proprietary, no one outside Flock can check. Once data has been used to train a system or shared
  with others, it cannot be taken back, even after the contract ends.
</p>

<h2>Questions for the City</h2>

<p>
  These questions apply to any license plate reader system, not only Flock. The city has said it is
  canceling the Flock contract, and that the Public Safety Subcommittee will discuss guardrails "for
  any future ALPRs" (<a
    href="https://www.haverhillma.gov/news/posts/city-of-haverhill-canceling-flock-safety-contract"
    target="_blank"
    rel="external noopener noreferrer">City of Haverhill, November 5, 2026</a
  >). The concerns on this page come from what license plate readers do, whichever company provides
  them.
</p>

<ul>
  <li>
    Did the city consider <a
      href="https://privacysos.org/blog/mass-high-court-license-plate-reader-surveillance-can-trigger-constitutional-protections/"
      target="_blank"
      rel="external noopener noreferrer">Commonwealth v. McCarthy</a
    >? In 2020, Massachusetts' highest court held that four cameras on two bridges were not a
    search, but warned: "With enough cameras in enough locations, the historic location data from an
    ALPR system in Massachusetts would invade a reasonable expectation of privacy." Haverhill had 19
    Flock cameras at the city's entry and exit points. Was that question asked before they were
    installed?
  </li>
  <li>
    When the City Council voted on April 8, 2025 to allow a Flock contract longer than three years (<a
      href="{FLOCK}#page=72">Document 23-F</a
    >), was it told how the cameras would be used, how long the data would be kept, or who it would
    be shared with?
  </li>
  <li>
    At its September 3, 2026 meeting, before voting on a license, the License Commission asked the
    applicant about installing cameras and whether they planned to work with the police (<a
      href="http://haverhillcommunitytv.org/video/haverhill-license-commission-meeting-september-3-2026"
      target="_blank"
      rel="external noopener noreferrer">Haverhill Community TV recording</a
    >, from 13:25). Is agreeing to share footage a condition of getting a license, and does the city
    have any written limits on how that footage is requested or used?
  </li>
  <li>
    If Flock is replaced, will any new license plate reader system, from any company, have to meet
    the ordinance and be approved in public before it is installed?
  </li>
  <!-- More questions go here. -->
</ul>

<h2>Comparing the City's Draft Ordinance and the ACLU Model Bill</h2>

<p>
  Two proposed sets of rules for license plate readers. The city's draft ordinance was written by
  the city's special counsel with the Police Department, and sent to the Mayor and City Council in
  September 2026 (<a href="{PACKET}#page=3">memo</a>, <a href="{PACKET}#page=8">draft</a>). The
  ACLU's model bill is a template any city can adopt (<a
    href="https://www.aclu.org/documents/local-automatic-license-plate-reader-privacy-model-bill"
    target="_blank"
    rel="external noopener noreferrer">ACLU</a
  >, November 2026, <a href={MODEL_BILL}>copy</a>). Each summary below gives the section and page it
  comes from.
</p>

<p>
  The topics below are not a complete list of what the two bills say. They are a selection I chose
  of the differences I think matter most: how much a system can collect, keep, and share, who can
  check it, and how the rules are enforced. The green box under each topic is my opinion of which is
  better and why, favoring the option that collects less or gives the public more oversight. Please
  read both full texts, linked above, and form your own opinion.
</p>

<div class="space-y-6">
  {#each COMPARISON as row (row.topic)}
    <section>
      <h3>{row.topic}</h3>
      <div class="grid gap-3 md:grid-cols-2">
        <div class="rounded border border-slate-200 bg-slate-50 p-3">
          <p class="m-0 text-sm font-semibold text-slate-700">City draft ordinance</p>
          <p class="m-0 mt-1">{row.city}</p>
          <p class="m-0 mt-1 text-sm text-slate-600">
            <a href="{PACKET}#page={row.cityPage}">{row.citySection}</a>
          </p>
        </div>
        <div class="rounded border border-slate-200 bg-slate-50 p-3">
          <p class="m-0 text-sm font-semibold text-slate-700">ACLU model bill</p>
          <p class="m-0 mt-1">{row.aclu}</p>
          {#if row.acluSection}
            <p class="m-0 mt-1 text-sm text-slate-600">
              <a href="{MODEL_BILL}#page={row.acluPage}">{row.acluSection}</a>
            </p>
          {/if}
        </div>
      </div>
      {#if row.note}
        <p class="mt-3 mb-0">{row.note}</p>
      {/if}
      <div class="mt-3 rounded border border-emerald-300 bg-emerald-50 p-3">
        <p class="m-0 text-sm font-semibold text-emerald-900">My pick: {row.pick}</p>
        <p class="m-0 mt-1">{row.why}</p>
      </div>
    </section>
  {/each}
</div>

<h3>Additions I Would Suggest</h3>

<p>Neither bill includes these. They are my suggestions.</p>

<ul>
  <li>
    <strong>A person must approve every enforcement action.</strong> No fine, ticket, warrant,
    arrest, or other action should be taken based only on an automated system or AI. The city draft
    says an alert alone is not probable cause, but asks for a person to check it only "when
    reasonably practicable" (<a href="{PACKET}#page=15">§ XXX-8(F) to (H)</a>), and the current
    police policy says "whenever practicable" (<a href="{PACKET}#page=50">Policy 41.3.9</a>, page
    5).
    <ul>
      <li>
        <strong>A plate is not a person.</strong> A camera records where a car was, not who was
        driving it. Cars are borrowed, shared, and sold, and plates can be misread. The Police
        Department's own handout says Flock "does NOT tell officers who a person is" (<a
          href="{PACKET}#page=33">packet</a
        >, page 33). License plate data should never be the only evidence used to place someone
        somewhere.
      </li>
      <li>
        <strong>Misread plates.</strong> In San Francisco in 2009, a license plate reader misread
        Denise Green's plate, 5SOW350, as 5SOW750, a stolen car. Officers held her at gunpoint and
        handcuffed her without checking the plate. A federal appeals court ruled that "an
        unconfirmed hit on the ALPR does not, alone, form the reasonable suspicion necessary to
        support an investigatory detention" (<a
          href="https://cdn.ca9.uscourts.gov/datastore/opinions/2014/05/12/11-17892.pdf"
          target="_blank"
          rel="external noopener noreferrer"
          >Green v. City and County of San Francisco, Ninth Circuit, 2014</a
        >).
      </li>
      <li>
        <strong>Plate mix-ups.</strong> In Aurora, Colorado, police held a Black family, including
        children, at gunpoint because their plate number matched a stolen motorcycle from another
        state. The city paid a $1.9 million settlement (<a
          href="https://www.cnn.com/2024/02/05/us/colorado-aurora-settlement-stolen-vehicle-mixup"
          target="_blank"
          rel="external noopener noreferrer">CNN, February 5, 2024</a
        >).
      </li>
      <li>
        <strong>Wrongful arrests.</strong> Detroit police arrested Robert Williams in front of his
        family after facial recognition software matched him to the wrong person (<a
          href="https://www.npr.org/2020/06/24/882683463/the-computer-got-it-wrong-how-facial-recognition-led-to-a-false-arrest-in-michig"
          target="_blank"
          rel="external noopener noreferrer">NPR, June 24, 2020</a
        >). A 2024 settlement now requires Detroit police to have independent evidence before an
        arrest (<a
          href="https://www.aclu.org/cases/williams-v-city-of-detroit-face-recognition-false-arrest"
          target="_blank"
          rel="external noopener noreferrer">ACLU</a
        >).
      </li>
      <li>
        <strong>Wrong tickets.</strong> AI cameras on New York City buses read plates and issued
        about 800 tickets in error because of a programming error, even though a person was supposed
        to review each one (<a
          href="https://www.npr.org/2024/12/31/nx-s1-5213674/transit-systems-ai-cameras-bus-lanes"
          target="_blank"
          rel="external noopener noreferrer">NPR, December 31, 2024</a
        >).
      </li>
    </ul>
  </li>
  <li>
    <strong>Cover all tracking technology, including aerial surveillance.</strong> The ordinance
    should apply to any technology that can track people or vehicles, including aerial surveillance
    from drones or aircraft, facial recognition, and gunshot detection. Police drone programs are
    spreading quickly, and drones can see into yards and through windows (<a
      href="https://www.eff.org/deeplinks/2026/07/hundreds-drone-first-responder-programs-could-soon-be-launched-across-country"
      target="_blank"
      rel="external noopener noreferrer">EFF, July 2026</a
    >;
    <a
      href="https://assets.aclu.org/live/uploads/2023/07/embargo-drones-as-first-responder-programs-final-electronic.pdf"
      target="_blank"
      rel="external noopener noreferrer">ACLU, 2023</a
    >). Some drones now carry license plate readers themselves (<a
      href="https://www.eff.org/deeplinks/2025/09/drone-sky-could-be-tracking-your-car"
      target="_blank"
      rel="external noopener noreferrer">EFF, September 2025</a
    >), which a rule written only for fixed cameras could miss. A federal appeals court ruled that
    police aerial surveillance covering much of Baltimore for 12 hours a day needed a warrant, and
    other courts have warned that cameras combined with "facial recognition, automated tracking or
    artificial intelligence" could cross the same line (<a
      href="https://www.congress.gov/crs-product/LSB11429"
      target="_blank"
      rel="external noopener noreferrer">Congressional Research Service, May 2026</a
    >).
  </li>
  <li>
    <strong>No gunshot detection.</strong> The ordinance should prohibit systems like ShotSpotter (see
    the note under Other Surveillance).
  </li>
</ul>

<h2>Public Trust</h2>

<p>
  Public trust is not only a concern for residents. It matters to the police too. The National
  Policing Institute calls public support "an operational concern". In a 2018 survey of 405 people,
  90% did not know whether their local police used plate readers at all, and the researchers
  recommended that agencies weigh public perception seriously before adopting the technology,
  because awareness would catch up (<a
    href="https://www.policinginstitute.org/infocus/alpr-backlash-what-agencies-need-to-know/"
    target="_blank"
    rel="external noopener noreferrer">National Policing Institute, August 27, 2026</a
  >). In Haverhill, we can see where this is an issue given the contentious City Council meeting in
  August, and it is something we should be concerned about for the future.
</p>

<p>
  Police depend on residents to report crimes, come forward as witnesses, and share information.
  That works best when people trust how they are being watched and why. Surveillance added without
  notice puts that trust at risk, even when it is meant to help.
</p>

<p>
  The goal is transparency and collaboration: rules everyone can see and rely on, where residents
  know what is collected and who can see it, the City Council decides in public, and officers have
  tools the community has agreed to. That takes residents, the Council, and the Police Department
  working together, and the ordinance is the place to start.
</p>

<h2>References</h2>

<!-- Every source the page or its timeline rests on. Add to this as sections are written. -->
<ul>
  <li>
    <a href="{PACKET}#page=46"
      >Haverhill Police Department, Policy &amp; Procedure 41.3.9, ALPR Systems</a
    >, revised May 20, 2026, in the Public Safety Committee packet for November 12, 2026. The packet
    and the Flock contract were emailed to the author of this page; the city has not posted them
    publicly. Pages 24 to 29 of the packet, a Flock Safety marketing guide, have been removed
    because Flock lists the guide as private and not for sharing; every other page keeps its
    original number.
  </li>
  <li>
    Haverhill Police Department emails and documents about Ring's Neighbors Portal, 2018 to 2019:
    <a href={Router.reference("PublicSafetyLPR/Ring_1of6.pdf")}>part 1</a>,
    <a href={Router.reference("PublicSafetyLPR/Ring_2of6.pdf")}>part 2</a>,
    <a href={Router.reference("PublicSafetyLPR/Ring_3of6.pdf")}>part 3</a>,
    <a href={Router.reference("PublicSafetyLPR/Ring_4of6.pdf")}>part 4</a>,
    <a href={Router.reference("PublicSafetyLPR/Ring_5of6.pdf")}>part 5</a>,
    <a href={Router.reference("PublicSafetyLPR/Ring_6of6.pdf")}>part 6</a>
  </li>
  <li>
    <a href={Router.reference("PublicSafetyLPR/FlockContractwithHaverhill.pdf")}
      >Contract between the City of Haverhill and Flock Group Inc.</a
    >, June 24, 2025
  </li>
  <li>
    <a
      href="https://cdn.muckrock.com/foia_files/2018/11/19/HAVERHILL_PredPol_SaaS_Agreement_2016.12.08_-_renewal_contract.pdf"
      target="_blank"
      rel="external noopener noreferrer">PredPol subscription agreement renewal (via MuckRock)</a
    >, December 2016
  </li>
  <li>
    <a
      href="https://www.haverhillma.gov/news/posts/city-of-haverhill-canceling-flock-safety-contract"
      target="_blank"
      rel="external noopener noreferrer">City of Haverhill Canceling Flock Safety Contract</a
    >, City of Haverhill, November 5, 2026
  </li>
  <li>
    Haverhill Public Schools security records, a selection: <a href={HHS_CAMERAS}
      >Haverhill High School exterior camera replacement proposal</a
    >, Convergint Technologies, March 30, 2023;
    <a href={SCHOOL_INVOICE_2023}>Haverhill High School service invoice</a>, July 31, 2023;
    <a href={SCHOOL_INVOICE_2024}>Dr. Paul Nettle Middle School service contract invoice</a>,
    January 11, 2024 (full set:
    <a
      href="https://www.muckrock.com/foi/haverhill-265/public-records-request-convergint-technologies-163191/#files"
      target="_blank"
      rel="external noopener noreferrer"
      >MuckRock public records request to Convergint Technologies</a
    >)
  </li>
  <li>
    <a
      href="https://www.congress.gov/crs-product/LSB11429"
      target="_blank"
      rel="external noopener noreferrer"
      >Artificial Intelligence and the Fourth Amendment: Two Emerging Legal Issues</a
    >, Congressional Research Service, LSB11429, May 5, 2026
  </li>
  <li>
    <a
      href="https://www.theiacp.org/sites/default/files/2018-08/March%202018%20RIB.pdf"
      target="_blank"
      rel="external noopener noreferrer"
      >Research in Brief: Assessing the Effectiveness of Automatic License Plate Readers</a
    >, Jason Potts, Vallejo Police Department, Police Chief magazine (International Association of
    Chiefs of Police), March 2018
  </li>
  <li>
    <a href={CRS_REPORT}>Law Enforcement and Technology: Use of Automated License Plate Readers</a>,
    Congressional Research Service, R48160, August 19, 2024
  </li>
  <li>
    <a
      href="https://www.congress.gov/crs_external_products/IF/HTML/IF13068.html"
      target="_blank"
      rel="external noopener noreferrer"
      >Automated License Plate Readers: Background and Legal Issues</a
    >, Congressional Research Service, IF13068, July 21, 2025
  </li>
  <li>
    <a
      href="https://caselaw.findlaw.com/court/spr-jud-crt-mas-bar/2060202.html"
      target="_blank"
      rel="external noopener noreferrer">Commonwealth v. McCarthy, 484 Mass. 493</a
    >, Massachusetts Supreme Judicial Court, April 16, 2020, and the ACLU of Massachusetts'
    <a
      href="https://privacysos.org/blog/mass-high-court-license-plate-reader-surveillance-can-trigger-constitutional-protections/"
      target="_blank"
      rel="external noopener noreferrer">summary of the ruling</a
    >
  </li>
  <li>
    Number of Flock cameras (19, at entry and exit points), as stated by Deputy Chief Meaghan Pare
    at the City Council meeting of August 11, 2026: <a
      href="https://newslinklive.com/2026/08/13/haverhill-moves-to-regulate-use-of-flock-cameras-amid-surveillance-concerns/"
      target="_blank"
      rel="external noopener noreferrer">Newslink, August 13, 2026</a
    >, and
    <a
      href="https://whav.net/2026/08/11/haverhill-council-debates-security-vs-surveillance-cameras/"
      target="_blank"
      rel="external noopener noreferrer">WHAV, August 11, 2026</a
    >
  </li>
  <li>
    <a
      href="https://www.soundthinking.com/press-releases/shotspotter-selected-by-commonwealth-of-massachusetts-for-statewide-deployment-of-coplink-x/"
      target="_blank"
      rel="external noopener noreferrer"
      >ShotSpotter Selected by Commonwealth of Massachusetts for Statewide Deployment of Coplink X</a
    >, company announcement, December 6, 2022
  </li>
  <li>
    <a
      href="https://www.aclu.org/documents/local-automatic-license-plate-reader-privacy-model-bill"
      target="_blank"
      rel="external noopener noreferrer">Local Automatic License Plate Reader Privacy Model Bill</a
    >, ACLU, November 2026 (<a href={MODEL_BILL}>copy</a>)
  </li>
  <li>
    <a
      href="https://igchicago.org/publications/cpd-use-of-shotspotter-technology/"
      target="_blank"
      rel="external noopener noreferrer"
      >The Chicago Police Department's Use of ShotSpotter Technology</a
    >, City of Chicago Office of Inspector General, August 2021
  </li>
  <li>
    <a
      href="https://www.npr.org/2024/10/20/nx-s1-5131546/researchers-are-skeptical-of-this-gunfire-detection-system-chicago-no-longer-uses-it"
      target="_blank"
      rel="external noopener noreferrer"
      >Researchers are skeptical of this gunfire detection system. Chicago no longer uses it</a
    >, NPR, October 20, 2024
  </li>
  <li>
    <a
      href="https://www.atlasofsurveillance.org/search?location=Haverhill,+MA"
      target="_blank"
      rel="external noopener noreferrer">Atlas of Surveillance: Haverhill, MA</a
    >, Electronic Frontier Foundation
  </li>
  <li>
    <a
      href="https://www.policinginstitute.org/infocus/alpr-backlash-what-agencies-need-to-know/"
      target="_blank"
      rel="external noopener noreferrer">ALPR Backlash: What Agencies Need to Know</a
    >, National Policing Institute, August 27, 2026
  </li>
  <li>
    <a
      href="https://www.archives.gov/founding-docs/bill-of-rights-transcript"
      target="_blank"
      rel="external noopener noreferrer">The Bill of Rights: A Transcription</a
    >, National Archives
  </li>
  <li>
    <a
      href="https://www.courtlistener.com/docket/73367327/united-states-v-kyle/"
      target="_blank"
      rel="external noopener noreferrer">United States v. Kyle, No. 4:26-cr-00189</a
    >, U.S. District Court, Northern District of Oklahoma, October 1, 2026 (docket); news coverage:
    CBS12, October 3, 2026
  </li>
  <li>
    <a
      href="https://cdn.ca9.uscourts.gov/datastore/opinions/2014/05/12/11-17892.pdf"
      target="_blank"
      rel="external noopener noreferrer">Green v. City and County of San Francisco</a
    >, U.S. Court of Appeals for the Ninth Circuit, 2014
  </li>
  <li>
    <a
      href="http://haverhillcommunitytv.org/video/haverhill-city-council-meeting-august-11-2026"
      target="_blank"
      rel="external noopener noreferrer">Haverhill City Council meeting, August 11, 2026</a
    >, Haverhill Community TV recording
  </li>
  <li>
    <a
      href="http://haverhillcommunitytv.org/video/haverhill-license-commission-meeting-september-3-2026"
      target="_blank"
      rel="external noopener noreferrer">Haverhill License Commission meeting, September 3, 2026</a
    >, Haverhill Community TV recording (from 13:25)
  </li>
  <li>
    <a
      href="https://www.cambridgema.gov/news/2025/12/statementontheflocksafetyalprcontracttermination"
      target="_blank"
      rel="external noopener noreferrer">Statement on the Flock Safety ALPR contract termination</a
    >, City of Cambridge, December 10, 2025
  </li>
  <li>
    <a
      href="https://www.nbcchicago.com/news/local/company-violated-illinois-law-by-sharing-license-plate-data-with-customs-and-border-protection-giannoulias/3814914/"
      target="_blank"
      rel="external noopener noreferrer"
      >Company violated Illinois law by sharing license plate data with federal agency: Giannoulias</a
    >, NBC Chicago, August 25, 2025
  </li>
  <li>
    <a
      href="https://www.npr.org/2025/11/07/nx-s1-5587724/some-sanctuary-states-discover-feds-mining-local-license-plate-data"
      target="_blank"
      rel="external noopener noreferrer"
      >Some sanctuary states discover feds mining local license plate data</a
    >, NPR, November 7, 2025
  </li>
  <li>
    <a
      href="https://www.npr.org/2026/02/17/nx-s1-5612825/flock-contracts-canceled-immigration-survillance-concerns"
      target="_blank"
      rel="external noopener noreferrer"
      >Why some cities are canceling Flock license plate reader contracts</a
    >, NPR, February 17, 2026
  </li>
  <li>
    <a
      href="https://www.cbsnews.com/news/flocks-ceo-claims-its-tech-solved-1-million-crimes-data-shows-otherwise/"
      target="_blank"
      rel="external noopener noreferrer"
      >Flock's CEO claims its tech "solved" 1 million crimes last year. The company's own
      methodology undercuts that claim</a
    >, CBS News, September 30, 2026
  </li>
  <li>
    <a
      href="https://www.cnn.com/2026/07/26/us/flock-cameras-surveillance-abuse"
      target="_blank"
      rel="external noopener noreferrer"
      >Inside the growing police use and misuse of Flock's license-plate reader cameras</a
    >, CNN, July 26, 2026
  </li>
  <li>
    <a
      href="https://www.cnn.com/2026/08/26/us/flock-kentucky-police-officer-arrest"
      target="_blank"
      rel="external noopener noreferrer"
      >Police officer arrested after tracking ex-girlfriend on Flock camera system over 2,000 times</a
    >, CNN, August 26, 2026
  </li>
  <li>
    <a
      href="https://abcnews.com/US/5-indianapolis-police-officers-charged-misusing-license-plate/story?id=136696856"
      target="_blank"
      rel="external noopener noreferrer"
      >5 Indianapolis police officers charged with misusing license plate readers</a
    >, ABC News, September 24, 2026; also WFYI, same date
  </li>
  <li>
    <a
      href="https://abcnews.com/US/officer-allegedly-flock-license-plate-cameras-track-boyfriends/story?id=135418955"
      target="_blank"
      rel="external noopener noreferrer"
      >Officer allegedly used Flock license plate cameras to track boyfriend's ex-wife</a
    >, ABC News, August 6, 2026
  </li>
  <li>
    <a
      href="https://katv.com/news/local/sherwood-stop-sparked-after-flock-camera-misread-plate-by-one-letter-as-stolen-katv-news-share-inform-public-community-safety"
      target="_blank"
      rel="external noopener noreferrer"
      >Sherwood stop sparked after Flock camera misread plate by one letter as stolen</a
    >, KATV, March 18, 2026
  </li>
  <li>
    <a
      href="https://cbs12.com/news/florida/federal-judge-rules-warrantless-license-plate-reader-search-violated-fourth-amendment-flock-license-plate-reader-alpr-database-melisa-susan-kyle-oklahoma-vehicle-data-judge-sara-hill"
      target="_blank"
      rel="external noopener noreferrer"
      >Federal judge rules warrantless license-plate reader search violated Fourth Amendment</a
    >, CBS12, October 3, 2026
  </li>
  <li>
    <a
      href="https://www.wfyi.org/wfyi-news/2026-09-24/five-indianapolis-police-officers-charged-for-misusing-flock-cameras"
      target="_blank"
      rel="external noopener noreferrer"
      >Five Indianapolis police officers charged for misusing Flock cameras</a
    >, WFYI, September 24, 2026
  </li>
  <li>
    <a
      href="https://www.cnn.com/2024/02/05/us/colorado-aurora-settlement-stolen-vehicle-mixup"
      target="_blank"
      rel="external noopener noreferrer"
      >Aurora, Colorado, will pay $1.9 million settlement after officers drew weapons on Black
      family in a stolen vehicle mix-up</a
    >, CNN, February 5, 2024
  </li>
  <li>
    <a
      href="https://www.npr.org/2020/06/24/882683463/the-computer-got-it-wrong-how-facial-recognition-led-to-a-false-arrest-in-michig"
      target="_blank"
      rel="external noopener noreferrer"
      >Facial Recognition Leads To False Arrest Of Black Man In Detroit</a
    >, NPR, June 24, 2020
  </li>
  <li>
    <a
      href="https://www.aclu.org/cases/williams-v-city-of-detroit-face-recognition-false-arrest"
      target="_blank"
      rel="external noopener noreferrer">Williams v. City of Detroit</a
    >, ACLU
  </li>
  <li>
    <a
      href="https://www.npr.org/2024/12/31/nx-s1-5213674/transit-systems-ai-cameras-bus-lanes"
      target="_blank"
      rel="external noopener noreferrer"
      >Transit systems turn to AI to catch drivers who block bus lanes</a
    >, NPR, December 31, 2024
  </li>
  <li>
    <a
      href="https://www.eff.org/deeplinks/2026/07/hundreds-drone-first-responder-programs-could-soon-be-launched-across-country"
      target="_blank"
      rel="external noopener noreferrer"
      >Hundreds of Drone-as-First-Responder Programs Could Soon Be Launched Across the Country</a
    >, Electronic Frontier Foundation, July 2026
  </li>
  <li>
    <a
      href="https://www.eff.org/deeplinks/2025/09/drone-sky-could-be-tracking-your-car"
      target="_blank"
      rel="external noopener noreferrer">That Drone in the Sky Could Be Tracking Your Car</a
    >, Electronic Frontier Foundation, September 2025
  </li>
  <li>
    <a
      href="https://assets.aclu.org/live/uploads/2023/07/embargo-drones-as-first-responder-programs-final-electronic.pdf"
      target="_blank"
      rel="external noopener noreferrer">Eye-in-the-Sky Policing Needs Strict Limits</a
    >, Jay Stanley, ACLU, July 27, 2023
  </li>
  <li>
    <a
      href="https://san.com/cc/hackers-stole-a-flock-camera-heres-what-they-found-inside/"
      target="_blank"
      rel="external noopener noreferrer"
      >Hackers stole a Flock camera. Here's what they found inside</a
    >, Straight Arrow News, September 16, 2026, reporting on analysis by Wired and 404 Media
  </li>
  <li>
    <a
      href="https://www.flocksafety.com/products/flock-freeform"
      target="_blank"
      rel="external noopener noreferrer">FreeForm Search</a
    >, Flock Safety product page
  </li>
  <li>
    <a
      href="https://patents.google.com/patent/US11416545B1/en"
      target="_blank"
      rel="external noopener noreferrer"
      >U.S. Patent 11,416,545 B1, System and method for object based query of video content captured
      by a dynamic surveillance network</a
    >, Flock Group Inc, granted August 16, 2022 (Google Patents)
  </li>
  <li>
    <a
      href="https://deflockilm.org/alpr-explained/"
      target="_blank"
      rel="external noopener noreferrer"
      >ALPR, Explained: From Stolen-Car Tool to Mass Surveillance</a
    >, DeFlockILM (citizen privacy group), October 5, 2026
  </li>
  <li>
    <a
      href="https://deflockilm.org/flock-tracking-patent/"
      target="_blank"
      rel="external noopener noreferrer"
      >Flock's Own Patent Proves It Was Never 'Just a License Plate Reader'</a
    >, DeFlockILM, September 17, 2026
  </li>
</ul>
