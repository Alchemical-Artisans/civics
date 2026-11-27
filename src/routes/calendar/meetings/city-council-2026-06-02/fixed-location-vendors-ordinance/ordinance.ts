import type { Redline } from "$lib/redline"

/**
 * Chapter 191, Article IV, as the ordinance of 2 June 2026 would amend it,
 * transcribed from the marked-up copy in the packet, mark for mark. That copy
 * sets its deletions struck through and its additions in bold underline; a
 * `struck` passage here is one the copy strikes and an `added` one is one it
 * underlines, and nothing is derived.
 *
 * Two places the marks are read rather than copied:
 *
 * - § 191-9 A. The copy's addition begins "and, in the case of any fixed- *   location vendor ..." after a plain comma, and ends on an underlined full
 *   stop. Today's sentence ends "telephone number of the vendor." with a stop
 *   and no comma, so the comma is entered as part of the addition and the
 *   stop as kept, which is the only reading under which both sides are
 *   sentences.
 * - § 191-11 B. "every two years" has "two" struck and the "s" of "years"
 *   struck, leaving "every year"; read off a 400 dpi crop.
 *
 * The copy letters the new paragraph after § 191-11 C as "(D)", in
 * parentheses, where the section's other paragraphs are "A.", "B.", "C.";
 * kept as printed. The enacting clause ("BE IT ORDAINED ...") is the order's
 * and stays on the item page.
 *
 * Source: `excerpts/city-council-2026-06-02/fixed-location-vendors-ordinance/
 * ordinance-amendments-marked.pdf`, pages 157 to 162 of the packet.
 */

export const HEADING = {
  chapter: "Chapter 191",
  article: "Article IV",
  title: "Peddlers and Hawkers, Transient Vendors and Fixed Location Vendors",
}

export const REDLINE: Redline = [
  { kind: "heading", text: ["§ 191-8. Definitions."] },
  {
    text: [
      "The following words shall for the purposes of this article have the following meanings, unless the context requires otherwise:",
    ],
  },
  { kind: "term", text: ["FIXED LOCATION VENDOR"] },
  {
    indent: 1,
    text: [
      "Any person who, for himself or for another person, engages in the sale of goods, wares, merchandise, food or beverages at a fixed location which is carried on in any fixed or mobile cart, wagon or tables.",
      {
        added:
          " The term shall not include bona fide nonprofit, civic, charitable, or youth organizations conducting occasional fundraising sales or events not operated as a continuous commercial vending activity.",
      },
    ],
  },
  { kind: "term", text: ["HAWKER or PEDDLER"] },
  {
    indent: 1,
    text: [
      "Any person who, for himself or for another person, travels by foot, automobile or any other type of conveyance from place to place, from house to house, or from street to street, taking or attempting to lease or take orders for retail sale of goods, wares, merchandise, or services. This shall include persons engaged in door-to-door sale for future delivery as defined by MGL c. 101, § 34.",
    ],
  },
  { kind: "term", text: ["SEASONAL PRODUCTS"] },
  { indent: 1, text: ["Christmas trees, wreaths, baskets, blooming plants and cut flowers."] },
  { kind: "term", text: ["TRANSIENT VENDOR"] },
  {
    indent: 1,
    text: [
      "Any person who, for himself or for another person, who engages in a temporary or transient business in the commonwealth selling goods, wares or merchandise, either in one locality or in traveling from place to place. Temporary or transient business shall mean any exhibition and sale of goods, wares or merchandise which is carried on in any tent, booth, building or other structure, unless such place is open for business during usual business hours for a period of at least 12 consecutive months.",
    ],
  },
  { kind: "heading", text: ["§ 191-9 Licenses."] },
  {
    text: [
      "It shall be unlawful for any person, firm or corporation to engage in the business of hawker/peddler without first having secured a state license or a license from the City. It shall be unlawful for any person, firm or corporation to engage in the business of transient vendor without first having secured a state license and a license from the City. It shall be unlawful for any person, firm or corporation to engage in the business of fixed location vendor without first having secured a license from the City.",
    ],
  },
  {
    indent: 1,
    text: [
      "A. Application. Applications for permission to use City property or to sell on City streets, sidewalks, public ways or in any public space shall be made to the City Clerk and shall be subject to the approval of the City Council. Applications shall state thereon the kind of merchandise to be sold, the proposed location of the business, the dates and times of operation and the permanent address and telephone number of the vendor",
      {
        added:
          ", and, in the case of any fixed-location vendor selling food or beverage items, a detailed menu or list of all proposed food and beverage items to be sold, including any proposed substitutions or seasonal variations",
      },
      ".",
    ],
  },
  {
    indent: 1,
    text: [
      "B. Fee. The fee for a hawker/peddler license shall be $62, unless the applicant has a state license in which case there shall be no fee. The fee for a transient vendor or a fixed location vendor shall be $100 for a period of less than 30 days or $300 for a period exceeding 30 days.",
    ],
  },
  {
    indent: 1,
    text: [
      "C. Prior approvals. Before such a permit is issued, approval shall be obtained from the Chief of Police (registration and traffic safety, etc.); Building Inspector (signs, zoning, regulations, etc.); Wiring Inspector (lights, etc.); Recreation Director (use of Riverside Park and area in front of or on the side of Haverhill Stadium); Fire Inspector; and Health Department (food or beverage sales).",
    ],
  },
  {
    indent: 1,
    text: [
      "D. Hours of operation. No sales activity shall be allowed before 9:00 a.m. and after 9:00 p.m. without the prior permission of the City Council.",
    ],
  },
  {
    indent: 1,
    text: [
      "E. The sale of silly string or similar type goods or snap caps and stink bombs or similar explosives or any facsimile cigarettes during a parade or public event in the City of Haverhill is prohibited.",
    ],
  },
  {
    indent: 1,
    text: [
      "F. A permit to sell may only be used by the person whose name appears on the City license, unless an employee is working under a licensed vendor and obtains a separate employee license. The fee for such an employee license shall be $25, and the employee license shall run with the term of the licensed vendor.",
    ],
  },
  {
    indent: 1,
    text: [
      "G. No transient vendor or fixed location vendor license shall be issued without the applicant indemnifying the City of Haverhill from any and all claims arising out of the maintenance of such a location and by placing on file a sidewalk obstruction bond in the amount of $5,000 as set forth in § 222-46 of this Code.",
    ],
  },
  {
    indent: 1,
    text: [
      "H. All permits issued under this section may be effective for up to one year, commencing on January 1 and with an expiration date of December 31 of the year in which the permit is granted. Any license which is not renewed for the upcoming year by December 1 of the prior year may be subject to reassignment in accordance with the provisions of § 191-11B.",
    ],
  },
  {
    indent: 1,
    text: [
      "I. Any person, firm or corporation engaging in the business of hawker/peddler within the City of Haverhill who is operating on the basis of a state license solely shall register with the Chief of Police at least 24 hours prior to conducting business and shall provide the kind of merchandise to be sold, the proposed areas and locations in which they will engage in their business, the dates and times of operation, the permanent address and telephone number of the vendor, and a copy of a valid state hawker/peddler license.",
    ],
  },
  { indent: 1, text: ["J. Door-to-door sales."] },
  {
    indent: 2,
    text: [
      "(1) Any person, firm or corporation engaging in the business of door-to-door sales for future delivery shall comply with all provisions of M.G.L. c. 101, § 34. The Chief of Police shall be the designated official for the registration required by M.G.L. c. 101, § 34. The Chief of Police may make reasonable rules and regulations for such registrations and persons engaged in the business of door-to-door sales consistent with M.G.L. c. 101, § 34. A registration fee of $100 shall be paid to the Police Department for each person so registered.",
    ],
  },
  { indent: 2, text: ["(2) Signs prohibiting solicitation; trespass."] },
  {
    indent: 3,
    text: [
      '(a) It shall be unlawful for any salesperson to enter the premises or remain on property displaying a "No Trespassing" or "No Solicitation" sign.',
    ],
  },
  {
    indent: 3,
    text: [
      "(b) It shall be unlawful for any salesperson to ignore a no-solicitation directive or remain on private property after a resident or resident's representative has indicated that the salesperson is not welcome.",
    ],
  },
  { indent: 2, text: ["(3) Do Not Knock Registry."] },
  {
    indent: 3,
    text: [
      '(a) The Police Department shall prepare a list of addresses of those premises where the owner and/or occupant has notified the Chief of Police, or his designee, that a door-to-door salesperson, hawker, peddler or any other person, including corporate or business entities, wishing to sell wares or services in all districts, in locations which are not stationary, are not permitted on the premises (hereinafter referred to as the "Do Not Knock Registry"). Notification shall be by completion of a form available at the Police Department.',
    ],
  },
  {
    indent: 3,
    text: [
      "(b) The Chief of Police or designee shall distribute the current Do Not Knock Registry to a person or entity licensed under this section at the time of issuance of the license. The licensee shall not peddle, canvass, or conduct door-to-door sales at any premises identified on the then current Do Not Knock Registry.",
    ],
  },
  {
    indent: 2,
    text: [
      "(4) Exemptions. The above provisions shall not apply to any person who goes door to door for the purpose of advocating any religious, political, social or other position or belief protected by the federal or state constitution, the sale or delivery of newspapers, any corporation organized for charitable purposes, such as schools or the Boy/Girl Scouts, and candidates for public office.",
    ],
  },
  {
    indent: 2,
    text: [
      "(5) Penalties. Any canvasser, peddler, itinerant vender or owner or employee of a door-to-door sales enterprise who violates any provision of this section shall be:",
    ],
  },
  { indent: 2, text: ["(6) Subject to a fine of $300 per offense; and/or"] },
  {
    indent: 2,
    text: ["(7) Subject to a one-year revocation of any license issued by the Chief of Police."],
  },
  { kind: "heading", text: ["§ 191-10 Seasonal products; fee."] },
  {
    text: [
      "It shall be unlawful for any person, firm or corporation to engage in the business of transient vendor or fixed location vendor for the sale of seasonal products without first having secured a City license pursuant to the requirements of § 191-9. The fee for a license to sell seasonal products shall be $200.",
    ],
  },
  { kind: "heading", text: ["§ 191-11. Permitted fixed locations; exceptions."] },
  {
    text: [
      "A. Permitted locations. Selling within the City of Haverhill of products licensed under § 191-9 by fixed-location vendors shall only be permitted within the boundaries of ",
      { struck: "these" },
      " ",
      { added: "the following" },
      " areas;",
      {
        added:
          " provided, however, that at any location where more than one vendor is authorized, no two vendors shall principally sell the same primary product or food item.",
      },
    ],
  },
  { indent: 1, text: ["(1) Winnekenni area, Route 110: one vendor."] },
  { indent: 1, text: ["(2) Bradford Common: one vendor.*"] },
  {
    indent: 1,
    text: ["(3) Riverside Park: ", { struck: "one vendor." }, " ", { added: "four vendors." }],
  },
  { indent: 1, text: ["(4) Washington Square: one vendor."] },
  {
    indent: 1,
    text: ["(5) GAR Park: ", { struck: "one vendor." }, " ", { added: "two vendors." }],
  },
  {
    indent: 1,
    text: ["(6) Swasey Park: ", { struck: "one vendor." }, " ", { added: "two vendors." }],
  },
  {
    indent: 1,
    text: [
      "(7) Outside Haverhill Stadium at Lincoln and Nettleton Avenues: ",
      { struck: "one vendor." },
      " ",
      { added: "two vendors." },
    ],
  },
  {
    indent: 1,
    text: [
      {
        added:
          "(8) Riverfront Park: one vendor, provided, however, that no food trucks shall be permitted as provided in § 191-30, and that any vendor operating at Riverfront Park shall not principally sell food or beverage items that are substantially similar to the primary menu offerings of existing fixed-location food service establishments located within the Central Business District, as defined by § 11-70 of this Code.",
      },
    ],
  },
  { indent: 1, text: [{ added: "(9) Plug Pond: one vendor." }] },
  {
    indent: 1,
    text: [
      { struck: "(8)" },
      " ",
      { added: "(10)" },
      " Other areas as approved by the City Council.",
    ],
  },
  {
    indent: 2,
    text: [
      "* An enclosed cart 8.5 x 12 feet, excluding hitch, is allowed at the Bradford site only. Any party desiring a similar type of cart at any other location must petition the City Council for permission",
    ],
  },
  {
    text: [
      "B. Vacated locations. Persons who wish to be considered for a permit for one of the above locations, when vacated, may notify the City Clerk, who shall maintain a waiting list, including the person's name, address and a date of receipt. Interested parties shall be notified when a location is vacated and shall have 30 days to apply for issuance of a permit. If more than one person applies for a particular site, preference shall be given to the earliest qualified applicant, as determined by the ",
      { struck: "City Council" },
      " ",
      { added: "date stamp of the application received by the City Clerk" },
      ". If no person has applied for a permit within 30 days or if there are no persons on the waiting list, the location shall be granted to the earliest qualified applicant, if the City Council so determines. The waiting list must be renewed every ",
      { struck: "two " },
      "year",
      { struck: "s" },
      ", with those applicants on the list to be notified by the City Clerk by regular U.S. mail to renew the application by November 1. Persons may be permitted for more than one location if allowed by the City Council. Any person with a valid permit who fails to operate his/her location for a period of less than four days per calendar week, Sunday through Saturday, weather permitting, from Memorial Day through Labor Day, may have said permit be subject to revocation by the City Council, after notice and hearing.",
    ],
  },
  {
    text: [
      "C. Exceptions. The following areas shall not be permitted to have any type of selling by either a transient vendor or hawker/peddler:",
    ],
  },
  { indent: 1, text: ["(1) All municipal parking areas."] },
  { indent: 1, text: [{ struck: "(2) Plug Pond." }] },
  {
    indent: 1,
    text: [{ struck: "(3)" }, " ", { added: "(2)" }, " Meadowbrook Conservation Area."],
  },
  {
    indent: 1,
    text: [
      { struck: "(4)" },
      " ",
      { added: "(3)" },
      " Within 300 feet of any public school building, notwithstanding the provisions of § 191-2.",
    ],
  },
  {
    indent: 1,
    text: [
      { struck: "(5)" },
      " ",
      { added: "(4)" },
      " Within 25 feet of any parade route commencing 1/2 hour prior to the start of said parade, except for those permitted to sell in accordance with § 191-12.",
    ],
  },
  {
    text: [
      {
        added:
          "(D) Compliance with City Clerk Regulations. All approved vendors shall comply with all rules, regulations, permitting requirements, and mapping locations as established by the City Clerk's Office relating to fixed-location vendors, as the same may be amended from time to time.",
      },
    ],
  },
  { kind: "heading", text: ["§ 191-12 Special events."] },
  {
    indent: 1,
    text: [
      "A. Fixed location vendors shall also be permitted to operate during special events, provided that a notification of intent to operate during the special event is filed with the event director or committee at least 30 days prior to said special event and the event director or committee approves the specific location. The event director or committee shall not unreasonably withhold approval for operation during a special event; however, the event director or committee shall have exclusive jurisdiction over the assigned specific location at which any person(s) may operate.[1]",
    ],
  },
  { kind: "heading", text: ["§ 191-13 Fraud; violations and penalties."] },
  {
    indent: 1,
    text: [
      "A. Fraud. Any licensed transient vendor or peddler or hawker who shall be guilty of any fraud, cheating or misrepresentation, whether through himself or through an employee, while acting in the City, or who shall barter, sell or peddle any goods or merchandise or wares other than those specified in his application for a license or who shall fail to comply with the conditions and restrictions contained herein shall be deemed guilty of a violation of this article.",
    ],
  },
  {
    indent: 1,
    text: [
      "B. Penalty. Any person, firm or corporation violating any provision of this article shall be fined not less than $50 nor more than $250 for each offense, and a separate offense shall be deemed committed on each day during or on which a violation occurs or continues.",
    ],
  },
]
