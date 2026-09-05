/**
 * The revenue tables of "2027 Revenue Estimates" (pages 48-63) and "2027
 * Budget in Brief" (78).
 *
 * Data rather than markup for the same reason `spending/tables.ts` is: a
 * chart needs a column out of these, so there is one copy of the figures and
 * both the transcription and the chart render from it. Nothing here formats
 * anything -- the cells are the strings the book prints.
 */
import { column, cell, amount, sum, type BudgetTableData } from "$lib/budget-table"
import { ENTERPRISE_REVENUE } from "../council-orders"

/** Page 78: the revenue behind it, and the surplus the two leave. */
export const REVENUE: BudgetTableData = {
  columns: [
    "Revenue",
    "2022 Actual",
    "2023 Actual",
    "2024 Actual",
    "2025 Budgeted",
    "2026 Budgeted",
    "2027 Proposed",
  ],
  rows: [
    {
      label: "CH 70 STATE AID",
      cells: [
        "$64,982,436",
        "$73,906,310",
        "$82,633,811",
        "$87,968,052",
        "$94,219,635",
        "$96,427,042",
      ],
    },
    {
      label: "FEES",
      cells: ["$1,120,263", "$1,128,853", "$1,118,203", "$1,157,268", "$962,670", "$998,900"],
    },
    {
      label: "FINES & FORFEITS",
      cells: ["$738,716", "$867,029", "$725,450", "$674,504", "$628,275", "$625,000"],
    },
    {
      label: "INVESTMENTS",
      cells: ["$282,915", "$1,606,088", "$3,222,599", "$3,120,502", "$1,976,991", "$1,000,000"],
    },
    {
      label: "LICENSE & PERMITS",
      cells: ["$3,678,439", "$4,098,379", "$3,042,484", "$2,888,395", "$2,289,912", "$2,300,000"],
    },
    {
      label: "MEDICAID REIMBURSEMENT",
      cells: ["$1,069,782", "$789,022", "$796,530", "$1,014,469", "$950,000", "$1,000,000"],
    },
    { label: "MISC. REVENUE", cells: ["$1,782,442", "$212,916", "$97,122", "–", "", ""] },
    {
      label: "MOTOR VEHICLE EXCISE",
      cells: ["$7,620,870", "$7,700,291", "$8,459,321", "$9,308,339", "$8,477,111", "$9,025,789"],
    },
    {
      label: "OTHER AVAILABLE REVENUE SOURCES",
      cells: ["$6,539,817", "$7,717,830", "$7,065,921", "$6,290,257", "$6,233,062", "$6,210,304"],
    },
    {
      label: "OTHER DEPT. REVENUE",
      cells: ["$707,963", "$672,134", "$817,194", "$899,501", "$658,253", "$555,000"],
    },
    {
      label: "OTHER EXCISE",
      cells: ["$2,507,796", "$2,779,100", "$2,797,580", "$2,793,127", "$2,711,464", "$2,751,440"],
    },
    {
      label: "PENALTIES & INTEREST",
      cells: ["$473,484", "$609,464", "$800,461", "$743,548", "$742,361", "$742,000"],
    },
    {
      label: "PILOT & WASTE DISPOSAL FEE",
      cells: ["$2,603,112", "$2,762,606", "$3,179,846", "$3,119,403", "$3,014,364", "$3,304,799"],
    },
    {
      label: "RENTALS",
      cells: ["$152,470", "$191,513", "$225,058", "$199,510", "$198,450", "$198,450"],
    },
    {
      label: "STATE AID (CHERRY SHEET) W/O CH. 70",
      cells: [
        "$12,488,365",
        "$13,610,828",
        "$13,699,120",
        "$13,999,214",
        "$13,815,512",
        "$14,026,061",
      ],
    },
    {
      label: "TAX LEVY",
      cells: [
        "$114,902,414",
        "$119,020,237",
        "$122,155,147",
        "$133,336,191",
        "$140,340,389",
        "$146,107,374",
      ],
    },
    {
      label: "Grand Total",
      cells: [
        "$221,651,283",
        "$237,672,599",
        "$250,835,847",
        "$267,512,280",
        "$277,218,449",
        "$285,272,159",
      ],
    },
    {
      label: "Budget Surplus (Deficit)",
      emphasis: true,
      cells: ["$4,942,571", "$5,484,988", "$3,786,653", "$5,322,189", "$1", "$(0)"],
    },
  ],
}

/**
 * Page 63, "Other Available Revenue": the three things behind the page-78 line
 * of that name, which is the one line of the book's revenue table that is not
 * revenue.
 *
 * Data rather than markup because the front page's charts need it broken open:
 * free cash is last year's surplus rather than this year's income, and a chart
 * that counts it as revenue hides that the year does not pay for itself.
 */
export const OTHER_AVAILABLE: BudgetTableData = {
  columns: [
    "Other Available Revenue",
    "2023 Actual",
    "2024 Actual",
    "2024 % Change",
    "2025 Actual",
    "2025 % Change",
    "2026 Projected",
    "2027 Proposed",
    "2027 % Change",
  ],
  rows: [
    {
      label: "Free Cash (Budget Only)",
      cells: [
        "$6,508,915",
        "$6,193,120",
        "-4.9%",
        "$5,300,000",
        "-14.4%",
        "$5,200,000",
        "$5,150,000",
        "-1.0%",
      ],
    },
    {
      label: "Transfer From Enterprise",
      cells: ["$854,634", "$872,801", "2.1%", "$890,257", "2.0%", "$908,062", "$935,304", "3.0%"],
    },
    {
      label: "Transfer from Trust & Agency",
      cells: ["$354,281", "–", "-100.0%", "$100,000", "0.0%", "$125,000", "$125,000", "0.0%"],
    },
    {
      label: "Grand Total",
      cells: [
        "$7,717,830",
        "$7,065,921",
        "-8.4%",
        "$6,290,257",
        "-11.0%",
        "$6,233,062",
        "$6,210,304",
        "-0.4%",
      ],
    },
  ],
}

/**
 * Page 49, "Historical State Aid & State Assessments": the Cherry Sheet, gross
 * of the assessments the Commonwealth nets against it. Six lines is what state
 * aid actually is behind the two page-78 rows that roll it up -- almost all of
 * it Chapter 70, the rest five much smaller reimbursements and exemptions --
 * and the House Budget column is what the book carries into every later table:
 * its "Sub-Total Cherry Sheet Receipts" of $110,453,103 is CH 70 STATE AID
 * ($96,427,042) and STATE AID (CHERRY SHEET) W/O CH. 70 ($14,026,061) added
 * back together, to the dollar.
 */
export const STATE_AID: BudgetTableData = {
  columns: [
    "",
    "2023 Final Conference Committee",
    "2024 FINAL Conference Committee",
    "2024 % Change",
    "2025 FINAL Conference Committee",
    "2025 % Change",
    "2026 FINAL Conference Committee",
    "2026 % Change",
    "2027 Governor's Budget",
    "2027 House Budget",
    "2027 % Change",
  ],
  rows: [
    {
      label: "Chapter 70",
      cells: [
        "$73,906,310",
        "$82,633,811",
        "11.8%",
        "$87,968,052",
        "6.5%",
        "$94,219,635",
        "7.1%",
        "$96,427,042",
        "$96,427,042",
        "2.3%",
      ],
    },
    {
      label: "Charter Tuition Reimbursement",
      cells: [
        "$1,611,461",
        "$1,377,211",
        "-14.5%",
        "$1,345,511",
        "-2.3%",
        "$787,542",
        "-41.5%",
        "$1,170,508",
        "$942,297",
        "19.7%",
      ],
    },
    {
      label: "Veterans Benefits",
      cells: [
        "$411,550",
        "$381,368",
        "-7.3%",
        "$356,397",
        "-6.5%",
        "$457,435",
        "28.3%",
        "$409,676",
        "$407,089",
        "-11.0%",
      ],
    },
    {
      label: "Elderly & Veterans Exemptions",
      cells: [
        "$201,319",
        "$189,452",
        "-5.9%",
        "$193,696",
        "2.2%",
        "$333,805",
        "72.3%",
        "$347,433",
        "$347,433",
        "4.1%",
      ],
    },
    {
      label: "State Owned Land",
      cells: [
        "$1,445",
        "$1,714",
        "18.6%",
        "$1,754",
        "2.3%",
        "$1,754",
        "0.0%",
        "$1,799",
        "$1,794",
        "2.3%",
      ],
    },
    {
      label: "Unrestricted General Government Aid",
      cells: [
        "$11,385,053",
        "$11,749,375",
        "3.2%",
        "$12,101,856",
        "3.0%",
        "$12,234,976",
        "1.1%",
        "$12,540,132",
        "$12,327,448",
        "0.8%",
      ],
    },
    {
      label: "Sub-Total Cherry Sheet Receipts",
      cells: [
        "$87,517,138",
        "$96,332,931",
        "10.1%",
        "$101,967,266",
        "5.8%",
        "$108,035,147",
        "6.0%",
        "$110,896,590",
        "$110,453,103",
        "2.2%",
      ],
    },
    {
      label: "OFFSET ITEMS: School Choice & Library",
      emphasis: true,
      cells: [
        "$246,346",
        "$247,461",
        "0.5%",
        "$253,042",
        "2.3%",
        "$231,585",
        "-8.5%",
        "$236,856",
        "$229,856",
        "-0.7%",
      ],
    },
    {
      label: "Total Cherry Sheet Receipts",
      cells: [
        "$87,763,484",
        "$96,580,392",
        "10.0%",
        "$102,220,308",
        "5.8%",
        "$108,266,732",
        "5.9%",
        "$111,133,446",
        "$110,682,959",
        "2.2%",
      ],
    },
    {
      label: "Assessments - SPECIAL EDUCATION",
      cells: [
        "$(77,160)",
        "$(48,662)",
        "-36.9%",
        "$(43,634)",
        "-10.3%",
        "$(38,054)",
        "-12.8%",
        "$(38,077)",
        "$(38,531)",
        "1.3%",
      ],
    },
    {
      label: "Assessments - SCHOOL CHOICE SENDING",
      cells: [
        "$(1,010,851)",
        "$(986,813)",
        "-2.4%",
        "$(1,081,431)",
        "9.6%",
        "$(1,237,105)",
        "14.4%",
        "$(1,761,487)",
        "$(1,398,390)",
        "13.0%",
      ],
    },
    {
      label: "Assessments - CHARTER SCHOOL",
      cells: [
        "$(6,113,639)",
        "$(6,651,955)",
        "8.8%",
        "$(7,027,626)",
        "5.6%",
        "$(7,119,904)",
        "1.3%",
        "$(7,645,932)",
        "$(7,576,328)",
        "6.4%",
      ],
    },
    {
      label: "Assessments - AIR POLLUTION DISTRICTS",
      cells: [
        "$(19,010)",
        "$(19,743)",
        "3.9%",
        "$(20,202)",
        "2.3%",
        "$(21,072)",
        "4.3%",
        "$(19,979)",
        "$(19,979)",
        "-5.2%",
      ],
    },
    {
      label: "Assessments - RMV NON-RENEWAL",
      cells: [
        "$(126,140)",
        "$(100,280)",
        "-20.5%",
        "$(124,500)",
        "24.2%",
        "$(124,500)",
        "0.0%",
        "$(130,180)",
        "$(130,180)",
        "4.6%",
      ],
    },
    {
      label: "Assessments - MBTA",
      cells: [
        "$(850,089)",
        "$(871,341)",
        "2.5%",
        "$(893,125)",
        "2.5%",
        "$(919,762)",
        "3.0%",
        "$(942,755)",
        "$(942,755)",
        "2.5%",
      ],
    },
    {
      label: "Assessments - MOSQUITO CONTROL",
      cells: [
        "$(144,859)",
        "$(148,317)",
        "2.4%",
        "$(153,875)",
        "3.7%",
        "$(160,649)",
        "4.4%",
        "$(165,272)",
        "$(165,272)",
        "2.9%",
      ],
    },
    {
      label: "Total Cherry Sheet Assessments",
      cells: [
        "$(8,341,748)",
        "$(8,827,111)",
        "5.8%",
        "$(9,344,393)",
        "5.9%",
        "$(9,621,046)",
        "3.0%",
        "$(10,703,682)",
        "$(10,271,435)",
        "6.8%",
      ],
    },
    {
      label: "TOTAL ESTIMATED CHERRY SHEET LESS OFFSETS & ASSESSMENTS",
      cells: [
        "$79,421,736",
        "$87,753,281",
        "10.5%",
        "$92,875,915",
        "5.8%",
        "$98,645,686",
        "6.2%",
        "$100,429,764",
        "$100,411,524",
        "1.8%",
      ],
    },
  ],
}

const HISTORICAL_YEARS: BudgetTableData["columns"] = [
  "2023 Actual",
  "2024 Actual",
  "2024 % Change",
  "2025 Actual",
  "2025 % Change",
  "2026 Projected",
  "2027 Proposed",
  "2027 % Change",
  "2027 $ Change",
]

/** Page 59, "Local Excise Taxes": motor vehicle excise and the four others. */
export const EXCISE: BudgetTableData = {
  columns: ["Excise", ...HISTORICAL_YEARS],
  rows: [
    {
      label: "Boat Excise",
      cells: [
        "$9,246",
        "$9,938",
        "7.5%",
        "$6,991",
        "-29.7%",
        "$8,497",
        "$6,900",
        "-18.8%",
        "$(1,597)",
      ],
    },
    {
      label: "Cannabis Excise",
      cells: [
        "$1,143,086",
        "$1,180,917",
        "3.3%",
        "$1,155,574",
        "-2.1%",
        "$1,133,040",
        "$1,133,040",
        "0.0%",
        "–",
      ],
    },
    {
      label: "Farm Animal Excise",
      cells: ["$1,953", "$2,358", "20.8%", "$1,506", "-36.1%", "", "$1,500", "0.0%", "$1,500"],
    },
    {
      label: "Hotel Room Tax",
      cells: [
        "$345,181",
        "$311,751",
        "-9.7%",
        "$316,502",
        "1.5%",
        "$309,979",
        "$310,000",
        "0.0%",
        "$21",
      ],
    },
    {
      label: "Meals Tax",
      cells: [
        "$1,279,635",
        "$1,292,616",
        "1.0%",
        "$1,312,554",
        "1.5%",
        "$1,259,948",
        "$1,300,000",
        "3.2%",
        "$40,052",
      ],
    },
    {
      label: "Motor Vehicle Excise",
      cells: [
        "$7,700,291",
        "$8,459,321",
        "9.9%",
        "$9,308,339",
        "10.0%",
        "$8,477,111",
        "$9,025,789",
        "6.5%",
        "$548,678",
      ],
    },
    {
      label: "Grand Total",
      cells: [
        "$10,479,391",
        "$11,256,901",
        "7.4%",
        "$12,101,467",
        "7.5%",
        "$11,188,575",
        "$11,777,229",
        "5.3%",
        "$588,654",
      ],
    },
  ],
}

/**
 * Page 60, "Other Local Receipts": the PILOT/waste-disposal line split from
 * penalties and interest, which page 78 rolls into one "PILOT & WASTE
 * DISPOSAL FEE" row.
 */
export const OTHER_LOCAL_RECEIPTS: BudgetTableData = {
  columns: ["", ...HISTORICAL_YEARS],
  rows: [
    {
      label: "Penalties and Interest on Excise",
      cells: [
        "$92,246",
        "$105,194",
        "14.0%",
        "$116,886",
        "11.1%",
        "$105,194",
        "$105,000",
        "-0.2%",
        "$(194)",
      ],
    },
    {
      label: "Penalties and Interest on Taxes",
      cells: [
        "$517,218",
        "$695,267",
        "34.4%",
        "$626,663",
        "-9.9%",
        "$637,167",
        "$637,000",
        "0.0%",
        "$(167)",
      ],
    },
    {
      label: "Payment in Lieu of Taxes",
      cells: [
        "$16,348",
        "$16,348",
        "0.0%",
        "$35,798",
        "119.0%",
        "$35,798",
        "$281,555",
        "686.5%",
        "$245,757",
      ],
    },
    {
      label: "Waste Disposal Facility Payment",
      cells: [
        "$2,746,258",
        "$3,163,498",
        "15.2%",
        "$3,083,604",
        "-2.5%",
        "$2,978,566",
        "$3,023,244",
        "1.5%",
        "$44,678",
      ],
    },
    {
      label: "Grand Total",
      cells: [
        "$3,372,070",
        "$3,980,307",
        "18.0%",
        "$3,862,951",
        "-2.9%",
        "$3,756,725",
        "$4,046,799",
        "7.7%",
        "$290,074",
      ],
    },
  ],
}

/** Page 61, "Fees". */
export const FEES: BudgetTableData = {
  columns: ["Fees", ...HISTORICAL_YEARS],
  rows: [
    {
      label: "Abandoned Property Fee",
      cells: ["$22,750", "$24,500", "7.7%", "$19,275", "-21.3%", "$10,000", "$10,000", "0.0%", "–"],
    },
    {
      label: "Ambulance Fee",
      cells: [
        "$150,000",
        "$155,250",
        "3.5%",
        "$160,684",
        "3.5%",
        "$135,770",
        "$140,000",
        "3.1%",
        "$4,230",
      ],
    },
    {
      label: "Clerk Fees",
      cells: [
        "$68,883",
        "$77,035",
        "11.8%",
        "$60,178",
        "-21.9%",
        "$50,000",
        "$55,000",
        "10.0%",
        "$5,000",
      ],
    },
    {
      label: "Fire",
      cells: [
        "$73,465",
        "$63,440",
        "-13.6%",
        "$56,308",
        "-11.2%",
        "$46,000",
        "$50,000",
        "8.7%",
        "$4,000",
      ],
    },
    {
      label: "Fire Detail Admin. Fee",
      cells: [
        "$7,396",
        "$6,900",
        "-6.7%",
        "$11,734",
        "70.1%",
        "$8,000",
        "$10,000",
        "25.0%",
        "$2,000",
      ],
    },
    {
      label: "Planning & Appeals",
      cells: [
        "$40,981",
        "$11,585",
        "-71.7%",
        "$14,600",
        "26.0%",
        "$14,000",
        "$14,000",
        "0.0%",
        "–",
      ],
    },
    {
      label: "Police Detail Administration Fee",
      cells: [
        "$95,017",
        "$106,098",
        "11.7%",
        "$129,193",
        "21.8%",
        "$109,000",
        "$115,000",
        "5.5%",
        "$6,000",
      ],
    },
    {
      label: "Police Misc Fees",
      cells: ["$3,720", "$6,435", "73.0%", "$4,215", "-34.5%", "$4,200", "$4,200", "0.0%", "–"],
    },
    {
      label: "Tax Collection Fees",
      cells: [
        "$665,771",
        "$666,186",
        "0.1%",
        "$695,926",
        "4.5%",
        "$585,000",
        "$600,000",
        "2.6%",
        "$15,000",
      ],
    },
    {
      label: "Waterway Fee",
      cells: ["$870", "$774", "-11.0%", "$735", "-5.0%", "$700", "$700", "0.0%", "–"],
    },
    {
      label: "Grand Total",
      cells: [
        "$1,128,853",
        "$1,118,203",
        "-0.9%",
        "$1,152,848",
        "3.1%",
        "$962,670",
        "$998,900",
        "3.8%",
        "$36,230",
      ],
    },
  ],
}

/**
 * Page 62, "Department Revenue": the cable fee, refuse and recycling
 * receipts, medicaid reimbursement and lease income behind three page-78
 * rows -- OTHER DEPT. REVENUE, MEDICAID REIMBURSEMENT and RENTALS all sum out
 * of this one table.
 */
export const DEPARTMENT_REVENUE: BudgetTableData = {
  columns: ["", ...HISTORICAL_YEARS],
  rows: [
    {
      label: "Cable Fee",
      cells: [
        "$336,306",
        "$442,891",
        "31.7%",
        "$530,751",
        "19.8%",
        "$303,253",
        "$200,000",
        "-34.0%",
        "$(103,253)",
      ],
    },
    {
      label: "Compost Revenues",
      cells: [
        "$23,544",
        "$23,319",
        "-1.0%",
        "$20,028",
        "-14.1%",
        "$20,000",
        "$20,000",
        "0.0%",
        "–",
      ],
    },
    {
      label: "Health Services",
      cells: [
        "$22,549",
        "$15,385",
        "-31.8%",
        "$11,620",
        "-24.5%",
        "$10,000",
        "$10,000",
        "0.0%",
        "–",
      ],
    },
    {
      label: "Recycling Revenue",
      cells: [
        "$26,814",
        "$53,266",
        "98.6%",
        "$34,773",
        "-34.7%",
        "$30,000",
        "$30,000",
        "0.0%",
        "–",
      ],
    },
    {
      label: "Refuse Charges",
      cells: [
        "$123,448",
        "$144,727",
        "17.2%",
        "$165,328",
        "14.2%",
        "$160,000",
        "$160,000",
        "0.0%",
        "–",
      ],
    },
    {
      label: "Sale of Trash Bags/Carts",
      cells: [
        "$139,473",
        "$137,608",
        "-1.3%",
        "$137,002",
        "-0.4%",
        "$135,000",
        "$135,000",
        "0.0%",
        "–",
      ],
    },
    {
      label: "Lease & Rentals",
      cells: [
        "$191,513",
        "$225,058",
        "17.5%",
        "$199,510",
        "-11.4%",
        "$198,450",
        "$198,450",
        "0.0%",
        "–",
      ],
    },
    {
      label: "School Medicaid",
      cells: [
        "$789,022",
        "$796,530",
        "1.0%",
        "$1,014,469",
        "27.4%",
        "$950,000",
        "$1,000,000",
        "5.3%",
        "$50,000",
      ],
    },
    {
      label: "Grand Total",
      cells: [
        "$1,652,669",
        "$1,838,782",
        "11.3%",
        "$2,113,480",
        "14.9%",
        "$1,806,703",
        "$1,753,450",
        "-2.9%",
        "$(53,253)",
      ],
    },
  ],
}

/** Page 63, "License & Permits". */
export const LICENSE_PERMITS: BudgetTableData = {
  columns: ["License & Permits", ...HISTORICAL_YEARS],
  rows: [
    {
      label: "Building Permits",
      cells: [
        "$2,902,224",
        "$1,606,758",
        "-44.6%",
        "$1,784,220",
        "11.0%",
        "$1,527,301",
        "$1,327,000",
        "-13.1%",
        "$(200,301)",
      ],
    },
    {
      label: "Clerk-All Other Licenses",
      cells: [
        "$315,965",
        "$308,745",
        "-2.3%",
        "$279,885",
        "-9.3%",
        "$120,000",
        "$250,000",
        "108.3%",
        "$130,000",
      ],
    },
    {
      label: "Constable License Fee",
      cells: ["$1,285", "$900", "-30.0%", "$821", "-8.8%", "$680", "", "-100.0%", "$(680)"],
    },
    {
      label: "Fire",
      cells: [
        "$107,070",
        "$109,565",
        "2.3%",
        "$108,353",
        "-1.1%",
        "$80,000",
        "$90,000",
        "12.5%",
        "$10,000",
      ],
    },
    {
      label: "Gas",
      cells: [
        "$62,481",
        "$72,741",
        "16.4%",
        "$59,910",
        "-17.6%",
        "$50,000",
        "$50,000",
        "0.0%",
        "–",
      ],
    },
    {
      label: "Health Licenses",
      cells: [
        "$254,985",
        "$253,685",
        "-0.5%",
        "$202,056",
        "-20.4%",
        "$150,000",
        "$175,000",
        "16.7%",
        "$25,000",
      ],
    },
    {
      label: "Liquor License",
      cells: [
        "$95,529",
        "$96,740",
        "1.3%",
        "$100,931",
        "4.3%",
        "$80,931",
        "$90,000",
        "11.2%",
        "$9,069",
      ],
    },
    {
      label: "Marriage",
      cells: [
        "$18,050",
        "$24,071",
        "33.4%",
        "$47,005",
        "95.3%",
        "$40,000",
        "$42,000",
        "5.0%",
        "$2,000",
      ],
    },
    {
      label: "Plumbing",
      cells: [
        "$116,270",
        "$191,580",
        "64.8%",
        "$83,140",
        "-56.6%",
        "$75,000",
        "$95,000",
        "26.7%",
        "$20,000",
      ],
    },
    {
      label: "Sealer Weights & Measures",
      cells: [
        "$22,005",
        "$29,417",
        "33.7%",
        "$16,300",
        "-44.6%",
        "$16,000",
        "$16,000",
        "0.0%",
        "–",
      ],
    },
    {
      label: "Wire Inspector",
      cells: [
        "$202,515",
        "$348,283",
        "72.0%",
        "$205,774",
        "-40.9%",
        "$150,000",
        "$165,000",
        "10.0%",
        "$15,000",
      ],
    },
    {
      label: "Grand Total",
      cells: [
        "$4,098,379",
        "$3,042,484",
        "-25.8%",
        "$2,888,395",
        "-5.1%",
        "$2,289,912",
        "$2,300,000",
        "0.4%",
        "$10,088",
      ],
    },
  ],
}

/** Page 63, "Fines & Investments". */
export const FINES_INVESTMENTS: BudgetTableData = {
  columns: ["", ...HISTORICAL_YEARS],
  rows: [
    {
      label: "Court Fines",
      cells: [
        "$29,824",
        "$133,075",
        "346.2%",
        "$183,522",
        "37.9%",
        "$130,000",
        "$144,000",
        "10.8%",
        "$14,000",
      ],
    },
    {
      label: "Non Criminal Fines",
      cells: [
        "$3,860",
        "$5,130",
        "32.9%",
        "$6,550",
        "27.7%",
        "$6,550",
        "$5,000",
        "-23.7%",
        "$(1,550)",
      ],
    },
    {
      label: "Parking Fines",
      cells: [
        "$248,148",
        "$241,899",
        "-2.5%",
        "$263,531",
        "8.9%",
        "$270,825",
        "$227,000",
        "-16.2%",
        "$(43,825)",
      ],
    },
    {
      label: "Parking Meters",
      cells: [
        "$561,447",
        "$319,171",
        "-43.2%",
        "$196,126",
        "-38.6%",
        "$196,125",
        "$230,000",
        "17.3%",
        "$33,875",
      ],
    },
    {
      label: "Towing Fines",
      cells: [
        "$23,750",
        "$26,175",
        "10.2%",
        "$24,775",
        "-5.3%",
        "$24,775",
        "$19,000",
        "-23.3%",
        "$(5,775)",
      ],
    },
    {
      label: "Investment Income",
      cells: [
        "$1,606,088",
        "$3,222,599",
        "100.6%",
        "$3,120,502",
        "-3.2%",
        "$1,976,991",
        "$1,000,000",
        "-49.4%",
        "$(976,991)",
      ],
    },
    {
      label: "Grand Total",
      cells: [
        "$2,473,117",
        "$3,948,049",
        "59.6%",
        "$3,795,006",
        "-3.9%",
        "$2,605,266",
        "$1,625,000",
        "-37.6%",
        "$(980,266)",
      ],
    },
  ],
}

const CHARTED = "2027 Proposed"
const HOUSE_BUDGET = "2027 House Budget"
const GRAND_TOTAL = ["Grand Total"]

/** Every row of `STATE_AID` that is not one of its six sources. */
const NOT_A_SOURCE = [
  "Sub-Total Cherry Sheet Receipts",
  "OFFSET ITEMS: School Choice & Library",
  "Total Cherry Sheet Receipts",
  "Assessments - SPECIAL EDUCATION",
  "Assessments - SCHOOL CHOICE SENDING",
  "Assessments - CHARTER SCHOOL",
  "Assessments - AIR POLLUTION DISTRICTS",
  "Assessments - RMV NON-RENEWAL",
  "Assessments - MBTA",
  "Assessments - MOSQUITO CONTROL",
  "Total Cherry Sheet Assessments",
  "TOTAL ESTIMATED CHERRY SHEET LESS OFFSETS & ASSESSMENTS",
]

/**
 * The one thing left in "Other Available Revenue Sources" once free cash and
 * the enterprise reimbursement are pulled out, under the book's own name for
 * it. Page 63's table heads the row "Transfer from Trust & Agency", which
 * named a bucket when the bucket held more than one thing; the prose beside
 * it says what this is -- "funding from the Hospital Trust fund, which
 * subsidizes the Public Health department." Both are the book's words; the
 * chart takes the one that names the money.
 */
const trust = column(OTHER_AVAILABLE, CHARTED, {
  exclude: ["Grand Total", "Free Cash (Budget Only)", "Transfer From Enterprise"],
}).map((row) => ({ ...row, label: "Hospital Trust" }))

/**
 * What water and wastewater are actually billed -- the Council's own orders,
 * not the book's May projection of the same transfer -- the way the spending
 * bar charts the two enterprise funds at what their own orders appropriate.
 * See `fy2027/+page.ts` for why free cash and the book's own reimbursement
 * projection are left out instead.
 */
const billed = column(ENTERPRISE_REVENUE, "Amount")

/**
 * "Fire" names a row in both `FEES` and `LICENSE_PERMITS` -- a fee for a
 * detail and a fee for a license, nothing alike but for the department --
 * and a chart segment is named to be told apart from its neighbors, not read
 * beside the table it came from. Renamed by what each table's own header
 * already calls every other row in it: the fees around it are named for what
 * they are a fee *for* ("Ambulance Fee", "Clerk Fees"), the licenses around
 * it for what they license ("Liquor License", "Health Licenses").
 */
const rename = (label: string, as: string) => (row: { label: string; amount: number }) =>
  row.label === label ? { ...row, label: as } : row

/**
 * What the city actually took in, department by department rather than
 * category by category -- every source pages 48 to 63 give a table for, for
 * this page's own bar, the front page's column, and the "Revenue Sources"
 * tab's table, the same relationship `SPENDING` has to `DEPARTMENTS` in
 * `spending/tables.ts`.
 *
 * State aid is six Cherry Sheet lines rather than the two page-78 rolls them
 * into; the tax levy stays one line, since the book gives no source table for
 * it the way it does for every other category -- Prop 2½'s levy-limit table
 * is a ceiling on it, not a breakdown of it. The rest -- excise, the PILOT and
 * penalties line, fees, department revenue, license & permits, fines &
 * investments -- are each a page-78 row or two, opened into the table the
 * book already gives for it. "Other Available Revenue Sources" is opened the
 * same way `fy2027/+page.ts` always has: free cash left out entirely and the
 * enterprise transfer replaced by what the water and wastewater orders
 * actually billed, leaving only the Hospital Trust subsidy.
 *
 * Each source table's own Grand Total is proven against the coarse row it
 * replaces in `revenue.spec.ts`, the way `spending.spec.ts` checks
 * `DEPARTMENTS` against `APPROPRIATIONS`.
 */
export const REVENUE_DETAIL = [
  ...column(STATE_AID, HOUSE_BUDGET, { exclude: NOT_A_SOURCE }),
  { label: "Tax Levy", amount: amount(cell(REVENUE, "TAX LEVY", CHARTED))! },
  ...column(EXCISE, CHARTED, { exclude: GRAND_TOTAL }),
  ...column(OTHER_LOCAL_RECEIPTS, CHARTED, { exclude: GRAND_TOTAL }),
  ...column(FEES, CHARTED, { exclude: GRAND_TOTAL }).map(rename("Fire", "Fire Fee")),
  ...column(DEPARTMENT_REVENUE, CHARTED, { exclude: GRAND_TOTAL }),
  ...column(LICENSE_PERMITS, CHARTED, { exclude: GRAND_TOTAL }).map(rename("Fire", "Fire License")),
  ...column(FINES_INVESTMENTS, CHARTED, { exclude: GRAND_TOTAL }),
  ...trust,
  ...billed,
]

/**
 * Summed rather than stated, the same as the coarse `revenue` array this
 * replaces was in `fy2027/+page.ts`: no document states a total for the
 * city's actual income the way `APPROPRIATIONS` and `REVENUE` both state
 * $285,272,159 for spending, because the book's own revenue total counts free
 * cash, which this deliberately does not.
 */
export const REVENUE_TOTAL = sum(REVENUE_DETAIL)
