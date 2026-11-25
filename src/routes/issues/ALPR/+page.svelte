<script lang="ts">
  import ShareButton from "$lib/ShareButton.svelte"
  import ShareMeta from "$lib/ShareMeta.svelte"
  import { formatLongDate } from "$lib/calendar"
  import { Router } from "$lib/router"

  // The title is the one `<svelte:head>` sets below, so a share card and a
  // tab name the page alike.
  const TITLE = "License Plate Readers in Haverhill"
  const sharedUrl = Router.alpr()
  const PUBLISHED: string = "2026-11-11"
  const UPDATED: string = "2026-11-25"
  const description =
    "Facts, sources, and concerns about license plate readers and other surveillance in Haverhill, and a comparison of the proposed rules."

  // The Public Safety Committee packet emailed to the author: the special
  // counsel's memo, the draft ordinance, the department's ALPR policy
  // (41.3.9), and its Flock handout. The handout (page 32) is marked by hand
  // as handed out at the 11 August 2026 Council meeting; the agenda for that
  // meeting does not include it.
  const PACKET = Router.reference("PublicSafetyLPR/ProposedOrdinanceFromHaverhillLawyers.pdf")
  const RING_4 = Router.reference("PublicSafetyLPR/Ring_4of6.pdf")
  const FLOCK = Router.reference("PublicSafetyLPR/FlockContractwithHaverhill.pdf")
  // The city's termination notices to Flock and the Mayor's release about
  // them. The file names carry spaces and an ampersand, so they are encoded.
  const HPD_MEASURES = Router.reference(
    "PublicSafetyLPR/flock-security-and-privacy-measures-hpd.pdf",
  )
  const NOTICE_OCT = Router.reference(
    `PublicSafetyLPR/${encodeURIComponent("Haverhill - Flock Termination Letter - 10.21.2026.pdf")}`,
  )
  const NOTICE_NOV = Router.reference(
    `PublicSafetyLPR/${encodeURIComponent("Haverhill-Flock-Notice-of-Termination-2026-11-23.pdf")}`,
  )
  const RELEASE_NOV = Router.reference(
    `PublicSafetyLPR/${encodeURIComponent("11.24.26 - Cancelation Update - Release.pdf")}`,
  )
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
  // Somerville's surveillance oversight ordinance as adopted (Ordinance
  // 2019-20, Code ch. 10, art. III, §§ 10-61 to 10-69) and its one amendment
  // (2022-20, which struck the body-worn camera exemption from § 10-63(b)).
  const SOMERVILLE = Router.reference("PublicSafetyLPR/Somerville-Ordinance-2019-20.pdf")
  const SOMERVILLE_2022 = Router.reference("PublicSafetyLPR/Somerville-Ordinance-2022-20.pdf")

  // The two bills side by side, in plain language. Each summary is read
  // off the section it cites; "No section on this" means none was found on
  // reading the whole bill. Page numbers are the PDF's own: the packet's
  // for the city draft, the ACLU file's for the model bill.
  const COMPARISON = [
    {
      topic: "What counts as a license plate reader",
      city: "Any system of cameras, software, databases, or related technology that reads a plate or other information about a vehicle, whether fixed, mobile, vehicle-mounted, or portable, including its software, databases, analytical tools, and alerts.",
      citySection: "§ XXX-2(A), packet page 9",
      cityPage: 9,
      aclu: "Any system or software that turns images of plates into computer-readable data. Cameras that only switch on for a specific violation, like speeding or running a red light, are not included.",
      acluSection: "Section 1(A), page 1",
      acluPage: 1,
      somerville:
        "Any device, hardware, or software that can collect or analyze audio, visual, location, biometric, or similar information linked to an identifiable person, including license plate readers, facial recognition, gunshot detection, cell site simulators, and predictive policing software. Some cameras are exempt, such as police vehicle cameras, traffic cameras, and security cameras on city buildings. Body-worn cameras were exempt until a 2022 amendment.",
      somervilleSection: "\u00a7 10-62 and \u00a7 10-63(b), pages 1 to 3",
      somervillePage: 2,
      pick: "Somerville, ACLU, and city draft combined",
      why: 'Start with Somerville\'s reach: it covers every kind of surveillance technology, not only plate readers. For plate readers, use the ACLU wording, "Any system or software that turns images of plates into computer-readable data", because it says plainly that software counts even when it is used on its own. The city draft lists software as part of a system, but the ACLU wording leaves no doubt. Then add the city\'s "whether fixed, mobile, or portable, along with its software and databases", so databases of the images are covered too. Keeping the city\'s "other vehicle information" would also cover systems that identify cars by make, color, or features.',
    },
    {
      topic: "What it can be used for",
      city: "Purposes listed in a police use policy the City Council approves, including investigating crimes, stolen vehicles, missing persons, hit-and-runs, and other law-enforcement or public-safety purposes named in that policy.",
      citySection: "§ XXX-7(B), packet pages 13 to 14",
      cityPage: 13,
      aclu: "Only checking plates against specific lists (stolen, unregistered or uninsured, uninspected, an outstanding felony warrant, a missing person, or a felony), plus parking enforcement, access to secured areas, and toll collection.",
      acluSection: "Section 2(B), pages 1 to 2",
      acluPage: 1,
      somerville:
        "Purposes and authorized uses set in a surveillance use policy the City Council approves.",
      somervilleSection: "\u00a7 10-64(b), pages 4 to 5",
      somervillePage: 4,
      pick: "ACLU model bill",
      why: "It is a closed list. The city draft allows any purpose named in a police use policy, which can be widened later without changing the ordinance. Somerville also leaves the purposes to a use policy.",
    },
    {
      topic: "What is not allowed",
      city: "Personal, political, retaliatory, discriminatory, or commercial use; harassment; tracking someone for lawful protected activity; building a pattern of someone's movements unless reasonably necessary for an authorized purpose; generalized surveillance without an authorized purpose; and selling the data or using it for advertising.",
      citySection: "§ XXX-7(C), packet page 14",
      cityPage: 14,
      aclu: "Any use not on the allowed list. For registration, insurance, and inspection checks, enforcement aimed at a group based on race, ethnicity, or income beyond its share of the population is also banned.",
      acluSection: "Section 2(A) and (C), pages 1 to 2",
      acluPage: 1,
      somerville:
        "Prohibited uses are set in the Council-approved use policy rather than listed in the ordinance. Emergency use cannot infringe the right to peacefully protest.",
      somervilleSection: "\u00a7 10-62 and \u00a7 10-64(b), pages 1 and 4",
      somervillePage: 4,
      pick: "ACLU model bill, plus the city draft's list",
      why: "The ACLU bill bans every use that is not on its allowed list. Keeping the city's named bans as well makes the most common misuses explicit. Somerville leaves prohibited uses to its use policy.",
    },
    {
      topic: "Who approves the system",
      city: "The City Council must approve buying, borrowing, accepting as a donation or trial, or expanding a system, any new data-sharing agreement, and the police use policy. A public impact report is posted 14 days before the vote, and the use policy is posted on the city's website.",
      citySection: "§ XXX-4 to XXX-6, packet pages 10 to 13",
      cityPage: 10,
      aclu: "No section on this. The bill sets the rules directly instead.",
      acluSection: "",
      acluPage: 0,
      somerville:
        "The City Council must approve acquiring or using any surveillance technology, or entering an agreement to acquire or share it, even if it is free. The impact report is public when submitted. If the Council does not act within 60 days (not counting June, July, or August), the request is approved by default.",
      somervilleSection: "\u00a7 10-65, pages 5 to 6",
      somervillePage: 5,
      pick: "Somerville and city draft combined, with more public oversight",
      why: "The City Council did vote on Flock in April 2025, but only to allow a contract longer than three years. That vote set no rules on how the cameras could be used and required no public report (Flock contract, page 72). The public discussion came in August 2026, more than four years after the first Flock order (Flock contract, pages 20 to 22). The draft's Council vote and 14-day public notice are a start. A public hearing before any approval, a public list of camera locations, and a yearly report posted where residents can read it would give residents a say before a system is in use, not after. Somerville goes further: Council approval is needed before acquiring or sharing any surveillance technology, even if it is free, the impact report is public when submitted, and the Council reviews every system each year in a public meeting. But under Somerville's rule a request is approved by default if the Council does not act within 60 days. It should be refused by default instead.",
    },
    {
      topic: "Software updates and minor changes",
      city: "Changes the Police Chief decides are minor, including software or firmware updates, need no City Council approval. They are logged and summarized in the yearly report.",
      citySection: "§ XXX-4(C), packet page 11",
      cityPage: 11,
      aclu: "No section on this. Any system that does not fully follow the bill cannot be used at all.",
      acluSection: "Section 2(D), page 2",
      acluPage: 2,
      somerville:
        "A department head can apply a patch or upgrade needed to address a threat, but cannot use any new surveillance capability until the Council approves it, unless the Mayor decides the use is unavoidable and then asks the Council for approval as soon as possible.",
      somervilleSection: "\u00a7 10-63(c)(4), page 4",
      somervillePage: 4,
      pick: "Somerville, made stronger",
      why: "Somerville comes closest: a patch can be applied, but no new surveillance capability can be used until the City Council approves it. Its exception, letting the Mayor allow use first, should be removed. Software decides what a plate reader can search for, so a software update that adds a new kind of search is not minor, even if the Police Chief decides it is. Every software or firmware update should be listed in a written public record, and any update that adds a feature or a new kind of search should need City Council approval.",
    },
    {
      topic: "How long data is kept",
      city: 'No fixed limit. Data is kept "no longer than reasonably necessary", with the actual period set in the police use policy.',
      citySection: "§ XXX-10, packet page 16",
      cityPage: 16,
      aclu: "Deleted after 48 hours, unless it is needed as evidence of a listed offense, for tolls, at another agency's sworn request for an active case, or under a warrant.",
      acluSection: "Section 3(A), pages 2 to 3",
      acluPage: 2,
      somerville:
        "No fixed limit. The use policy must state the retention period, why it is appropriate, and how data is deleted.",
      somervilleSection: "\u00a7 10-64(b)(6), page 5",
      somervillePage: 5,
      pick: "ACLU model bill",
      why: "48 hours is a fixed, short limit. The city draft and Somerville set no number, and the current police policy keeps data for 30 days (Policy 41.3.9, page 8).",
    },
    {
      topic: "Sharing with other agencies",
      city: "No automatic, unrestricted, or bulk access. Data can be shared when the law, a warrant, court order, or subpoena, or the police use policy allows it. Joining a regional or national sharing network needs City Council approval.",
      citySection: "§ XXX-11, packet pages 16 to 17",
      cityPage: 16,
      aclu: "Only specific data (one camera or area, up to 48 hours) to a Massachusetts agency or one within 25 miles that agrees not to pass it on, or to anyone with a probable cause warrant.",
      acluSection: "Section 5 and Section 1(E), pages 1 and 4",
      acluPage: 4,
      somerville:
        "The use policy must say if and how other agencies can use the data and under what legal standard. The yearly report must name each agency data was shared with and the reason.",
      somervilleSection: "\u00a7 10-64(b)(8) and \u00a7 10-66(b)(2), pages 5 and 7",
      somervillePage: 5,
      pick: "ACLU model bill and Somerville",
      why: "The ACLU bill allows only specific data, to nearby or in-state agencies that agree not to pass it on, or with a warrant. The city draft allows sharing under a police use policy. Add Somerville's rule that the yearly public report names every agency data was shared with and why, so residents can see where it went.",
    },
    {
      topic: "Vendors and third parties",
      city: "Vendor contracts must keep the city in control of its data and ban unauthorized sale, disclosure, or secondary use of it, and any use for advertising or unrelated commercial purposes. They must also require security, audit logs, notice of breaches, and return or destruction of the data when the contract ends. A vendor cannot make a material change to how data is collected, kept, used, or shared without City Council approval.",
      citySection: "§ XXX-12, packet pages 17 to 18",
      cityPage: 17,
      aclu: "A vendor running the system for the city may not share the city's data with anyone without the city's express permission, and only in ways the bill allows.",
      acluSection: "Section 5(A)(2)(a), page 4",
      acluPage: 4,
      somerville:
        "Any agreement to acquire, share, or use surveillance technology or data needs Council approval first, and the yearly report must disclose every new agreement with an outside entity. There is no list of required vendor contract terms.",
      somervilleSection: "\u00a7 10-65 and \u00a7 10-66(b)(9), pages 5 and 7",
      somervillePage: 5,
      pick: "City draft, ACLU, and Somerville combined",
      why: "Both bar vendors from sharing the city's data on their own: the city draft by banning unauthorized disclosure and secondary use, and the ACLU bill by requiring the city's express permission for any sharing. Neither names AI training. \"Secondary use\" could cover it, but the ordinance should say plainly that city data cannot be used to train AI or to build other products, because the Flock contract allowed both (Flock contract, pages 31 and 47). Add Somerville's rules that any agreement to acquire or share surveillance technology needs Council approval first, and that every new agreement is disclosed in the yearly public report.",
    },
    {
      topic: "Private plate reader cameras, like businesses or homes",
      city: "Not covered, unless the system or its data is given to the city, run for the city, or used under an agreement with the city.",
      citySection: "§ XXX-3(D), packet page 10",
      cityPage: 10,
      aclu: "Police need a warrant to demand access to a private plate reader camera or its data. They can only accept it if it is offered freely, for no payment, about a crime on that property or against its customers or employees. Private plate readers in places open to the public need a sign within 10 feet of each camera.",
      acluSection: "Section 4, pages 3 to 4",
      acluPage: 3,
      somerville:
        "Not covered. The ordinance applies to technology and data the city acquires or directs.",
      somervilleSection: "\u00a7 10-62, pages 1 to 2",
      somervillePage: 1,
      pick: "ACLU model bill",
      why: "It requires a warrant before police can demand data from a private plate reader. The city draft and Somerville do not cover private plate readers at all. Ordinary security and doorbell cameras are not covered by any of the three, which is a gap worth closing.",
      note: "Sharing footage with police: at its September 3, 2026 meeting, before voting on a license, the License Commission asked the applicant about installing cameras and whether they planned to work with the police (Haverhill Community TV recording, from 13:25). Neither bill limits police asking for ordinary security camera footage. The ACLU model's limits apply only to private plate readers, and the city draft would apply only to data once the city has it.",
    },
    {
      topic: "Immigration enforcement",
      city: "Use for federal civil immigration enforcement is banned, except as Massachusetts law (M.G.L. c. 147, § 64) allows.",
      citySection: "§ XXX-7(C)(6) and (E), XXX-8(E), XXX-9(E), packet pages 14 to 16",
      cityPage: 14,
      aclu: "No separate section. The limits on use and sharing apply to every agency.",
      acluSection: "",
      acluPage: 0,
      somerville: "No separate section.",
      somervilleSection: "",
      somervillePage: 0,
      pick: "City draft",
      why: "It is the only one of the three with explicit protections tied to Massachusetts law (M.G.L. c. 147, § 64).",
    },
    {
      topic: "Data security",
      city: '"Reasonable" safeguards, individual logins, and required training.',
      citySection: "§ XXX-13, packet page 18",
      cityPage: 18,
      aclu: "End-to-end encryption while data is stored and sent.",
      acluSection: "Section 3(C), page 3",
      acluPage: 3,
      somerville:
        "The use policy must describe safeguards against unauthorized access, including encryption and access control.",
      somervilleSection: "\u00a7 10-64(b)(5), page 5",
      somervillePage: 5,
      pick: "ACLU model bill",
      why: 'End-to-end encryption is a specific standard that can be checked. "Reasonable" safeguards cannot, and Somerville only requires the use policy to describe its safeguards.',
    },
    {
      topic: "Audits and public reporting",
      city: "Audited at least once a year, and a yearly report to the Mayor and City Council by March 1, including the number and general locations of cameras, searches, sharing, and costs.",
      citySection: "§ XXX-14, packet pages 18 to 19",
      cityPage: 18,
      aclu: "No section on this.",
      acluSection: "",
      acluPage: 0,
      somerville:
        "A yearly report for each department, public when submitted, covering how each technology was used, sharing, complaints, internal audit results and violations, whether it worked, costs, and effects on civil rights. The Council must hold a meeting on the reports by May 31 and publish its own summary.",
      somervilleSection: "\u00a7 10-66, pages 7 to 8",
      somervillePage: 7,
      pick: "Somerville, with independent audits",
      why: "Somerville's yearly report is in writing and public when submitted, names every agency data was shared with, includes internal audit results and violations, and is reviewed by the Council in a public meeting by May 31. The city draft's report goes only to the Mayor and City Council. The audits should also be done independently of the Police Department.",
    },
    {
      topic: "Emergencies",
      city: "The Police Chief can use a system without Council approval when there is an imminent threat of death, serious injury, or other substantial harm. Use must stop when the emergency ends, and the Chief must give a written report to the Mayor and Council within 90 days.",
      citySection: "§ XXX-15, packet pages 19 to 20",
      cityPage: 19,
      aclu: "No section on this.",
      acluSection: "",
      acluPage: 0,
      somerville:
        "Police can use surveillance technology in an emergency for up to 90 days. The Police Chief must report in writing to the Council within 90 days after it ends, submit an impact report, and include it in the next yearly report. Emergency use cannot infringe the right to peacefully protest.",
      somervilleSection: "\u00a7 10-62 and \u00a7 10-63(c)(1), pages 1 and 3",
      somervillePage: 3,
      pick: "Somerville and city draft combined",
      why: "If emergency use is allowed, it needs a written report to the Mayor and City Council, and that report should be available to everyone as a public record. Somerville caps emergency use at 90 days and requires a written report and an impact report afterward. The city draft requires the use to stop when the emergency ends. Use both, and also limit how often emergency use can happen. In both, the Police Chief decides when an emergency exists. The city draft's ban on using emergencies to monitor protest or religious activity, which Somerville also has, should stay.",
    },
    {
      topic: "Systems already in use",
      city: "An inventory within 180 days, and existing systems brought into line within 180 days unless the Council extends it.",
      citySection: "§ XXX-16, packet page 20",
      cityPage: 20,
      aclu: "Existing contracts that do not follow the bill must be amended or ended.",
      acluSection: "Section 2(D), page 2",
      acluPage: 2,
      somerville:
        "The Mayor had to submit a use policy to the Council for every department already using surveillance technology before the ordinance took effect, nine months after adoption.",
      somervilleSection: "\u00a7 10-64(a) and \u00a7 10-69, pages 4 and 8",
      somervillePage: 4,
      pick: "City draft, ACLU, and Somerville combined",
      why: "Keep the city draft's inventory and widen it. Within 180 days, the Police Chief would have to list every plate reader system in use, where it is, the vendor, the agreements, any data sharing, and any regional, statewide, or national databases the department can search (§ XXX-16(B), packet page 20). The inventory should cover every surveillance technology and third-party system the ordinance would affect, not only plate readers, so it would also answer questions this page could not, such as whether Haverhill uses CrimeTracer. It should be in writing and a public record. Then add the ACLU rule: contracts that do not follow the rules must be changed or ended, rather than allowing 180 days that the Council can extend. Somerville also required a Council-approved use policy for every system already in use before its ordinance took effect.",
    },
    {
      topic: "Evidence collected against the rules",
      city: "The ordinance creates no rule about evidence in court.",
      citySection: "§ XXX-17(F), packet page 21",
      cityPage: 21,
      aclu: "Data collected or shared in violation cannot be used as evidence, except to help a defendant.",
      acluSection: "Section 6, pages 4 to 5",
      acluPage: 4,
      somerville:
        "Data collected in violation cannot be used as evidence in any proceeding under the city's jurisdiction.",
      somervilleSection: "\u00a7 10-67(b), page 8",
      somervillePage: 8,
      pick: "ACLU model bill and Somerville",
      why: "Both keep evidence collected in violation out of court, which gives the rules real consequences. The city draft creates no rule about evidence.",
    },
    {
      topic: "If the rules are broken",
      city: "Discipline for city staff and contract remedies for vendors. The draft states it gives residents no right to sue.",
      citySection: "§ XXX-18(D) to (F), packet page 21",
      cityPage: 21,
      aclu: "A person harmed can sue for actual damages or $1,000, plus lawyer's fees.",
      acluSection: "Section 7, page 5",
      acluPage: 5,
      somerville:
        "Anyone can go to court to stop a violation or have it declared unlawful; the ordinance does not provide for money damages. City employees who report violations are protected as whistleblowers.",
      somervilleSection: "\u00a7 10-67(c) and (e), page 8",
      somervillePage: 8,
      pick: "ACLU model bill and Somerville",
      why: "Under the ACLU bill a person harmed can sue for damages, and under Somerville anyone can go to court to stop a violation, and city employees who report violations are protected. Together, enforcement does not depend only on the city disciplining its own staff or its vendors. That matters for a system residents cannot opt out of: anyone who drives past a camera is recorded. Somerville's whistleblower protection for city employees who report violations should stay in any Haverhill ordinance, so the people most likely to see misuse can report it safely.",
    },
  ]
</script>

<ShareMeta url={sharedUrl} title={TITLE} {description} />

<svelte:head>
  <title>{TITLE}</title>
</svelte:head>

<h1>License Plate Readers in Haverhill</h1>

<!-- Fixed dates, set by hand: PUBLISHED when the page went up, UPDATED when
     its content last changed. "Updated" shows only once it differs. -->
<p class="m-0 mt-1 flex flex-wrap items-baseline gap-x-2 text-sm text-slate-600">
  <span class="font-semibold text-slate-700">Published</span>
  <span>{formatLongDate(PUBLISHED)}</span>
  {#if UPDATED !== PUBLISHED}
    <span aria-hidden="true">·</span>
    <span class="font-semibold text-slate-700">Updated</span>
    <span>{formatLongDate(UPDATED)}</span>
  {/if}
  <span aria-hidden="true">·</span>
  <span
    >Prepared by <a href="https://www.aholdengouveia.name" target="_blank" rel="noopener noreferrer"
      >Adrianna Holden-Gouveia<span class="sr-only">, opens in a new tab</span></a
    ></span
  >
</p>

<div class="mt-2">
  <ShareButton url={sharedUrl} text={TITLE} />
</div>

<!-- A running log of changes after first publication, newest first. Each
     change is also marked with its date in the section it touched. -->
<aside class="mt-4 rounded border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
  <p class="m-0 font-semibold text-slate-800">Updates to this page</p>
  <p class="m-0 mt-1">
    I update this page as I find or receive new information. Each change is marked with its date in
    the section it affects.
  </p>
  <ul class="mt-1 mb-0">
    <li>
      <strong>November 25, 2026:</strong> I added new information shared by the City of Haverhill: the
      city's termination notices to Flock (October 26 and November 23, 2026), the Mayor's November 24,
      2026 press release, and the Police Department's statement of new Flock safeguards. I also added
      new news reporting, including Lowell's closed-door vote to turn its Flock cameras back on, and Somerville's
      surveillance ordinance to the comparison.
    </li>
  </ul>
</aside>

<p>
  Privacy matters to everyone, because you don't know who is collecting your data or who is looking
  at it. Blind trust in a system, and hoping it will do the right thing, has historically led to a
  lot of problems. It is better to have rules on the books, so it is clear what is and is not
  allowed no matter who is in charge. Third-party companies should not be making money off our data,
  especially when we have no say in how it is collected or what it is used for. Selling data is not
  the only way to make money from it: data used to train AI is valuable, and a contract can allow it
  without counting it as selling (see <a href="#vendor-software">The Vendor Controls the Software</a
  >). Nationwide mass surveillance is wrong, and we should not take part in it, no matter which
  company is doing it.
</p>

<p>
  This is not only about Flock. Haverhill has canceled its Flock contract, but the way that contract
  came about, without public notice or rules on use, could happen again (see <a
    href="#added-without-notice">Added Without Oversight or Notice</a
  >). Other vendors and third parties can collect the same kind of data, so the same problems apply
  to whatever comes next.
</p>

<p>
  This page has three goals. The first is to lay out the facts about license plate readers and other
  surveillance in Haverhill, with a source for each one. The second is to explain the concerns and
  the questions the city has not yet answered. The third is to compare the proposed rules, so
  residents can form their own opinion and take part before the city decides on an ordinance.
</p>

<h2>What ALPR Is and How It Works</h2>

<!-- The department's own definition, quoted exactly, with its source. -->
<blockquote class="my-4 ml-2 border-l-4 border-slate-300 pl-4 text-slate-800 sm:ml-6">
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
    rel="external noopener noreferrer"
    >ALPR, Explained<span class="sr-only">, opens in a new tab</span></a
  >, October 5, 2026), written by a citizen privacy group in North Carolina.
</p>

<h2>Why the City Wants It</h2>

<!-- The department's stated purpose, from its handout to the Council. -->
<blockquote class="my-4 ml-2 border-l-4 border-slate-300 pl-4 text-slate-800 sm:ml-6">
  <p>
    "The Haverhill Police Department utilizes Flock Safety technology as an investigative tool to
    assist officers and detectives in solving crimes, locating vehicles associated with
    investigations, developing investigative leads, and protecting the community."
  </p>
  <footer>
    Haverhill Police Department, <a href="{PACKET}#page=32"
      >Flock Safety Technology: Purpose, Safeguards, Accountability &amp; Community Questions</a
    >, marked by hand "Packet handed out @ mtg 8.11.26". The City Council agenda for August 11, 2026
    lists only the Mayor's request for the Acting Deputy Police Chief to discuss Flock (item 5.1,
    <a
      href="https://media-001-us.cdn.govstack.com/haverhillma-003-us/media/oqypskkh/full-agenda-8112026.pdf"
      target="_blank"
      rel="external noopener noreferrer">agenda<span class="sr-only">, opens in a new tab</span></a
    >, page 1) and does not include the handout.
  </footer>
</blockquote>

<h2 id="other-surveillance">Other Surveillance</h2>

<p>
  License plate readers are not the only surveillance technology in use in Haverhill. Some of it was
  chosen by the city itself, such as the Ring partnership and the cameras at Haverhill's schools.
  Some is available to every police department in Massachusetts through a state contract, and I
  could not find records showing whether or how often Haverhill uses it.
</p>

<!-- Statewide versus Haverhill, per item, from: Atlas CSV rows AOS000122
     (PredPol) and AOS012874 (CrimeTracer); the Ring PDFs. -->
<ul>
  <li>
    <strong>PredPol (now Geolitica), predictive policing.</strong> Haverhill. Subscription began
    January 6, 2014 (<a
      href="https://cdn.muckrock.com/foia_files/2018/11/19/HAVERHILL_PredPol_SaaS_Agreement_2016.12.08_-_renewal_contract.pdf"
      target="_blank"
      rel="external noopener noreferrer"
      >PredPol renewal agreement<span class="sr-only">, opens in a new tab</span></a
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
      rel="external noopener noreferrer"
      >SoundThinking<span class="sr-only">, opens in a new tab</span></a
    >). The company says every police department in the state can use it with no opt-in required.
    Departments that also share their own records with it sign an agreement with the State Police
    and choose what to share. I found no record of whether Haverhill has signed one or how often it
    uses the system (<a
      href="https://www.cambridgeday.com/2025/08/19/crimetracer-shares-cambridge-and-somerville-police-data-statewide-and-with-ice-until-2023/"
      target="_blank"
      rel="external noopener noreferrer"
      >Cambridge Day, August 19, 2025<span class="sr-only">, opens in a new tab</span></a
    >).
  </li>
  <li>
    <strong>City surveillance cameras.</strong> Haverhill. The Police Department lists "city
    surveillance cameras" among the evidence it uses alongside Flock (<a
      aria-label="Public Safety Committee packet, page 33"
      href="{PACKET}#page=33">packet</a
    >, page 33), and its case list mentions "city camera footage" (<a
      aria-label="Public Safety Committee packet, page 44"
      href="{PACKET}#page=44">packet</a
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
      rel="external noopener noreferrer"
      >on MuckRock<span class="sr-only">, opens in a new tab</span></a
    >.
  </li>
</ul>

<!-- ShotSpotter is not in use in Haverhill as far as any record found shows.
     It is noted for the ordinance: limits on gunshot detection could be
     written in alongside ALPR. -->
<p>
  <strong>A note on ShotSpotter.</strong> ShotSpotter, also made by SoundThinking, uses microphones
  placed around a city to listen for gunshots. I found no record of it being used in Haverhill.
  Where it has been used, it has had serious problems. In Chicago, from January 2020 to May 2021,
  police recorded an outcome for 41,830 ShotSpotter alerts, and only 4,556 of them (9.1%) found
  evidence of a gun-related crime (<a
    href="https://igchicago.org/wp-content/uploads/2023/08/Chicago-Police-Departments-Use-of-ShotSpotter-Technology.pdf#page=4"
    target="_blank"
    rel="external noopener noreferrer"
    >Chicago Office of Inspector General, August 24, 2021, page 4<span class="sr-only"
      >, opens in a new tab</span
    ></a
  >). Critics also said the sensors were placed mostly in Black and Latino neighborhoods, and
  Chicago let its ShotSpotter contract expire in 2024 (<a
    href="https://www.npr.org/2024/10/20/nx-s1-5131546/researchers-are-skeptical-of-this-gunfire-detection-system-chicago-no-longer-uses-it"
    target="_blank"
    rel="external noopener noreferrer"
    >NPR, October 20, 2024<span class="sr-only">, opens in a new tab</span></a
  >). Haverhill should not consider adding it, and the ordinance should prohibit its use.
</p>

<!-- More on each goes here. -->

<h2>Current Policies</h2>

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
  >). It lists the uses allowed (<a
    aria-label="Public Safety Committee packet, page 48"
    href="{PACKET}#page=48">page 3</a
  >), keeps data that is not evidence for 30 days (<a
    aria-label="Public Safety Committee packet, page 53"
    href="{PACKET}#page=53">page 8</a
  >), and requires audits inside the department at least every three months (<a
    aria-label="Public Safety Committee packet, page 52"
    href="{PACKET}#page=52">page 7</a
  >).
</p>

<p>
  <strong>Update, November 5, 2026:</strong> After months of public concern, the Police Department
  released a statement of new Flock safeguards, linked from the city's announcement that it was
  canceling the Flock contract (<a
    href="https://www.haverhillma.gov/news/posts/city-of-haverhill-canceling-flock-safety-contract/"
    target="_blank"
    rel="external noopener noreferrer"
    >City of Haverhill, November 5, 2026<span class="sr-only">, opens in a new tab</span></a
  >). The department says it has "reduced the historical data retrieval period to a maximum of 14
  days", is "restricting access to personnel with an established operational need", and that
  "automatic sharing of camera data with other communities and outside agencies has been
  discontinued". It also says an October 2026 audit "found no evidence of officer misuse or
  unauthorized access" (<a href={HPD_MEASURES}
    >Haverhill Police Department, Flock Safety Security and Privacy Measures</a
  >).
</p>

<p>Adding oversight now is a step, but these measures leave large gaps:</p>

<ul>
  <li>
    <strong>They are the department's own choices, not rules.</strong> None of them is in an
    ordinance, and the department can change its own policy at any time (<a
      aria-label="Public Safety Committee packet, page 54"
      href="{PACKET}#page=54">Policy 41.3.9, page 9</a
    >).
  </li>
  <li>
    <strong>The department checks itself.</strong> The audit that found no misuse was the department's
    own, and the statement does not say who did it, what was checked, or what was found. No audit report
    is public.
  </li>
  <li>
    <strong>A search reason is only as good as what is typed in.</strong> The statement points to
    the requirement to give a reason for every search, but an officer can type a false reason (see
    <a href="#enforcement">Enforcement and Verification</a>).
  </li>
  <li>
    <strong>Limiting what can be retrieved is not the same as deleting it.</strong> The statement
    limits how far back officers can search to 14 days. It does not say the data is deleted any
    sooner. The written policy still keeps data that is not evidence for 30 days (<a
      aria-label="Public Safety Committee packet, page 53"
      href="{PACKET}#page=53">Policy 41.3.9, page 8</a
    >).
  </li>
  <li>
    <strong>Sharing was happening before.</strong> Ending "automatic sharing of camera data with other
    communities and outside agencies" means that sharing was in place until now. The statement does not
    say who it was shared with or for how long, and other agencies' requests are now approved by the department
    itself.
  </li>
  <li>
    <strong>Nothing covers the vendor.</strong> The statement says nothing about software updates,
    the vendor's use of data to train AI, or anything else the vendor controls (see
    <a href="#vendor-software">The Vendor Controls the Software</a>).
  </li>
</ul>

<h3>Massachusetts Law</h3>

<p class="text-sm text-slate-600">
  These apply across Massachusetts, not only in Haverhill. Sources: <a
    href="https://caselaw.findlaw.com/court/spr-jud-crt-mas-bar/2060202.html"
    target="_blank"
    rel="external noopener noreferrer"
    >Commonwealth v. McCarthy<span class="sr-only">, opens in a new tab</span></a
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
      rel="external noopener noreferrer"
      >Commonwealth v. McCarthy<span class="sr-only">, opens in a new tab</span></a
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
  Flock came from Flock. The packet linked on this page is the one sent out before the Public Safety
  Committee meeting of November 12, 2026, with private material removed; I could not find a public
  record of it to link to instead. The department's handout relies on "Flock's own current policy" (<a
    href="{PACKET}#page=33">packet page 33</a
  >), and the packet included a Flock marketing guide for councils (packet pages 24 to 29, not
  reproduced here because Flock lists it as private and not for sharing). That guide tells councils
  "LPR is not a 'search' under the Fourth Amendment" (packet page 28), but a federal judge has since
  ruled that a warrantless Flock search was one (<a
    href="https://www.courtlistener.com/docket/73367327/united-states-v-kyle/"
    target="_blank"
    rel="external noopener noreferrer"
    >United States v. Kyle<span class="sr-only">, opens in a new tab</span></a
  >). It says federal agencies are excluded from Flock's nationwide network (packet page 27), but
  Illinois' Secretary of State found that Flock had let U.S. Customs and Border Protection access
  cameras on Illinois roads, against state law (<a
    href="https://www.nbcchicago.com/news/local/company-violated-illinois-law-by-sharing-license-plate-data-with-customs-and-border-protection-giannoulias/3814914/"
    target="_blank"
    rel="external noopener noreferrer"
    >NBC Chicago, August 25, 2025<span class="sr-only">, opens in a new tab</span></a
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
    rel="external noopener noreferrer"
    >U.S. Constitution, Fourth Amendment<span class="sr-only">, opens in a new tab</span></a
  >). Courts have not settled whether searching a license plate database is a search that needs a
  warrant (<a
    href="https://www.congress.gov/crs_external_products/IF/HTML/IF13068.html"
    target="_blank"
    rel="external noopener noreferrer"
    >Congressional Research Service, July 2025<span class="sr-only">, opens in a new tab</span></a
  >). In October 2026, a federal judge in Oklahoma ruled that a deputy's search of a month of one
  car's location history in Flock's database, without a warrant, violated the Fourth Amendment, and
  called the system "a type of indiscriminate mass surveillance" (<a
    href="https://www.courtlistener.com/docket/73367327/united-states-v-kyle/"
    target="_blank"
    rel="external noopener noreferrer"
    >United States v. Kyle<span class="sr-only">, opens in a new tab</span></a
  >, N.D. Okla.;
  <a
    href="https://cbs12.com/news/florida/federal-judge-rules-warrantless-license-plate-reader-search-violated-fourth-amendment-flock-license-plate-reader-alpr-database-melisa-susan-kyle-oklahoma-vehicle-data-judge-sara-hill"
    target="_blank"
    rel="external noopener noreferrer"
    >CBS12, October 3, 2026<span class="sr-only">, opens in a new tab</span></a
  >). In Massachusetts, the Supreme Judicial Court has said that enough cameras in enough places
  would be a search (<a
    href="https://caselaw.findlaw.com/court/spr-jud-crt-mas-bar/2060202.html"
    target="_blank"
    rel="external noopener noreferrer"
    >Commonwealth v. McCarthy<span class="sr-only">, opens in a new tab</span></a
  >, 2020).
</p>

<p>
  How much plate readers help is also not well measured. The Congressional Research Service found no
  public data on how often they are used or how they contribute to cases (<a
    href="{CRS_REPORT}#page=2">Congressional Research Service, R48160</a
  >, page 2). The department's case list is a selection it chose, and it does not say how many
  searches led nowhere.
</p>

<p>
  Flock's CEO has said "Over a million cases were solved last year." When CBS News asked how that
  was counted, a Flock spokesperson said the technology "supported approximately 1 million
  investigations and incidents", including "investigative leads, cross-jurisdictional assistance,
  searches conducted during active investigations, and other Flock deployments" (<a
    href="https://www.cbsnews.com/news/flocks-ceo-claims-its-tech-solved-1-million-crimes-data-shows-otherwise/"
    target="_blank"
    rel="external noopener noreferrer"
    >CBS News, September 30, 2026<span class="sr-only">, opens in a new tab</span></a
  >). Being used in 1 million cases is not the same as solving 1 million cases, and the two should
  not be confused. A search that turns up nothing still counts as being "used".
</p>

<p>
  The research that does exist is mixed. The best way to deal with crime is to prevent it in the
  first place, but the studies found little sign that plate readers do that either. A review by the
  National Policing Institute found:
</p>

<blockquote class="my-4 ml-2 border-l-4 border-slate-300 pl-4 text-slate-800 sm:ml-6">
  "Lum and colleagues (2011) found no reduction in auto theft or crime generally when ALPR-equipped
  patrols were assigned to hot spots. Taylor, Koper, and Woods (2012) found more stolen vehicle
  recoveries and auto theft arrests, but no drop in theft itself. A related quasi-randomized test
  found little evidence that displaying LPRs added to the deterrent value of patrol (Koper et al.,
  2022). All were part of a broader NIJ-funded evaluation of LPR cost-benefit effectiveness (Koper
  et al., 2018), the most comprehensive assessment of the technology to date." (<a
    href="https://www.policinginstitute.org/infocus/alpr-backlash-what-agencies-need-to-know/"
    target="_blank"
    rel="external noopener noreferrer"
    >National Policing Institute, August 27, 2026<span class="sr-only">, opens in a new tab</span
    ></a
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
  <strong>What to know:</strong> One photo of a car on a public road is generally not a search. A record
  of where a car goes over days or weeks is different. Under the "mosaic" idea, each location on its own
  shows little, but enough of them together show where someone lives, works, worships, sees a doctor,
  and spends the night.
</p>

<p>
  The Supreme Court used this reasoning in 2018, in Carpenter v. United States. Police had collected
  127 days of a man's phone location records from his phone company without a warrant. The Court
  said that "127 days [of cell-site data] provides an all-encompassing record of the [cell phone]
  holder's whereabouts", and ruled that police need a warrant for those records, even though the
  phone company, not the man, held them (<a
    href="https://www.congress.gov/crs_external_products/IF/HTML/IF13068.html"
    target="_blank"
    rel="external noopener noreferrer"
    >Congressional Research Service, July 2025<span class="sr-only">, opens in a new tab</span></a
  >). In other words, information about where you go can still be private when a company holds it,
  if there is enough of it.
</p>

<p>
  Courts compare plate readers to phone tracking because both record where a person goes,
  automatically, without the person doing anything, and both are held by someone else. A car does
  not go everywhere a phone does, and some courts have found plate data less revealing for that
  reason (<a
    href="https://www.congress.gov/crs_external_products/IF/HTML/IF13068.html"
    target="_blank"
    rel="external noopener noreferrer"
    >Congressional Research Service, July 2025<span class="sr-only">, opens in a new tab</span></a
  >). Massachusetts' highest court still applied the same reasoning to plate readers in
  <a
    href="https://caselaw.findlaw.com/court/spr-jud-crt-mas-bar/2060202.html"
    target="_blank"
    rel="external noopener noreferrer"
    >Commonwealth v. McCarthy<span class="sr-only">, opens in a new tab</span></a
  >: enough cameras in enough places would be a search.
</p>

<p>
  This matters to everyone, not only people suspected of a crime. A network that records every car
  that passes builds this kind of record about all of us, and tracking people in this much detail
  without a warrant is concerning no matter who is doing it.
</p>

<h3>Facial Recognition</h3>

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
  never be the only evidence placing someone somewhere (see
  <a href="#additions">Additions I Would Suggest</a>).
</p>

<p>
  The limit is in the software, not the hardware. A plate reader is a camera, and what it looks for
  is decided by the vendor's software. When reporters at Wired and 404 Media examined the software
  from a stolen Flock camera, they found it already detects people who enter the frame and records
  where they appear, and that the camera receives remote updates. They found no evidence of facial
  recognition (<a
    href="https://san.com/cc/hackers-stole-a-flock-camera-heres-what-they-found-inside/"
    target="_blank"
    rel="external noopener noreferrer"
    >Straight Arrow News, September 16, 2026<span class="sr-only">, opens in a new tab</span></a
  >). Flock also already sells a search for people by description, such as "man in blue shirt and
  cowboy hat", on its video cameras, and says it does not work on its plate readers (<a
    href="https://www.flocksafety.com/products/flock-freeform"
    target="_blank"
    rel="external noopener noreferrer"
    >Flock Safety, FreeForm Search<span class="sr-only">, opens in a new tab</span></a
  >). Because these are software choices, a vendor update could extend a plate reader toward
  searching for people, or toward facial recognition, without any new cameras being installed (see
  <a href="#vendor-software">The Vendor Controls the Software</a>). Flock's own patent describes
  searching camera footage for matching faces (<a
    href="https://patents.google.com/patent/US11416545B1/en"
    target="_blank"
    rel="external noopener noreferrer"
    >U.S. Patent 11,416,545<span class="sr-only">, opens in a new tab</span></a
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
  >), and the department can change the policy itself (<a
    aria-label="Public Safety Committee packet, page 54"
    href="{PACKET}#page=54">page 9</a
  >). Elsewhere, federal agencies have searched local plate data in sanctuary states, potentially
  for immigration enforcement (<a
    href="https://www.npr.org/2025/11/07/nx-s1-5587724/some-sanctuary-states-discover-feds-mining-local-license-plate-data"
    target="_blank"
    rel="external noopener noreferrer"
    >NPR, November 7, 2025<span class="sr-only">, opens in a new tab</span></a
  >).
</p>

<p>
  The five-year Flock order form the Police Chief signed in 2024 includes "Nationwide Network (LP
  Lookup Only)", which "Allows agencies to look up license plates on all cameras opted in to the
  nationwide Flock network" (<a href="{FLOCK}#page=70">Flock contract, page 70</a>). The Police
  Department told the City Council on August 11, 2026 that Haverhill was not opted in (<a
    href="http://haverhillcommunitytv.org/video/haverhill-city-council-meeting-august-11-2026"
    target="_blank"
    rel="external noopener noreferrer"
    >Haverhill Community TV recording<span class="sr-only">, opens in a new tab</span></a
  >). The records give no way to confirm that either way, and no limits on sharing were discussed
  with residents before the cameras went up. That is why written limits in the ordinance matter. The
  city draft would require a City Council vote before joining any regional or national sharing
  network (<a href="{PACKET}#page=16">§ XXX-11</a>, packet pages 16 to 17), and the ACLU model bill
  would limit sharing further (see the <a href="#comparison">comparison below</a>).
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
    rel="external noopener noreferrer"
    >International Association of Chiefs of Police, March 2018<span class="sr-only"
      >, opens in a new tab</span
    ></a
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
    rel="external noopener noreferrer">KATV<span class="sr-only">, opens in a new tab</span></a
  >). More examples are under <a href="#additions">Additions I Would Suggest</a>.
</p>

<h3>Potential for Abuse</h3>

<p>
  Plate data shows where people go: doctors, places of worship, protests, and homes. The judge in
  United States v. Kyle pointed to visits to medical providers, lawyers, and fertility clinics as
  examples of what a month of plate data can reveal (<a
    href="https://cbs12.com/news/florida/federal-judge-rules-warrantless-license-plate-reader-search-violated-fourth-amendment-flock-license-plate-reader-alpr-database-melisa-susan-kyle-oklahoma-vehicle-data-judge-sara-hill"
    target="_blank"
    rel="external noopener noreferrer"
    >CBS12, October 3, 2026<span class="sr-only">, opens in a new tab</span></a
  >). The current rules depend on the department checking itself, through internal audits (see
  <a href="#enforcement">Enforcement and Verification</a>). Elsewhere, federal agencies have
  searched local plate data in sanctuary states, potentially for immigration enforcement (<a
    href="https://www.npr.org/2025/11/07/nx-s1-5587724/some-sanctuary-states-discover-feds-mining-local-license-plate-data"
    target="_blank"
    rel="external noopener noreferrer"
    >NPR, November 7, 2025<span class="sr-only">, opens in a new tab</span></a
  >).
</p>

<p>
  Officers have also used Flock to stalk and harass people. By July 2026 there were at least two
  dozen cases of officers resigning or being arrested for using Flock to track romantic interests (<a
    href="https://www.cnn.com/2026/07/26/us/flock-cameras-surveillance-abuse"
    target="_blank"
    rel="external noopener noreferrer"
    >CNN, July 26, 2026<span class="sr-only">, opens in a new tab</span></a
  >). Some examples:
</p>

<ul>
  <li>
    A Kentucky officer was arrested after allegedly tracking an ex-girlfriend through Flock more
    than 2,000 times (<a
      href="https://www.cnn.com/2026/08/26/us/flock-kentucky-police-officer-arrest"
      target="_blank"
      rel="external noopener noreferrer"
      >CNN, August 26, 2026<span class="sr-only">, opens in a new tab</span></a
    >).
  </li>
  <li>
    Five Indianapolis officers were charged with misusing Flock, mainly to search for ex-partners
    and people they knew. One was charged with stalking after allegedly searching a woman's plate
    more than 170 times and leaving a note on her car (<a
      href="https://abcnews.com/US/5-indianapolis-police-officers-charged-misusing-license-plate/story?id=136696856"
      target="_blank"
      rel="external noopener noreferrer"
      >ABC News, September 24, 2026<span class="sr-only">, opens in a new tab</span></a
    >;
    <a
      href="https://www.wfyi.org/wfyi-news/2026-09-24/five-indianapolis-police-officers-charged-for-misusing-flock-cameras"
      target="_blank"
      rel="external noopener noreferrer"
      >WFYI, September 24, 2026<span class="sr-only">, opens in a new tab</span></a
    >).
  </li>
  <li>
    A Mooresville, North Carolina officer was arrested after allegedly using Flock 31 times to track
    her boyfriend's ex-wife, listing most of the searches as traffic violations (<a
      href="https://abcnews.com/US/officer-allegedly-flock-license-plate-cameras-track-boyfriends/story?id=135418955"
      target="_blank"
      rel="external noopener noreferrer"
      >ABC News, August 6, 2026<span class="sr-only">, opens in a new tab</span></a
    >).
  </li>
</ul>

<p>
  Many of these cases were caught by audits, which shows audits matter (<a
    href="https://www.cnn.com/2026/08/26/us/flock-kentucky-police-officer-arrest"
    target="_blank"
    rel="external noopener noreferrer"
    >CNN, August 26, 2026<span class="sr-only">, opens in a new tab</span></a
  >;
  <a
    href="https://abcnews.com/US/officer-allegedly-flock-license-plate-cameras-track-boyfriends/story?id=135418955"
    target="_blank"
    rel="external noopener noreferrer"
    >ABC News, August 6, 2026<span class="sr-only">, opens in a new tab</span></a
  >). The Mooresville case also shows that the reason an officer types in for a search can be false,
  so an audit that only checks that a reason was given is not enough.
</p>

<h3>Overreach</h3>

<p>
  Haverhill had 19 Flock cameras at the city's entry and exit points (<a
    href="https://newslinklive.com/2026/08/13/haverhill-moves-to-regulate-use-of-flock-cameras-amid-surveillance-concerns/"
    target="_blank"
    rel="external noopener noreferrer">Newslink<span class="sr-only">, opens in a new tab</span></a
  >;
  <a
    href="https://whav.net/2026/08/11/haverhill-council-debates-security-vs-surveillance-cameras/"
    target="_blank"
    rel="external noopener noreferrer">WHAV<span class="sr-only">, opens in a new tab</span></a
  >). Massachusetts' highest court has said that enough cameras in enough places would be a search (<a
    href="https://caselaw.findlaw.com/court/spr-jud-crt-mas-bar/2060202.html"
    target="_blank"
    rel="external noopener noreferrer"
    >Commonwealth v. McCarthy<span class="sr-only">, opens in a new tab</span></a
  >). Other cities, including Cambridge, have canceled their Flock contracts over these concerns (<a
    href="https://www.npr.org/2026/02/17/nx-s1-5612825/flock-contracts-canceled-immigration-survillance-concerns"
    target="_blank"
    rel="external noopener noreferrer"
    >NPR, February 17, 2026<span class="sr-only">, opens in a new tab</span></a
  >).
</p>

<p>
  Haverhill has now canceled its Flock contract (<a
    href="https://www.haverhillma.gov/news/posts/city-of-haverhill-canceling-flock-safety-contract"
    target="_blank"
    rel="external noopener noreferrer"
    >City of Haverhill, November 5, 2026<span class="sr-only">, opens in a new tab</span></a
  >), but that does not fix the underlying problem. The cameras were added, renewed, and given a
  five-year term out of public view, and residents learned about them years later (see
  <a href="#added-without-notice">Added Without Oversight or Notice</a>). It should not have taken a
  public outcry for this to come to light. Without written rules requiring public notice and a vote
  first, the next system, from any vendor, could be added the same way.
</p>

<h3 id="enforcement">Enforcement and Verification</h3>

<p>
  Under the current policy, audits are done inside the Police Department, at least every three
  months, by the ALPR Administrator (the Captain of the Criminal Investigations Division), and the
  audit records are kept by the department (<a href="{PACKET}#page=49">Policy 41.3.9</a>, pages 4
  and 7). The policy does not require any public report, so the only way for a resident to check
  that it is being followed is a public records request (<a
    aria-label="Public Safety Committee packet, page 54"
    href="{PACKET}#page=54">page 9</a
  >). The policy also lists what the Flock contract "shall require" of the company (<a
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
    rel="external noopener noreferrer"
    >City of Cambridge, December 10, 2025<span class="sr-only">, opens in a new tab</span></a
  >).
</p>

<!-- More goes here. -->

<h3 id="added-without-notice">Added Without Oversight or Notice</h3>

<p>
  The Flock cameras were in place for years before residents were asked about them. The Flock
  contract's own attachments show the steps:
</p>

<ul>
  <li>
    <strong>January 2022:</strong> the Police Chief signed a Flock order form for 8 cameras, for 24
    months, renewing automatically unless canceled (<a
      aria-label="Flock contract, page 20"
      href="{FLOCK}#page=20">page 20</a
    >,
    <a aria-label="Flock contract, page 22" href="{FLOCK}#page=22">page 22</a>,
    <a aria-label="Flock contract, page 33" href="{FLOCK}#page=33">page 33</a>). The department's
    current plate reader policy took effect in December 2022 (<a href="{PACKET}#page=46"
      >Policy 41.3.9</a
    >, page 1). The city's own account gives a different start. Its announcement that it was
    canceling the contract says "Since 2023, the Haverhill Police Department has used Flock cameras"
    (<a
      href="https://www.haverhillma.gov/news/posts/city-of-haverhill-canceling-flock-safety-contract/"
      target="_blank"
      rel="external noopener noreferrer"
      >City of Haverhill, November 5, 2026<span class="sr-only">, opens in a new tab</span></a
    >), but the order signed in January 2022 is attached both to the 2025 contract and to the city's
    October 2026 termination notice (<a href="{NOTICE_OCT}#page=4">termination notice, Exhibit A</a
    >). The records do not show when the first cameras were installed, but the city's documents
    contradict each other, and contradictions like this continue to erode public trust in how open
    the city is being.
  </li>
  <li>
    <strong>January 2024:</strong> the Police Chief signed a new order form for 11 cameras with a
    60-month (five-year) term, $137,500 in total (<a
      aria-label="Flock contract, page 66"
      href="{FLOCK}#page=66">page 66</a
    >,
    <a aria-label="Flock contract, page 68" href="{FLOCK}#page=68">page 68</a>).
  </li>
  <li>
    <strong>April 2025:</strong> the City Council's first vote on Flock, more than three years after
    the first order. It only allowed the Mayor to sign a contract longer than three years. The order
    gives no reason for the longer term and sets no rules on use (<a
      aria-label="Flock contract, page 72"
      href="{FLOCK}#page=72">page 72</a
    >).
  </li>
  <li>
    <strong>June 2025:</strong> the city signed a $110,000 contract running through December 31,
    2029, which can be "extended, in writing, at the sole discretion of the City" (<a
      href="{FLOCK}#page=3">page 3</a
    >).
  </li>
  <li>
    <strong>August 2026:</strong> the first public discussion. The City Council agenda for August 11
    lists only the Mayor's request for the Acting Deputy Police Chief to "discuss Flock cameras and
    software utilized by the Haverhill Police Department for license plate monitoring" (item 5.1,
    <a
      href="https://media-001-us.cdn.govstack.com/haverhillma-003-us/media/oqypskkh/full-agenda-8112026.pdf"
      target="_blank"
      rel="external noopener noreferrer">agenda<span class="sr-only">, opens in a new tab</span></a
    >, page 1). The department's handout is marked by hand as handed out at that meeting, but it is
    not in the published agenda (<a
      aria-label="Public Safety Committee packet, page 32"
      href="{PACKET}#page=32">packet page 32</a
    >;
    <a
      href="https://whav.net/2026/08/11/haverhill-council-debates-security-vs-surveillance-cameras/"
      target="_blank"
      rel="external noopener noreferrer">WHAV<span class="sr-only">, opens in a new tab</span></a
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
  "April X, 2019" has the same text (<a
    aria-label="Ring records, part 4, page 4"
    href="{RING_4}#page=4">page 4</a
  >), Ring's public relations coordinator is listed as a media contact, and it ends with Ring's own
  claim that "one Los Angeles neighborhood saw a 55 percent decrease in home break-ins", with no
  independent source (<a href="{RING_4}#page=2">page 2</a>).
</p>

<p>
  <strong>Update, November 25, 2026:</strong> The city's own lawyers have now said the Flock
  agreement was unlawful. In a termination notice to Flock dated October 26, 2026, they wrote:
  "statutory deficiencies have been discovered which make the agreement unlawful under the laws of
  the Commonwealth of Massachusetts as it was not lawfully procured, not executed by an individual
  with authority to bind the City, and is for an indefinite period which was not approved by City
  Council." They added: "for contracts to be enforceable against the City, the Mayor must be the
  signatory on behalf of the City; not the Police Chief, as was done here." (<a
    href="{NOTICE_OCT}#page=1">October 26, 2026 termination notice</a
  >, page 1)
</p>

<p>The October notice and the 2025 contract do not attach the same agreements:</p>

<ul>
  <li>
    The October notice lists agreements "executed on January 25, 2022, March 29, 2023, and April 2,
    2024" (<a href="{NOTICE_OCT}#page=1">page 1</a>). Its attachments are the January 2022 order for
    8 cameras, an order for 3 more cameras signed by the Police Chief and Flock on March 29, 2023 (<a
      href="{NOTICE_OCT}#page=27">page 27</a
    >), and an order for 7 cameras signed by the Police Chief on March 29, 2024 and by Flock on
    April 2, 2024 (<a href="{NOTICE_OCT}#page=34">page 34</a>).
  </li>
  <li>
    The 2025 contract attaches the January 2022 order and a five-year order for 11 cameras, signed
    by the Police Chief on January 24, 2024 and by Flock on March 6, 2024 (<a href="{FLOCK}#page=66"
      >Flock contract, page 66</a
    >, <a href="{FLOCK}#page=68">page 68</a>). The October notice does not mention that order, and
    the 2025 contract does not include the 2023 or April 2024 orders.
  </li>
</ul>

<p>
  Neither document lists all four orders, so the records do not show how they fit together or how
  many cameras each one covered at a time. The city sent a second notice on November 23, 2026,
  terminating the June 24, 2025 contract and asking that all Flock equipment be removed "in no event
  later than Monday, December 14, 2026" (<a href="{NOTICE_NOV}#page=1"
    >November 23, 2026 termination notice</a
  >). On November 24, 2026, the Mayor's office said the city had "received no response from the
  company" (<a href={RELEASE_NOV}>Mayor's press release, November 24, 2026</a>).
</p>

<h3 id="vendor-software">The Vendor Controls the Software</h3>

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
    for "the competitive strength of, or market for, Flock's products" (<a
      aria-label="Flock contract, page 44"
      href="{FLOCK}#page=44">page 44</a
    >).
  </li>
  <li>
    Flock's "Proprietary Information" includes "non-public information regarding features,
    functionality and performance of the Services" (<a
      aria-label="Flock contract, page 47"
      href="{FLOCK}#page=47">page 47</a
    >), and the city may not examine how the software works (<a
      aria-label="Flock contract, page 48"
      href="{FLOCK}#page=48">page 48</a
    >).
  </li>
  <li>
    Flock may use anonymized data from the cameras for "the training of machine learning algorithms"
    (<a aria-label="Flock contract, page 47" href="{FLOCK}#page=47">page 47</a>).
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
    rel="external noopener noreferrer"
    >Straight Arrow News<span class="sr-only">, opens in a new tab</span></a
  >), and Flock already offers people search on its video cameras (<a
    href="https://www.flocksafety.com/products/flock-freeform"
    target="_blank"
    rel="external noopener noreferrer"
    >Flock Safety<span class="sr-only">, opens in a new tab</span></a
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
    rel="external noopener noreferrer"
    >U.S. Patent 11,416,545<span class="sr-only">, opens in a new tab</span></a
  >; see also
  <a
    href="https://deflockilm.org/flock-tracking-patent/"
    target="_blank"
    rel="external noopener noreferrer"
    >DeFlockILM, September 17, 2026<span class="sr-only">, opens in a new tab</span></a
  >). A patent describes what a company could build, not what it has built, and Flock says its plate
  readers do not use facial recognition. But it shows the company has already designed for it, and
  that the only thing between a plate reader and a people tracker is software the city does not
  control.
</p>

<p>
  Selling data is not the only issue. The 2024 agreement says Flock "does not own and shall not sell
  Customer Data" (<a aria-label="Flock contract, page 46" href="{FLOCK}#page=46">page 46</a>), but
  it also gives Flock a "worldwide, perpetual, royalty-free right to use and distribute" anonymized
  data "to improve and enhance the Services and for other development, diagnostic and corrective
  purposes, and other Flock offerings" (<a
    aria-label="Flock contract, page 47"
    href="{FLOCK}#page=47">page 47</a
  >). The 2022 agreement gave Flock a "perpetual" license, lasting "during and after the term", to
  disclose the department's data and footage to law enforcement (<a
    aria-label="Flock contract, page 31"
    href="{FLOCK}#page=31">page 31</a
  >).
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
    rel="external noopener noreferrer"
    >City of Haverhill, November 5, 2026<span class="sr-only">, opens in a new tab</span></a
  >). Flock is on the agenda of the City Council's
  <a href={Router.meeting("public-health-safety-works-committee-2026-11-12")}
    >Public Health, Safety &amp; Works Committee meeting of November 12, 2026</a
  >. The concerns on this page come from what license plate readers do, whichever company provides
  them.
</p>

<ul>
  <li>
    Did the city consider <a
      href="https://privacysos.org/blog/mass-high-court-license-plate-reader-surveillance-can-trigger-constitutional-protections/"
      target="_blank"
      rel="external noopener noreferrer"
      >Commonwealth v. McCarthy<span class="sr-only">, opens in a new tab</span></a
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
      rel="external noopener noreferrer"
      >Haverhill Community TV recording<span class="sr-only">, opens in a new tab</span></a
    >, from 13:25). Is agreeing to share footage a condition of getting a license, and does the city
    have any written limits on how that footage is requested or used?
  </li>
  <li>
    If Flock is replaced, will any new license plate reader system, from any company, have to meet
    the ordinance and be approved in public before it is installed?
  </li>
  <li>
    The city's own lawyers wrote that the Flock agreements were "not lawfully procured" and were
    signed by the Police Chief rather than the Mayor (<a href="{NOTICE_OCT}#page=1"
      >October 26, 2026 termination notice</a
    >, page 1). What is being done to make sure this does not happen again, with any vendor?
  </li>
  <li>
    Will the city publish its contracts, including order forms and renewals signed by departments,
    so residents can see what has been agreed to and for how long?
  </li>
  <li>
    How will contracts be reviewed going forward, who will do the review, and will the results be
    public, so that an agreement signed without proper authority or Council approval is caught
    before it runs for years?
  </li>
  <li>
    Has the city checked its other contracts, in the Police Department and in other departments, for
    the same problems, and is there any other agreement in place that was not lawfully procured or
    not signed by someone with authority to bind the city?
  </li>
  <li>
    In October 2026, Lowell's City Council voted in a closed-door executive session to turn its
    Flock cameras back on, a vote a local group says violated the state's open meeting law (<a
      href="https://www.nbcboston.com/news/politics/lowell-reactivates-flock-cameras-after-closed-doors-vote-critics-say-violated-law/4048765/"
      target="_blank"
      rel="external noopener noreferrer"
      >NBC Boston, November 12, 2026<span class="sr-only">, opens in a new tab</span></a
    >). What will stop a surveillance decision in Haverhill from being made behind closed doors, and
    will the ordinance require every approval, renewal, or reactivation to happen in an open, public
    meeting?
  </li>
  <!-- More questions go here. -->
</ul>

<h2 id="comparison">
  Comparing the City's Draft Ordinance, the ACLU Model Bill, and Somerville's Ordinance
</h2>

<p>
  Two proposed sets of rules for license plate readers. The city's draft ordinance was written by
  the city's special counsel with the Police Department, and sent to the Mayor and City Council in
  September 2026 (<a href="{PACKET}#page=3">memo</a>, <a href="{PACKET}#page=8">draft</a>). The
  ACLU's model bill is a template any city can adopt (<a
    href="https://www.aclu.org/documents/local-automatic-license-plate-reader-privacy-model-bill"
    target="_blank"
    rel="external noopener noreferrer">ACLU<span class="sr-only">, opens in a new tab</span></a
  >, November 2026, <a href={MODEL_BILL}>copy</a>). Somerville's ordinance is a law already in
  effect, adopted in 2019, that requires City Council approval and public reports for all
  surveillance technology, not only plate readers (<a href={SOMERVILLE}>Ordinance 2019-20</a>,
  amended by <a href={SOMERVILLE_2022}>Ordinance 2022-20</a>). Each summary below gives the section
  and page it comes from.
</p>

<p>
  The topics below are not a complete list of what the three say. They are a selection I chose of
  the differences I think matter most: how much a system can collect, keep, and share, who can check
  it, and how the rules are enforced. The "My recommendation" box under each topic is my opinion of
  which is better and why, favoring the option that collects less or gives the public more
  oversight. Please read all three full texts, linked above, and form your own opinion.
</p>

<div class="space-y-6">
  {#each COMPARISON as row (row.topic)}
    <section>
      <h3>{row.topic}</h3>
      <div class="grid gap-3 xl:grid-cols-3">
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
        <div class="rounded border border-slate-200 bg-slate-50 p-3">
          <p class="m-0 text-sm font-semibold text-slate-700">Somerville ordinance</p>
          <p class="m-0 mt-1">{row.somerville}</p>
          {#if row.somervilleSection}
            <p class="m-0 mt-1 text-sm text-slate-600">
              <a href="{SOMERVILLE}#page={row.somervillePage}">{row.somervilleSection}</a>
            </p>
          {/if}
        </div>
      </div>
      {#if row.note}
        <p class="mt-3 mb-0">{row.note}</p>
      {/if}
      <div class="mt-3 rounded border border-emerald-300 bg-emerald-50 p-3">
        <p class="m-0 text-sm font-semibold text-emerald-900">My recommendation: {row.pick}</p>
        <p class="m-0 mt-1">{row.why}</p>
      </div>
    </section>
  {/each}
</div>

<h3 id="additions">Additions I Would Suggest</h3>

<p>
  These are my suggestions. Where Somerville's ordinance already does something similar, it is
  noted.
</p>

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
          >Green v. City and County of San Francisco, Ninth Circuit, 2014<span class="sr-only"
            >, opens in a new tab</span
          ></a
        >).
      </li>
      <li>
        <strong>Plate mix-ups.</strong> In Aurora, Colorado, police held a Black family, including
        children, at gunpoint because their plate number matched a stolen motorcycle from another
        state. The city paid a $1.9 million settlement (<a
          href="https://www.cnn.com/2024/02/05/us/colorado-aurora-settlement-stolen-vehicle-mixup"
          target="_blank"
          rel="external noopener noreferrer"
          >CNN, February 5, 2024<span class="sr-only">, opens in a new tab</span></a
        >).
      </li>
      <li>
        <strong>Wrongful arrests.</strong> Detroit police arrested Robert Williams in front of his
        family after facial recognition software matched him to the wrong person (<a
          href="https://www.npr.org/2020/06/24/882683463/the-computer-got-it-wrong-how-facial-recognition-led-to-a-false-arrest-in-michig"
          target="_blank"
          rel="external noopener noreferrer"
          >NPR, June 24, 2020<span class="sr-only">, opens in a new tab</span></a
        >). A 2024 settlement now requires Detroit police to have independent evidence before an
        arrest (<a
          href="https://www.aclu.org/cases/williams-v-city-of-detroit-face-recognition-false-arrest"
          target="_blank"
          rel="external noopener noreferrer"
          >ACLU<span class="sr-only">, opens in a new tab</span></a
        >).
      </li>
      <li>
        <strong>Wrong tickets.</strong> AI cameras on New York City buses read plates and issued
        about 800 tickets in error because of a programming error, even though a person was supposed
        to review each one (<a
          href="https://www.npr.org/2024/12/31/nx-s1-5213674/transit-systems-ai-cameras-bus-lanes"
          target="_blank"
          rel="external noopener noreferrer"
          >NPR, December 31, 2024<span class="sr-only">, opens in a new tab</span></a
        >).
      </li>
    </ul>
  </li>
  <li>
    <strong>Refused by default, not approved by default.</strong> Under Somerville's ordinance, if
    the City Council does not approve or deny a request within 60 days (not counting June, July, or
    August), the request is approved by default (<a href="{SOMERVILLE}#page=6">§ 10-65(a)(3)</a>).
    Haverhill's ordinance should do the opposite: if the Council does not act, the request is
    refused, so no surveillance technology can be added without a public vote.
  </li>
  <li>
    <strong>Software updates need public review.</strong> The city draft lets the Police Chief treat
    software and firmware updates as minor changes that need no City Council approval (<a
      href="{PACKET}#page=11">§ XXX-4(C)</a
    >). Because software decides what a plate reader can search for (see
    <a href="#vendor-software">The Vendor Controls the Software</a>), every update should be listed
    in a written public record, and any update that adds a feature or a new kind of search should
    need City Council approval. Somerville's ordinance already requires Council approval before a
    new surveillance capability added by an upgrade can be used (<a href="{SOMERVILLE}#page=4"
      >§ 10-63(c)(4)</a
    >), but lets the Mayor allow its use first if the Mayor decides it is unavoidable.
  </li>
  <li>
    <strong>No AI training or other products from city data.</strong> The city draft bans "secondary
    use" of city data by vendors (<a href="{PACKET}#page=17">§ XXX-12</a>), and the ACLU bill bars
    vendors from sharing it without the city's express permission (<a href="{MODEL_BILL}#page=4"
      >Section 5(A)(2)(a)</a
    >). Neither names AI training. The ordinance should say plainly that city data, including
    anonymized data, cannot be used to train AI or to build other products, because the Flock
    contract allowed both (<a href="{FLOCK}#page=31">Flock contract, page 31</a>;
    <a aria-label="Flock contract, page 47" href="{FLOCK}#page=47">page 47</a>).
  </li>
  <li>
    <strong>Cover all tracking technology, including aerial surveillance.</strong> The ordinance
    should apply to any technology that can track people or vehicles, including aerial surveillance
    from drones or aircraft, facial recognition, and gunshot detection. Police drone programs are
    spreading quickly, and drones can see into yards and through windows (<a
      href="https://www.eff.org/deeplinks/2026/07/hundreds-drone-first-responder-programs-could-soon-be-launched-across-country"
      target="_blank"
      rel="external noopener noreferrer"
      >EFF, July 2026<span class="sr-only">, opens in a new tab</span></a
    >;
    <a
      href="https://assets.aclu.org/live/uploads/2023/07/embargo-drones-as-first-responder-programs-final-electronic.pdf"
      target="_blank"
      rel="external noopener noreferrer"
      >ACLU, 2023<span class="sr-only">, opens in a new tab</span></a
    >). Some drones now carry license plate readers themselves (<a
      href="https://www.eff.org/deeplinks/2025/09/drone-sky-could-be-tracking-your-car"
      target="_blank"
      rel="external noopener noreferrer"
      >EFF, September 2025<span class="sr-only">, opens in a new tab</span></a
    >), which a rule written only for fixed cameras could miss. A federal appeals court ruled that
    police aerial surveillance covering much of Baltimore for 12 hours a day needed a warrant, and
    other courts have warned that cameras combined with "facial recognition, automated tracking or
    artificial intelligence" could cross the same line (<a
      href="https://www.congress.gov/crs-product/LSB11429"
      target="_blank"
      rel="external noopener noreferrer"
      >Congressional Research Service, May 2026<span class="sr-only">, opens in a new tab</span></a
    >). Somerville's ordinance already does this: it covers any surveillance technology, including
    plate readers, facial recognition, gunshot detection, and cell site simulators (<a
      href="{SOMERVILLE}#page=2">§ 10-62</a
    >).
  </li>
  <li>
    <strong>No gunshot detection.</strong> The ordinance should prohibit systems like ShotSpotter
    (see the note under <a href="#other-surveillance">Other Surveillance</a>).
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
    rel="external noopener noreferrer"
    >National Policing Institute, August 27, 2026<span class="sr-only">, opens in a new tab</span
    ></a
  >). In Haverhill, we can see where this is an issue given the contentious City Council meeting in
  August, and it is something we should be concerned about for the future.
</p>

<p>
  Nearby cities show how quickly that trust can be lost. In October 2026, Lowell's City Council
  voted in a closed-door executive session to turn more than 40 Flock cameras back on, reversing a
  September suspension. A local group, DeFlock Lowell, says the vote violated the state's open
  meeting law. Asked why the vote was held in executive session, a councilor said, "It was on the
  agenda. That's why we went in there." (<a
    href="https://www.nbcboston.com/news/politics/lowell-reactivates-flock-cameras-after-closed-doors-vote-critics-say-violated-law/4048765/"
    target="_blank"
    rel="external noopener noreferrer"
    >NBC Boston, November 12, 2026<span class="sr-only">, opens in a new tab</span></a
  >) Lowell is a nearby city, and Haverhill's own police say "automatic sharing of camera data with
  other communities and outside agencies has been discontinued", which means it had been in place (<a
    href={HPD_MEASURES}>Haverhill Police Department</a
  >). I found no record showing whether Haverhill and Lowell shared data, but decisions made out of
  public view are exactly why residents do not trust surveillance.
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
      rel="external noopener noreferrer"
      >PredPol subscription agreement renewal (via MuckRock)<span class="sr-only"
        >, opens in a new tab</span
      ></a
    >, December 2016
  </li>
  <li>
    <a
      href="https://www.haverhillma.gov/news/posts/city-of-haverhill-canceling-flock-safety-contract"
      target="_blank"
      rel="external noopener noreferrer"
      >City of Haverhill Canceling Flock Safety Contract<span class="sr-only"
        >, opens in a new tab</span
      ></a
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
      >MuckRock public records request to Convergint Technologies<span class="sr-only"
        >, opens in a new tab</span
      ></a
    >)
  </li>
  <li>
    <a
      href="https://www.congress.gov/crs-product/LSB11429"
      target="_blank"
      rel="external noopener noreferrer"
      >Artificial Intelligence and the Fourth Amendment: Two Emerging Legal Issues<span
        class="sr-only">, opens in a new tab</span
      ></a
    >, Congressional Research Service, LSB11429, May 5, 2026
  </li>
  <li>
    <a
      href="https://www.theiacp.org/sites/default/files/2018-08/March%202018%20RIB.pdf"
      target="_blank"
      rel="external noopener noreferrer"
      >Research in Brief: Assessing the Effectiveness of Automatic License Plate Readers<span
        class="sr-only">, opens in a new tab</span
      ></a
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
      >Automated License Plate Readers: Background and Legal Issues<span class="sr-only"
        >, opens in a new tab</span
      ></a
    >, Congressional Research Service, IF13068, July 21, 2025
  </li>
  <li>
    <a
      href="https://caselaw.findlaw.com/court/spr-jud-crt-mas-bar/2060202.html"
      target="_blank"
      rel="external noopener noreferrer"
      >Commonwealth v. McCarthy, 484 Mass. 493<span class="sr-only">, opens in a new tab</span></a
    >, Massachusetts Supreme Judicial Court, April 16, 2020, and the ACLU of Massachusetts'
    <a
      href="https://privacysos.org/blog/mass-high-court-license-plate-reader-surveillance-can-trigger-constitutional-protections/"
      target="_blank"
      rel="external noopener noreferrer"
      >summary of the ruling<span class="sr-only">, opens in a new tab</span></a
    >
  </li>
  <li>
    Number of Flock cameras (19, at entry and exit points), as stated by Deputy Chief Meaghan Pare
    at the City Council meeting of August 11, 2026: <a
      href="https://newslinklive.com/2026/08/13/haverhill-moves-to-regulate-use-of-flock-cameras-amid-surveillance-concerns/"
      target="_blank"
      rel="external noopener noreferrer"
      >Newslink, August 13, 2026<span class="sr-only">, opens in a new tab</span></a
    >, and
    <a
      href="https://whav.net/2026/08/11/haverhill-council-debates-security-vs-surveillance-cameras/"
      target="_blank"
      rel="external noopener noreferrer"
      >WHAV, August 11, 2026<span class="sr-only">, opens in a new tab</span></a
    >
  </li>
  <li>
    <a
      href="https://www.soundthinking.com/press-releases/shotspotter-selected-by-commonwealth-of-massachusetts-for-statewide-deployment-of-coplink-x/"
      target="_blank"
      rel="external noopener noreferrer"
      >ShotSpotter Selected by Commonwealth of Massachusetts for Statewide Deployment of Coplink X<span
        class="sr-only">, opens in a new tab</span
      ></a
    >, company announcement, December 6, 2022
  </li>
  <li>
    <a
      href="https://www.aclu.org/documents/local-automatic-license-plate-reader-privacy-model-bill"
      target="_blank"
      rel="external noopener noreferrer"
      >Local Automatic License Plate Reader Privacy Model Bill<span class="sr-only"
        >, opens in a new tab</span
      ></a
    >, ACLU, November 2026 (<a href={MODEL_BILL}>copy</a>)
  </li>
  <li>
    <a
      href="https://igchicago.org/wp-content/uploads/2023/08/Chicago-Police-Departments-Use-of-ShotSpotter-Technology.pdf#page=4"
      target="_blank"
      rel="external noopener noreferrer"
      >The Chicago Police Department's Use of ShotSpotter Technology<span class="sr-only"
        >, opens in a new tab</span
      ></a
    >, City of Chicago Office of Inspector General, August 2021
  </li>
  <li>
    <a
      href="https://www.npr.org/2024/10/20/nx-s1-5131546/researchers-are-skeptical-of-this-gunfire-detection-system-chicago-no-longer-uses-it"
      target="_blank"
      rel="external noopener noreferrer"
      >Researchers are skeptical of this gunfire detection system. Chicago no longer uses it<span
        class="sr-only">, opens in a new tab</span
      ></a
    >, NPR, October 20, 2024
  </li>
  <li>
    <a
      href="https://www.atlasofsurveillance.org/search?location=Haverhill,+MA"
      target="_blank"
      rel="external noopener noreferrer"
      >Atlas of Surveillance: Haverhill, MA<span class="sr-only">, opens in a new tab</span></a
    >, Electronic Frontier Foundation
  </li>
  <li>
    <a
      href="https://www.policinginstitute.org/infocus/alpr-backlash-what-agencies-need-to-know/"
      target="_blank"
      rel="external noopener noreferrer"
      >ALPR Backlash: What Agencies Need to Know<span class="sr-only">, opens in a new tab</span></a
    >, National Policing Institute, August 27, 2026
  </li>
  <li>
    <a
      href="https://www.archives.gov/founding-docs/bill-of-rights-transcript"
      target="_blank"
      rel="external noopener noreferrer"
      >The Bill of Rights: A Transcription<span class="sr-only">, opens in a new tab</span></a
    >, National Archives
  </li>
  <li>
    <a
      href="https://www.courtlistener.com/docket/73367327/united-states-v-kyle/"
      target="_blank"
      rel="external noopener noreferrer"
      >United States v. Kyle, No. 4:26-cr-00189<span class="sr-only">, opens in a new tab</span></a
    >, U.S. District Court, Northern District of Oklahoma, October 1, 2026 (docket); news coverage:
    CBS12, October 3, 2026
  </li>
  <li>
    <a
      href="https://cdn.ca9.uscourts.gov/datastore/opinions/2014/05/12/11-17892.pdf"
      target="_blank"
      rel="external noopener noreferrer"
      >Green v. City and County of San Francisco<span class="sr-only">, opens in a new tab</span></a
    >, U.S. Court of Appeals for the Ninth Circuit, 2014
  </li>
  <li>
    <a
      href="http://haverhillcommunitytv.org/video/haverhill-city-council-meeting-august-11-2026"
      target="_blank"
      rel="external noopener noreferrer"
      >Haverhill City Council meeting, August 11, 2026<span class="sr-only"
        >, opens in a new tab</span
      ></a
    >, Haverhill Community TV recording
  </li>
  <li>
    <a
      href="http://haverhillcommunitytv.org/video/haverhill-license-commission-meeting-september-3-2026"
      target="_blank"
      rel="external noopener noreferrer"
      >Haverhill License Commission meeting, September 3, 2026<span class="sr-only"
        >, opens in a new tab</span
      ></a
    >, Haverhill Community TV recording (from 13:25)
  </li>
  <li>
    <a
      href="https://www.cambridgema.gov/news/2025/12/statementontheflocksafetyalprcontracttermination"
      target="_blank"
      rel="external noopener noreferrer"
      >Statement on the Flock Safety ALPR contract termination<span class="sr-only"
        >, opens in a new tab</span
      ></a
    >, City of Cambridge, December 10, 2025
  </li>
  <li>
    <a
      href="https://www.nbcchicago.com/news/local/company-violated-illinois-law-by-sharing-license-plate-data-with-customs-and-border-protection-giannoulias/3814914/"
      target="_blank"
      rel="external noopener noreferrer"
      >Company violated Illinois law by sharing license plate data with federal agency: Giannoulias<span
        class="sr-only">, opens in a new tab</span
      ></a
    >, NBC Chicago, August 25, 2025
  </li>
  <li>
    <a
      href="https://www.npr.org/2025/11/07/nx-s1-5587724/some-sanctuary-states-discover-feds-mining-local-license-plate-data"
      target="_blank"
      rel="external noopener noreferrer"
      >Some sanctuary states discover feds mining local license plate data<span class="sr-only"
        >, opens in a new tab</span
      ></a
    >, NPR, November 7, 2025
  </li>
  <li>
    <a
      href="https://www.npr.org/2026/02/17/nx-s1-5612825/flock-contracts-canceled-immigration-survillance-concerns"
      target="_blank"
      rel="external noopener noreferrer"
      >Why some cities are canceling Flock license plate reader contracts<span class="sr-only"
        >, opens in a new tab</span
      ></a
    >, NPR, February 17, 2026
  </li>
  <li>
    <a
      href="https://www.cbsnews.com/news/flocks-ceo-claims-its-tech-solved-1-million-crimes-data-shows-otherwise/"
      target="_blank"
      rel="external noopener noreferrer"
      >Flock's CEO claims its tech "solved" 1 million crimes last year. The company's own
      methodology undercuts that claim<span class="sr-only">, opens in a new tab</span></a
    >, CBS News, September 30, 2026
  </li>
  <li>
    <a
      href="https://www.cnn.com/2026/07/26/us/flock-cameras-surveillance-abuse"
      target="_blank"
      rel="external noopener noreferrer"
      >Inside the growing police use and misuse of Flock's license-plate reader cameras<span
        class="sr-only">, opens in a new tab</span
      ></a
    >, CNN, July 26, 2026
  </li>
  <li>
    <a
      href="https://www.cnn.com/2026/08/26/us/flock-kentucky-police-officer-arrest"
      target="_blank"
      rel="external noopener noreferrer"
      >Police officer arrested after tracking ex-girlfriend on Flock camera system over 2,000 times<span
        class="sr-only">, opens in a new tab</span
      ></a
    >, CNN, August 26, 2026
  </li>
  <li>
    <a
      href="https://abcnews.com/US/5-indianapolis-police-officers-charged-misusing-license-plate/story?id=136696856"
      target="_blank"
      rel="external noopener noreferrer"
      >5 Indianapolis police officers charged with misusing license plate readers<span
        class="sr-only">, opens in a new tab</span
      ></a
    >, ABC News, September 24, 2026; also WFYI, same date
  </li>
  <li>
    <a
      href="https://abcnews.com/US/officer-allegedly-flock-license-plate-cameras-track-boyfriends/story?id=135418955"
      target="_blank"
      rel="external noopener noreferrer"
      >Officer allegedly used Flock license plate cameras to track boyfriend's ex-wife<span
        class="sr-only">, opens in a new tab</span
      ></a
    >, ABC News, August 6, 2026
  </li>
  <li>
    <a
      href="https://katv.com/news/local/sherwood-stop-sparked-after-flock-camera-misread-plate-by-one-letter-as-stolen-katv-news-share-inform-public-community-safety"
      target="_blank"
      rel="external noopener noreferrer"
      >Sherwood stop sparked after Flock camera misread plate by one letter as stolen<span
        class="sr-only">, opens in a new tab</span
      ></a
    >, KATV, March 18, 2026
  </li>
  <li>
    <a
      href="https://cbs12.com/news/florida/federal-judge-rules-warrantless-license-plate-reader-search-violated-fourth-amendment-flock-license-plate-reader-alpr-database-melisa-susan-kyle-oklahoma-vehicle-data-judge-sara-hill"
      target="_blank"
      rel="external noopener noreferrer"
      >Federal judge rules warrantless license-plate reader search violated Fourth Amendment<span
        class="sr-only">, opens in a new tab</span
      ></a
    >, CBS12, October 3, 2026
  </li>
  <li>
    <a
      href="https://www.wfyi.org/wfyi-news/2026-09-24/five-indianapolis-police-officers-charged-for-misusing-flock-cameras"
      target="_blank"
      rel="external noopener noreferrer"
      >Five Indianapolis police officers charged for misusing Flock cameras<span class="sr-only"
        >, opens in a new tab</span
      ></a
    >, WFYI, September 24, 2026
  </li>
  <li>
    <a
      href="https://www.cnn.com/2024/02/05/us/colorado-aurora-settlement-stolen-vehicle-mixup"
      target="_blank"
      rel="external noopener noreferrer"
      >Aurora, Colorado, will pay $1.9 million settlement after officers drew weapons on Black
      family in a stolen vehicle mix-up<span class="sr-only">, opens in a new tab</span></a
    >, CNN, February 5, 2024
  </li>
  <li>
    <a
      href="https://www.npr.org/2020/06/24/882683463/the-computer-got-it-wrong-how-facial-recognition-led-to-a-false-arrest-in-michig"
      target="_blank"
      rel="external noopener noreferrer"
      >Facial Recognition Leads To False Arrest Of Black Man In Detroit<span class="sr-only"
        >, opens in a new tab</span
      ></a
    >, NPR, June 24, 2020
  </li>
  <li>
    <a
      href="https://www.aclu.org/cases/williams-v-city-of-detroit-face-recognition-false-arrest"
      target="_blank"
      rel="external noopener noreferrer"
      >Williams v. City of Detroit<span class="sr-only">, opens in a new tab</span></a
    >, ACLU
  </li>
  <li>
    <a
      href="https://www.npr.org/2024/12/31/nx-s1-5213674/transit-systems-ai-cameras-bus-lanes"
      target="_blank"
      rel="external noopener noreferrer"
      >Transit systems turn to AI to catch drivers who block bus lanes<span class="sr-only"
        >, opens in a new tab</span
      ></a
    >, NPR, December 31, 2024
  </li>
  <li>
    <a
      href="https://www.eff.org/deeplinks/2026/07/hundreds-drone-first-responder-programs-could-soon-be-launched-across-country"
      target="_blank"
      rel="external noopener noreferrer"
      >Hundreds of Drone-as-First-Responder Programs Could Soon Be Launched Across the Country<span
        class="sr-only">, opens in a new tab</span
      ></a
    >, Electronic Frontier Foundation, July 2026
  </li>
  <li>
    <a
      href="https://www.eff.org/deeplinks/2025/09/drone-sky-could-be-tracking-your-car"
      target="_blank"
      rel="external noopener noreferrer"
      >That Drone in the Sky Could Be Tracking Your Car<span class="sr-only"
        >, opens in a new tab</span
      ></a
    >, Electronic Frontier Foundation, September 2025
  </li>
  <li>
    <a
      href="https://assets.aclu.org/live/uploads/2023/07/embargo-drones-as-first-responder-programs-final-electronic.pdf"
      target="_blank"
      rel="external noopener noreferrer"
      >Eye-in-the-Sky Policing Needs Strict Limits<span class="sr-only">, opens in a new tab</span
      ></a
    >, Jay Stanley, ACLU, July 27, 2023
  </li>
  <li>
    <a
      href="https://san.com/cc/hackers-stole-a-flock-camera-heres-what-they-found-inside/"
      target="_blank"
      rel="external noopener noreferrer"
      >Hackers stole a Flock camera. Here's what they found inside<span class="sr-only"
        >, opens in a new tab</span
      ></a
    >, Straight Arrow News, September 16, 2026, reporting on analysis by Wired and 404 Media
  </li>
  <li>
    <a
      href="https://www.flocksafety.com/products/flock-freeform"
      target="_blank"
      rel="external noopener noreferrer"
      >FreeForm Search<span class="sr-only">, opens in a new tab</span></a
    >, Flock Safety product page
  </li>
  <li>
    <a
      href="https://patents.google.com/patent/US11416545B1/en"
      target="_blank"
      rel="external noopener noreferrer"
      >U.S. Patent 11,416,545 B1, System and method for object based query of video content captured
      by a dynamic surveillance network<span class="sr-only">, opens in a new tab</span></a
    >, Flock Group Inc, granted August 16, 2022 (Google Patents)
  </li>
  <li>
    <a
      href="https://deflockilm.org/alpr-explained/"
      target="_blank"
      rel="external noopener noreferrer"
      >ALPR, Explained: From Stolen-Car Tool to Mass Surveillance<span class="sr-only"
        >, opens in a new tab</span
      ></a
    >, DeFlockILM (citizen privacy group), October 5, 2026
  </li>
  <li>
    <a
      href="https://deflockilm.org/flock-tracking-patent/"
      target="_blank"
      rel="external noopener noreferrer"
      >Flock's Own Patent Proves It Was Never 'Just a License Plate Reader'<span class="sr-only"
        >, opens in a new tab</span
      ></a
    >, DeFlockILM, September 17, 2026
  </li>
  <li>
    <a
      href="https://media-001-us.cdn.govstack.com/haverhillma-003-us/media/oqypskkh/full-agenda-8112026.pdf"
      target="_blank"
      rel="external noopener noreferrer"
      >City Council agenda, August 11, 2026<span class="sr-only">, opens in a new tab</span></a
    >, City of Haverhill (item 5.1, page 1)
  </li>
  <li>
    <a
      href="https://www.cambridgeday.com/2025/08/19/crimetracer-shares-cambridge-and-somerville-police-data-statewide-and-with-ice-until-2023/"
      target="_blank"
      rel="external noopener noreferrer"
      >CrimeTracer shares Cambridge and Somerville police data statewide, and with ICE until 2023<span
        class="sr-only">, opens in a new tab</span
      ></a
    >, Ella Stern, Cambridge Day, August 19, 2025
  </li>
  <li>
    <a href={NOTICE_OCT}>Notice of Termination of Services</a>, Allison S. Valton, City Solicitor
    (MTC Lawyers), to Flock Group Inc., dated October 26, 2026, with the January 25, 2022, March 29,
    2023, and April 2, 2024 agreements attached
  </li>
  <li>
    <a href={NOTICE_NOV}>Notice of Termination of Services</a>, Kayla Venckauskas (MTC Lawyers), to
    Flock Group Inc., November 23, 2026, with the June 24, 2025 contract attached
  </li>
  <li>
    <a href={RELEASE_NOV}>Haverhill Flock Contract Cancelation Update</a>, press release, Office of
    Mayor Melinda E. Barrett, November 24, 2026
  </li>
  <li>
    <a href={HPD_MEASURES}>Flock Safety Security and Privacy Measures</a>, Haverhill Police
    Department, linked from the city's November 5, 2026 announcement
  </li>
  <li>
    <a href={SOMERVILLE}>Ordinance No. 2019-20, Public Oversight of Surveillance Technology</a>,
    City of Somerville, adopted by the City Council October 10, 2019 and approved by the Mayor
    October 16, 2019 (Code of Ordinances, Chapter 10, Article III); amended by
    <a href={SOMERVILLE_2022}>Ordinance No. 2022-20</a>, September 22, 2022
  </li>
  <li>
    <a
      href="https://www.nbcboston.com/news/politics/lowell-reactivates-flock-cameras-after-closed-doors-vote-critics-say-violated-law/4048765/"
      target="_blank"
      rel="external noopener noreferrer"
      >Lowell reactivates Flock cameras after closed-doors vote critics say violated law<span
        class="sr-only">, opens in a new tab</span
      ></a
    >, John Moroney, NBC Boston, November 12, 2026
  </li>
</ul>
