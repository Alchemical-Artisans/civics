import type { TableLine } from "$lib/diff"
import type { Redline } from "$lib/redline"

/**
 * An Ordinance Relating to Zoning -- the Planning Director's omnibus amendment
 * to Chapter 255 -- transcribed from the marked-up copy in the packet mark for
 * mark. The copy says what its marks mean in its own enacting clause:
 * "strike out removed and bold and underline new". So nothing here is derived:
 * a `struck` passage is one the copy strikes, an `added` one is one it sets in
 * bold and underlined, and both versions of each provision are read back out
 * of the marks. The strike-through the diff links to is therefore the city's
 * own PDF rather than one generated here.
 *
 * The order is eight divisions, First through Eighth, each a list of lettered
 * items naming the section it amends and quoting that section as amended. The
 * division and the lettered lead-in are headings; the quoted provision is the
 * paragraph the diff compares. A lead-in is unchanged text, so the diff folds
 * it as context and names the hunk after it.
 *
 * Two things in the order are not in this redline:
 *
 * - Third B replaces five parking-layout diagrams ("And delete the existing
 *   diagrams numbered 1-5 and replace with the following:"), which are
 *   drawings. There is nothing in a drawing to transcribe, so the two pages of
 *   them stay in `ordinance.pdf` at the foot of the item page and the diff
 *   carries the sentence that introduces them and stops.
 * - Eighth amends Appendix A, Table 1 by an attached fifteen-page table, which
 *   is the whole Table of Use and Parking Regulations with four rows marked.
 *   Those four rows are `USE_TABLE` below -- a table is the diff's second
 *   shape -- and the notes printed under that table, which the copy also
 *   marks, are `NOTES`.
 */

export const REDLINE: Redline = [
  { kind: "heading", text: ["First:"] },

  { kind: "heading", text: ["A. Section 8.3.7.5 first sentence shall be amended as follows:"] },
  {
    indent: 1,
    text: [
      "Lottery or tenant selection agent. The applicant for an inclusionary development project shall engage a DHCD and City of Haverhill Office of Economic Development and ",
      { added: "Planning" },
      " approved lottery agent for homeownership units who shall ensure affirmative marketing and compliance with income requirements as well as DHCD requirements for maximum housing purchase price for affordable housing units.",
    ],
  },

  { kind: "heading", text: ["B. Section 8.3.9.4, second sentence shall be amended as follows:"] },
  {
    indent: 1,
    text: [
      "No building permit shall be issued until an approved regulatory agreement is recorded at the Registry of Deeds and the Building Commissioner is notified by the ",
      { added: "Planning" },
      " Director ",
      { struck: "of the Office of Economic Development and Planning " },
      "or ",
      { added: "its " },
      { struck: "his/her " },
      { added: "designee " },
      { struck: "representative " },
      "that the project is progressing in a satisfactory manner in fulfilling its affordable housing requirement.",
    ],
  },

  {
    kind: "heading",
    text: ["C. Section 8.3.10, first paragraph fourth sentence shall be amended as follows:"],
  },
  {
    indent: 1,
    text: [
      "No building permit for an inclusionary development project shall be issued unless the ",
      { struck: "Director of the Office of Economic Development and Planning " },
      { added: "Planning Director or designee " },
      "has determined that the applicant's affirmative marketing plan satisfies these requirements.",
    ],
  },

  { kind: "heading", text: ["D. Section 9.3.10.1 third sentence shall amended as follows:"] },
  {
    indent: 1,
    text: [
      "The location and design of any pathways/walkways, open space, or parks shall be approved by the ",
      { added: "Planning Director or its designee " },
      { struck: "Economic Development Director " },
      "and in keeping with the City's rail trail design.",
    ],
  },

  { kind: "heading", text: ["E. Section 9.3.12.1 second sentence shall be amended as follows:"] },
  {
    indent: 1,
    text: [
      "The size and design of the park must be approved by the ",
      { added: "Planning " },
      { struck: "Economic Development " },
      "Director",
      { added: " or its designee" },
      ".",
    ],
  },

  { kind: "heading", text: ["F. Section 9.3.12.2.b second sentence shall be amended as follows:"] },
  {
    indent: 1,
    text: [
      "The size and design of the park must be approved by the ",
      { added: "Planning " },
      { struck: "Economic Development " },
      "Director",
      { added: " or its designee" },
      ".",
    ],
  },

  { kind: "heading", text: ["G. Section 9.3.12.2.c third sentence shall be amended as follows:"] },
  {
    indent: 1,
    text: [
      "The use must be approved by the ",
      { added: "Planning " },
      { struck: "Economic Development " },
      "Director",
      { added: " or its designee" },
      ".",
    ],
  },

  { kind: "heading", text: ["H. Section 9.3.12.4 second sentence shall be amended as follows:"] },
  {
    indent: 1,
    text: [
      "The area, location, and amenities included in the park must be approved by the ",
      { added: "Planning " },
      { struck: "Economic Development " },
      "Director",
      { added: " or its designee" },
      ".",
    ],
  },

  { kind: "heading", text: ["I. Section 9.3.12 shall be amended as follows:"] },
  {
    indent: 1,
    text: [
      "Any off-street parking required by this section in Sub-Zone E for any building or use may be included as part of any off-street parking area similarly required for another building or use on the same site only when the type of buildings or uses indicate that the usage of such parking area would not occur simultaneously, as determined by the ",
      { added: "Planning " },
      { struck: "Economic Development " },
      "Director",
      { added: " or its designee" },
      ".",
    ],
  },

  { kind: "heading", text: ["J. Section 9.3.18.3.b.2.i shall be amended as follows:"] },
  {
    indent: 1,
    text: [
      "Any other information which may include required traffic, school, and/or utilities impact study and in order to adequately evaluate the scope and potential impacts of the proposed project if deemed necessary by the ",
      { added: "Planning " },
      { struck: "Economic Development " },
      "Director",
      { added: " or its designee" },
      ".",
    ],
  },

  { kind: "heading", text: ["K. Section 9.3.19.1.a second sentence shall be amended as follows:"] },
  {
    indent: 1,
    text: [
      "The applicant shall also file 20 copies of the application and the other required submittals with the ",
      { added: "Planning " },
      { struck: "Economic Development " },
      "Director",
      { added: " or its designee" },
      " on behalf of the PAA.",
    ],
  },

  { kind: "heading", text: ["L. Section 9.3.19.1.c shall be amended as follows:"] },
  {
    indent: 1,
    text: [
      "An applicant for by-right (site plan review - minor) plan approval shall file the application and all required submittals with the ",
      { added: "Planning " },
      { struck: "Economic Development " },
      "Director",
      { added: " or its designee" },
      ".",
    ],
  },

  { kind: "heading", text: ["M. Section 9.3.19.2.a shall be amended as follows:"] },
  {
    indent: 1,
    text: [
      "Upon receipt of the application for special permit plan approval or by-right (site plan review - major) plan approval, the City Clerk shall immediately provide a copy of the application materials to the City Council, the Planning Board, the Board of Appeals, the Board of Health, the Conservation Commission, the Fire Department, the Police Department, the Building Commissioner, the Department of Public Works, the ",
      { added: "Planning " },
      { struck: "Economic Development " },
      "Department, and the Community Development Division. Furthermore, the ",
      { struck: "Economic Development " },
      { added: "Planning " },
      "Director or City Clerk may obtain comments pertaining to design from an architect if deemed necessary by the ",
      { struck: "Economic Development " },
      { added: "Planning " },
      "Director. Any such board, agency, or officer shall provide written comments within 60 days of its receipt of a copy of the plan and application for approval, or within 30 days of such receipt in the case of a preferred project. Furthermore, the ",
      { added: "Planning " },
      { struck: "Economic Development " },
      { added: "Director " },
      "shall determine within 10 days of receipt of either a by-right or special permit application whether the project described in the application constitutes a preferred project and shall inform the applicant of such.",
    ],
  },

  { kind: "heading", text: ["N. Section 9.3.19.2.b shall be amended as follows"] },
  {
    indent: 1,
    text: [
      "In the case of a by-right (site plan review - minor) plan approval, the Economic Development Director shall immediately provide a copy of the application materials to the Board of Health, the Conservation Commission, the Fire Department, the Police Department, the Building Commissioner, the Department of Public Works, the ",
      { struck: "Economic Development " },
      { added: "Planning " },
      "Department, and the Community Development Division. Furthermore, the ",
      { added: "Planning " },
      { struck: "Economic Development " },
      "Director or City Clerk may obtain comments pertaining to design from an architect if deemed necessary by the ",
      { added: "Planning " },
      { struck: "Economic Development " },
      "Director. The departments shall provide comment within 30 days or, in the case of a preferred project, within 15 days. Furthermore, the ",
      { added: "Planning " },
      { struck: "Economic Development " },
      "Director ",
      { added: "or its designee " },
      "shall determine within 10 days of receipt of the application materials whether the project described in the application constitutes a preferred project and shall inform the applicant of such.",
    ],
  },

  { kind: "heading", text: ["O. Section 9.3.21.1 shall be amended as follows:"] },
  {
    indent: 1,
    text: [
      "Minor Change. After either by-right or special permit plan approval, an applicant may apply to make minor changes involving minor utility or building orientation adjustments, lighting or facade adjustments, or minor adjustments to parking, landscaping, or other site details that do not affect the overall massing, final build-out or building envelope of the site and do not materially affect the open space from that shown on the previously approved site plan and do not increase the number of dwelling units in the project in the aggregate form that was provided in the original plan approval. Plans showing such minor changes and an application must be submitted to the ",
      { added: "Planning " },
      { struck: "Economic Development " },
      "Director. The ",
      { added: "Planning " },
      { struck: "Economic Development " },
      "Director ",
      { added: "or its designee " },
      "shall make a determination as to whether the changes constitute a minor change and may authorize such changes, in writing, to the applicant. The ",
      { added: "Planning " },
      { struck: "Economic Development " },
      "Director ",
      { added: "or its designee " },
      "shall set forth any decision to approve or deny such minor changes, in writing, within 30 days after the applicant has filed its application and shall provide a copy of its decision to the applicant for filing with the City Clerk.",
    ],
  },

  { kind: "heading", text: ["P. Section 9.3.21.2 shall be amended as follows:"] },
  {
    indent: 1,
    text: [
      "Major Change. Those changes deemed by the ",
      { added: "Planning " },
      { struck: "Economic Development " },
      "Director, ",
      { added: "or its designee " },
      "to constitute a major change because of the nature of the change in relation to the prior approved plan or because such change cannot be appropriately characterized as a minor change as described above, shall be processed by the PAA as a new application for by-right (site plan review - major) approval or special permit plan approval pursuant to this article.",
    ],
  },

  { kind: "heading", text: ["Second:"] },

  { kind: "heading", text: ["A. Section 6.2.7 Title shall be amended as follows:"] },
  {
    indent: 1,
    text: ["Signs Permitted in Any R ", { struck: "or S " }, "District."],
  },

  { kind: "heading", text: ["B. Section 6.2.8.1"] },
  {
    indent: 1,
    text: [
      "Wall Signs (Accessory). ",
      {
        struck:
          "One wall sign for each building frontage of each establishment shall be permitted. ",
      },
      {
        added:
          "A maximum of two wall signs shall be permitted for each establishment, provided that the signs are mounted on and face different sides of the building (front, sides, or rear). ",
      },
      { struck: "Such " },
      { added: "Each " },
      "wall sign shall not exceed a maximum area of 40 square feet per building frontage in any CN District, or a maximum sign area of 120 square feet per building frontage in a CG District, or a maximum sign area of 120 square feet per building frontage in any CH District.",
    ],
  },

  { kind: "heading", text: ["C. Section 6.2.9 Title shall be amended as follows:"] },
  {
    indent: 1,
    text: ["Signs Permitted in Any ", { struck: "I " }, { added: "B " }, "District"],
  },

  { kind: "heading", text: ["D. Section 8.5.5.1 shall be amended as follows:"] },
  {
    indent: 1,
    text: [
      "Submission Fee. The SPGA shall specify submission fees ",
      {
        added:
          "in the application requirements as adopted from time to time and set forth in the application procedures and ",
      },
      { struck: "for a PDD District rezoning in " },
      "its rules and regulations. ",
      { struck: "In no case shall the fee be less than $850. " },
      "The required fee shall be submitted with the rezoning request and preliminary plan.",
    ],
  },

  { kind: "heading", text: ["E. Section 8.5.6 shall be amended as follows:"] },
  {
    indent: 1,
    text: [
      "All documents must be submitted to the SPGA ",
      { added: "in accordance with the rules and regulations of the SPGA. " },
      {
        struck:
          "no later than two business days prior to meetings at which the amendment will be considered. Fifteen copies shall be submitted. Documents shall also be made available electronically for access by the general public.",
      },
    ],
  },

  { kind: "heading", text: ["F. Section 9.3.19.1 shall be amended as follows:"] },
  { indent: 1, text: ["1. Filing."] },
  {
    indent: 2,
    text: [
      "(a) An applicant for special permit plan approval or by-right (site plan review - major) shall file ",
      { struck: "30 copies of " },
      "the application and all required submittals, including notice of the date of filing, with the City Clerk on behalf of the PAA",
      { added: " in accordance with the Rules and Regulations of the SPGA" },
      ".",
    ],
  },
  {
    indent: 2,
    text: [
      { struck: "(b) " },
      "An applicant for by-right plan (site plan review - minor) approval shall file the application and all required submittals, including notice of the date of filing, with the City Clerk",
      { added: " in accordance with the Rules and Regulations of the SPGA" },
      ". ",
      {
        struck:
          "The applicant shall also file 20 copies of the application and the other required submittals with the Economic Development Director on behalf of the PAA.",
      },
    ],
  },
  {
    indent: 2,
    text: [
      "(c) An applicant for by-right (site plan review - minor) plan approval shall file the application and all required submittals",
      { added: " in accordance with the Rules and Regulations of the SPGA" },
      { struck: " with the Economic Development Director" },
      ".",
    ],
  },

  { kind: "heading", text: ["Third"] },

  { kind: "heading", text: ["A. Section 3.2.2.2 shall be amended as follows:"] },
  { indent: 1, text: ["Trailer, Automobile, or Boat."] },
  {
    indent: 2,
    text: [
      { added: "a. In any residential district accessory exterior the " },
      { struck: "Accessory " },
      "storage of ",
      { added: "no more than of the following unregistered items; " },
      "one trailer, ",
      { added: "or " },
      "one ",
      { struck: "unregistered " },
      "automobile ",
      { struck: "and/" },
      "or one boat shall be allowed as per Table 1.",
    ],
  },
  {
    indent: 2,
    text: [
      {
        added:
          "b. In any residential district accessory exterior storage of a camper or trailer or boat so long as not more than three of any combination of the foregoing shall be permitted .",
      },
    ],
  },

  { kind: "heading", text: ["B. Section 6.1.4 shall be amended as follows:"] },
  {
    indent: 1,
    text: [
      "Off-street parking areas shall ",
      { struck: "be " },
      {
        added:
          "include standard spaces no smaller than 9 feet wide by 18 feet long and may include 10% of the total required spaces designed for compact cars no smaller than 8 feet wide by 16 feet long and further the spaces shall be ",
      },
      "designed to comply with one or a combination of the following minimum standards.",
    ],
  },
  {
    indent: 1,
    text: ["And delete the existing diagrams numbered 1-5 and replace with the following:"],
  },

  { kind: "heading", text: ["C. Section 6.1.16 first paragraph shall be amended as follows:"] },
  {
    indent: 1,
    text: [
      "All parking and loading areas containing over five ",
      { added: "contiguous " },
      "spaces, including automotive and drive-in establishments of all types, shall be either contained within structures, or subject to the following:",
    ],
  },

  { kind: "heading", text: ["D. Section 6.1.12.7 shall be amended as follows:"] },
  {
    indent: 1,
    text: [
      "Parking and loading spaces other than those required for single",
      { added: "," },
      { struck: "- and " },
      "two-family ",
      { added: "and three-family " },
      "dwellings shall be so arranged as not to permit backing of automobiles onto any street.",
    ],
  },

  { kind: "heading", text: ["E. Section 7.2.8.1 shall be amended as follows:"] },
  {
    indent: 1,
    text: [
      "Before an applicant may remove sand, gravel, minerals or other earth materials from a site under a permit granted by the Board of Appeals for that purpose, there must be in effect a performance ",
      {
        added:
          "guarantee which may be in the form of a tripartite agreement, savings account or surety ",
      },
      "bond ",
      { added: "held by " },
      { struck: "with " },
      "the City Treasurer of not less than $3,000 per acre to be excavated under the permit. The bond may not be terminated unless 30 days' written notice of intent to terminate has been given to the City Treasurer and to the Board of Appeals and Conservation Commission and the Board of Appeals has voted to release such ",
      { added: "guarantee" },
      { struck: "bond" },
      ".",
    ],
  },

  {
    kind: "heading",
    text: ["Fourth: The following is in relation to the requirements of Consolidated Permitting:"],
  },

  { kind: "heading", text: ["A. 10.1.3 ", { added: "Other Approvals Required." }] },
  {
    indent: 1,
    text: [
      "Where authorization of a use of land or of a structure is required by the Board of Appeals or City Council, a copy of such written authorization shall be sent by the Clerk of the Board or Council to the Building Commissioner within 14 days of granting of approval and shall be received by the Building Commissioner prior to the issuance of a permit. ",
      {
        added:
          "If an applicant for a building permit has applied for a Consolidated Local Permit under 225 CMR 29.00, a building permit shall not be issued unless the Consolidated Local Permit has been granted. ",
      },
      "In addition, the Building Commissioner in such cases where the Board or Council has granted a limited or conditional zoning variance or special permit shall not issue a permit until the applicant submits an affidavit from the Essex County Registry of Deeds that such authorization of the Board or Council has been recorded. Furthermore, the Building Commissioner shall not issue a permit where approval by the Mayor, State Department of Natural Resources and the State Department of Public Works for the filling of wetlands; and/or a certificate of appropriateness from the Historic District Commission, if and when required; and/or a covenant or offer for acceptance of open space, until these requirements are met in writing",
      { added: ", or if a Consolidated Local Permit under 225 CMR 29.00 has been denied" },
      ". Authorization for a permit shall be null and void if the applicant has not obtained his permit from the Building Commissioner after one year from the date of approval of his application by the City Council or the Board.",
    ],
  },

  { kind: "heading", text: ["B. 10.1.4 ", { added: "Development Review." }] },
  {
    indent: 1,
    text: [
      { added: "1. " },
      "In addition to plans and drawings required for submission under regulations of the Building Code or this chapter, all applications for building permits for 1) new construction of a single-family home, or 2) change of use in an existing structure, or 3) any new construction of a multifamily, commercial, or business structure, or 4) the development of three or more parking spaces, ",
      {
        added:
          "or 5) small clean energy infrastructure or facilities subject to a Consolidated Local Permit and as defined under 225 CMR 29,00 ",
      },
      'shall be submitted to the Building Commissioner accompanied by evidence required by the City departments set forth below (the "City departments"). This process shall be called "development review." Approval shall be required, when applicable, from the following City departments:',
    ],
  },
  { indent: 2, text: [{ added: "a. " }, "Water and Sewer Departments."] },
  { indent: 2, text: [{ added: "b. " }, "Fire Chief."] },
  { indent: 2, text: [{ added: "c. " }, "Police Chief."] },
  { indent: 2, text: [{ added: "d. " }, "City Engineer."] },
  { indent: 2, text: [{ added: "e. " }, "Health Department."] },
  { indent: 2, text: [{ added: "f. " }, "Conservation Commission."] },
  { indent: 2, text: [{ added: "g. Planning Department" }] },
  {
    indent: 1,
    text: [
      { added: "2. " },
      "The purpose of this development review is to ensure, prior to issuance of a building permit, that the proposed development or site alterations will comply with the State Building Code, other state laws and regulations, this chapter (including the performance standards set forth in § ",
      { added: "6.3" },
      "), and public safety standards. If, in the opinion of the relevant City departments, the work proposed deviates from the standards set forth above, the SPGA or the Building Commissioner may deny the application for a building permit or other work. Each City department shall conduct its review within 45 days and report to the applicant and the Building Commissioner in writing",
      {
        added:
          ", except for small clean energy infrastructure or facilities subject to a Consolidated Local Permit, which shall be subject to the processes under 225 CMR 29.00, including a pre-filing municipal meeting with the departments listed above, where applicable. The purpose of the pre-filing municipal meeting is for the Applicant and the City to:",
      },
    ],
  },
  {
    indent: 2,
    text: [
      {
        added:
          "(a) Verify basic project and site information, including zoning information, known areas subject to state or local environmental laws, and any other areas, structures, or buildings of cultural or historical significance that could be impacted by the project;",
      },
    ],
  },
  {
    indent: 2,
    text: [
      {
        added:
          "(b) Identify to the best extent possible all needed decisions and permits from the Local Government;",
      },
    ],
  },
  {
    indent: 2,
    text: [
      {
        added:
          "(c) Identify, to the best extent possible, any applicable local bylaws and processes;",
      },
    ],
  },
  {
    indent: 2,
    text: [
      {
        added:
          "(d) Identify, to the best extent possible, any other potential permitting, design, or engineering obstacles or items of concern that might hinder the Applicant’s ability to secure all needed decisions within the 12-month approval timeframe; and",
      },
    ],
  },
  {
    indent: 2,
    text: [
      {
        added: "(e) Discuss dates, times, and locations for an information session, if applicable.",
      },
    ],
  },

  { kind: "heading", text: ["Fifth:"] },

  { kind: "heading", text: ["A. Section 10.4.6 Lapse, shall be amended as follows:"] },
  {
    indent: 1,
    text: [
      "Special permits shall lapse if a substantial use thereof or construction thereunder has not begun, except for good cause, within ",
      { added: "36 " },
      { struck: "24 " },
      "months following the filing of the special permit approval (plus such time required to pursue or await the determination of an appeal referred to in MGL c. 40A,§ 17, from the grant thereof) with the City Clerk.",
    ],
  },

  {
    kind: "heading",
    text: [
      "B. Section 11.1 shall be amended by adding the following definition in the appropriate alphabetical order:",
    ],
  },
  {
    indent: 1,
    text: [
      {
        added:
          "Performance Guarantee – a surety bond, saving account, tripartite agreement, covenant or other similar financial surety in an amount required by the provisions of this Ordinance.",
      },
    ],
  },

  { kind: "heading", text: ["Sixth:"] },

  { kind: "heading", text: ["A. Section 5.5.3 shall be amended as follows:"] },
  {
    indent: 1,
    text: [
      "Alteration to a structure which encroaches upon one or more required yard or setback areas, where the alteration will comply with all current setback, yard, building coverage and building height requirements ",
      {
        added:
          "or where there is either a horizontal or vertical extension along the same non-conforming side or rear setbacks or if there is an intensification of lot coverage",
      },
      ".",
    ],
  },
  {
    indent: 1,
    text: [
      "In the event that the Building Commissioner determines that the nonconforming nature of such structure would be increased by the proposed reconstruction, extension, alteration, or change, the Board of Appeals may, by special permit, allow such reconstruction, extension, alteration, or change where it determines that the proposed modification will not be substantially more detrimental than the existing nonconforming structure to the neighborhood.",
    ],
  },

  { kind: "heading", text: ["B. Section 5.6 shall be amended as follows:"] },
  {
    indent: 1,
    text: [
      "A nonconforming use or structure which has been abandoned, or not used for a period of ",
      { struck: "two " },
      { added: "four " },
      "years, shall lose its protected status and be subject to all of the provisions of this zoning by-law; provided, however, that such use or structure may be restored to its protected status by special permit from the City Council.",
    ],
  },

  { kind: "heading", text: ["Seventh:"] },
  { text: ["Section 11.1 Add the following new definition is alphabetical order:"] },
  {
    indent: 1,
    text: [
      {
        added:
          "Data Center: A physical facility or building use to house computer systems, servers, and associated components for storing, processing, and distributing digital information.",
      },
    ],
  },

  { kind: "heading", text: ["Eighth:"] },
  {
    text: [
      "Appendix A, Table 1: Table of Use and Parking Regulations should be amended as set forth on the attached table:",
    ],
  },
]

/** The fifteen columns the use table heads itself with, as it prints them. */
export const COLUMNS = [
  "RS",
  "RR",
  "RL",
  "RM",
  "RH",
  "RU",
  "CN",
  "CH",
  "CG",
  "CC",
  "CM",
  "OP",
  "BG",
  "BP",
  "PC",
]

/**
 * The four rows the attached table marks, out of the whole Table of Use and
 * Parking Regulations. The table runs to fifteen pages and the order marks
 * nothing on the other fourteen, so these four rows are the amendment; the
 * unmarked rows are the table as it stands and are in `use-table.pdf` at the
 * foot of the item page. Each row sits under the group heading the table
 * prints it under, so a reader can see which part of the table has moved.
 *
 * "21. Data Center" is wholly new -- the order's Seventh defines the term and
 * this row prohibits the use in every district -- so the copy prints every one
 * of its cells in bold and underlined and each is an addition here.
 *
 * The label of "12. Accessory storage" is itself amended, and a `TableLine`
 * label is a plain string with nowhere to put a mark, so the label here is the
 * amended one and the change to it is drawn as a paragraph in `TABLE_TEXT`
 * below, where the marks can be shown.
 */
export const USE_TABLE: TableLine[] = [
  { heading: "A. RESIDENTIAL USES" },
  {
    label: "3. Three-family dwelling",
    cells: [
      "N",
      "N",
      "N",
      "N",
      "CC",
      { was: "CC", now: "Y" },
      "N",
      "N",
      "CC",
      "N",
      "N",
      "N",
      "N",
      "N",
      "K",
    ],
  },
  { heading: "J. INDUSTRIAL USES" },
  {
    label: "21. Data Center",
    cells: Array.from({ length: 15 }, () => ({ was: "", now: "N" })),
  },
  { heading: "K. ACCESSORY USES" },
  {
    label: "5. Family day-care home, large",
    cells: [
      { was: "BA", now: "Y" },
      { was: "BA", now: "Y" },
      { was: "BA", now: "Y" },
      { was: "BA", now: "Y" },
      { was: "BA", now: "Y" },
      { was: "BA", now: "Y" },
      { was: "BA", now: "Y" },
      { was: "BA", now: "Y" },
      { was: "BA", now: "Y" },
      { was: "BA", now: "Y" },
      { was: "N", now: "Y" },
      { was: "BA", now: "Y" },
      { was: "BA", now: "Y" },
      { was: "BA", now: "Y" },
      "None",
    ],
  },
  {
    label: "12. Accessory storage, see section 3.2.2.2 a. and b. for limitations.",
    cells: [
      { was: "N", now: "Y" },
      { was: "N", now: "Y" },
      { was: "N", now: "Y" },
      { was: "N", now: "Y" },
      { was: "N", now: "Y" },
      { was: "N", now: "Y" },
      "Y",
      "Y",
      "Y",
      "Y",
      "Y",
      "Y",
      "Y",
      "Y",
      "None",
    ],
  },
]

/**
 * The marked text of the attached table that is not a cell: the wording of
 * K.12's own row label, and the Notes to Use Table printed under the table,
 * three of whose nine notes the copy marks. The marks on C, D and E take the S
 * and I districts out of the notes, the same housekeeping the order's Second A
 * and C do in the sign sections.
 *
 * Only the headings here are ours, and each is the handle the table itself
 * gives the block it names.
 */
export const TABLE_TEXT: Redline = [
  { kind: "heading", text: ["K. ACCESSORY USES, 12. Accessory storage"] },
  {
    text: [
      "12. Accessory storage",
      { added: ", see section 3.2.2.2 a. and b. for limitations." },
      {
        struck:
          " of 1 trailer for/or 1 unregistered automobile or boat, provided such shall either be stored within a principal or accessory building or behind the building line within the side or rear yards and shall not be used for dwelling or sleeping purposes",
      },
    ],
  },

  { kind: "heading", text: ["Notes to Use Table"] },
  {
    text: [
      "A. With the exception of Interstate Route 495, no automobile service station shall be built within a 500-foot radius of the property line of an already existing automobile service station. On Interstate Route 495, no automobile service station shall be built within 500 feet of the property line of an already existing automobile service station on the same side of the highway.",
    ],
  },
  {
    text: ["B. Trailers shall be prohibited in any district, except as provided for in this item."],
  },
  {
    text: [
      "C. Access from any R ",
      { struck: "or S " },
      "Zoning District to an existing roadway which must pass through or into any other R ",
      { struck: "or S " },
      "Zoning or through any C ",
      { struck: "or I " },
      "District is permitted.",
    ],
  },
  {
    text: [
      "D. Access from any ",
      { struck: "I or " },
      "C Zoning District to an existing roadway which must pass through or into any other ",
      { struck: "I or " },
      "C Zoning District is permitted.",
    ],
  },
  {
    text: [
      "E. Access from any ",
      { struck: "I or " },
      "C Zoning District to an existing roadway which must pass through an R ",
      { struck: "or S " },
      "Zoning District may be permitted by a special permit issued by the Board of Appeals.",
    ],
  },
  {
    text: [
      "F. Over three coin-operated machines, as defined in Chapter 104 of the Code, in any establishment other than bars, clubs and bowling alleys and skating rinks, constitute an amusement arcade (under the general category of amusement facility) allowed only in CH, CG, BG, and BP [1] Zones throughout the City (except for the central business district as defined below where arcades shall not be allowed) which requires a special permit from the Board of Appeals. The sale and/or consumption of alcoholic beverages shall be prohibited in all amusement arcades. For the purpose of this section, the central business district is defined as that area enclosed by the following boundaries: Starting at the point of intersection of Mill Street and Ginty Boulevard southerly along the project center line of Mill Street to the Merrimack River floodwall; thence westerly along the floodwall to its intersection with the B & M railway line; thence northerly along the railway line to its intersection with the projected center line of Granite Street; thence northeasterly along the center lines of Granite Street and Locust Street to Walnut Street; thence southwesterly along the center line of Walnut Street to Bailey Boulevard; thence easterly along the center lines of Bailey Boulevard and Ginty Boulevard to the point of origin.",
    ],
  },
  {
    text: [
      "G. Unless specifically exempted by the Building Inspector because of exceptional architectural design and/or site considerations, new single- and two-family structures shall be designed so that the principal facade, i.e., that facade containing the principal entrance (front door), shall be basically parallel to the front lot line.",
    ],
  },
  {
    text: [
      "H. Once a principal facade has been established for any structure or building, whether existing or new, the area between such facade and the adjacent street or public approach to the structure or building shall not be built upon or used for an unattached building or structure in excess of 10 feet in height. This shall apply to the RU and RH Zoning areas only.",
    ],
  },
  {
    text: [
      "I. For all mixed use buildings, parking shall be provided cumulatively for each use in the building.",
    ],
  },
]
