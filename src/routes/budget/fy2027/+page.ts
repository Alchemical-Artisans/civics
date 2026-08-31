import type { PageLoad } from "./$types"
import { contents } from "$lib/budget"

/**
 * The book's own table of contents, pages 6 to 8, transcribed in its printed
 * order with the page numbers it prints.
 *
 * The numbers were checked against the link annotations in the PDF -- the
 * contents page tells the reader to "click the page number below to skip
 * directly to the section" -- so every one of them is where the book itself
 * jumps to, and this book's printed page numbers happen to match its PDF
 * pages exactly.
 *
 * `contents()` decides which of these have a page here by looking for the
 * directory, so writing a section up adds nothing to this list.
 */
export const load: PageLoad = () => ({
  contents: contents("fy2027", [
    ["Mayor's Budget Message", 2],
    ["Budget Calendar", 13],
    ["2027 Budget Goals", 15],
    ["Long-Term Strategic Goals", 16],
    ["Fiscal Reserves", 17],
    ["Outstanding Debt", 21],
    ["Net School Spending", 26],
    ["Capital Planning", 28],
    ["2027 Revenue Estimates", 48],
    ["2027 Revenue Summary", 64],
    ["10-Year Revenue Forecast", 67],
    ["10-Year Appropriation Forecast", 69],
    ["2027 Budget Requests", 72],
    ["2027 Budget Challenges", 73],
    ["2027 Budget in Brief", 76],
    ["2027 Estimated Tax Bill Impact", 79],
    ["General Fund Budgets", 80],
    ["City Council", 81],
    ["Mayor's Office", 84],
    ["Constituent Services", 87],
    ["Finance Division", 91],
    ["Auditor's Office", 92],
    ["Treasurer's & Collector's Office", 96],
    ["Assessor's Office", 101],
    ["Purchasing", 105],
    ["Building Maintenance", 109],
    ["Legal", 112],
    ["Human Resources", 117],
    ["Information Technology", 121],
    ["City Clerk", 126],
    ["Economic Development & Planning", 131],
    ["Police Department", 135],
    ["Fire Department", 143],
    ["Regional Schools", 150],
    ["School Department", 152],
    ["Highway Department", 153],
    ["Outdoor Lighting", 159],
    ["Parking", 160],
    ["Parks", 162],
    ["Public Works Administration", 165],
    ["Refuse", 167],
    ["Snow & Ice Removal", 169],
    ["Street Marking", 170],
    ["Vehicle Maintenance", 171],
    ["Inspectional Services", 173],
    ["Public Health", 180],
    ["Senior Center", 182],
    ["Veterans Services", 184],
    ["Citizens Center", 187],
    ["Recreation Department", 190],
    ["Stadium", 193],
    ["Library", 195],
    ["Debt Service", 200],
    ["State Assessments", 209],
    ["Employee Benefits", 211],
    ["Liability, Overlay & Reserves", 213],
    ["Organizational Chart", 216],
    ["Position Summary", 217],
    ["Fund Accounting", 218],
    ["Budget Policies", 221],
    ["Financial Reserve Policies", 227],
    ["Glossary", 231],
  ]),

  /**
   * Pages the book's contents page leaves out.
   *
   * The book's front matter and its process pages carry headings of their own
   * but no contents entry, so following the contents alone skips them
   * entirely. Titles here are the headings those pages print. Page 9 is a
   * divider reading "2027 Budget" with nothing else on it and gets no entry.
   *
   * The list runs as far as the book has been transcribed, so it grows with
   * the sections rather than being complete now.
   */
  unlisted: contents("fy2027", [
    ["Council Members", 3],
    ["City Hall of Haverhill", 5],
    ["Mayor's Budget Team", 10],
    ["Budget Phases", 11],
  ]),
})
