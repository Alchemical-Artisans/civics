<script lang="ts">
  import { Router } from "$lib/router"

  /** This page's own directory name, which is the meeting's id. */
  const MEETING = "planning-board-2026-10-14"

  /**
   * The board opens three of the four hearings with the same words -- "Amend
   * Chapter 255 Zoning Ordinance and Zoning Map" is what it calls any such
   * petition -- so the link text carries the dashed qualifier the agenda
   * prints after it, which is the only part of the name that says which
   * matter is which.
   */
  const OMNIBUS =
    "amend-chapter-255-zoning-ordinance-and-appendix-a-table-1-table-of-use-and-parking-regulations"
</script>

<h2>Continued Public Hearing</h2>

<ul>
  <li>
    <a href={Router.meetingItem(MEETING, "pentucket-north-planned-development-district")}>
      Amend Chapter 255 Zoning Ordinance and Zoning Map
    </a>
  </li>
</ul>

<h2>Public Hearing(s)</h2>

<ul>
  <li>
    <a href={Router.meetingItem(MEETING, "battery-energy-storage-systems-ordinance")}>
      Amend Chapter 255 Zoning Ordinance and Zoning Map &ndash; Battery Energy Storage Systems
      Overlay District (BESS)
    </a>
  </li>
  <li>
    <a href={Router.meetingItem(MEETING, OMNIBUS)}>
      Amend Chapter 255 Zoning Ordinance and Appendix A Table 1: Table of Use and Parking
      Regulations
    </a>
  </li>
</ul>

<h2>Escrows</h2>

<h2>Approval of minutes</h2>

<p>September 9, 2026</p>

<h2>Endorsement of Plans</h2>

<ul>
  <li>
    <a href={Router.meetingItem(MEETING, "form-a-386-middle-road")}>Form A 386 Middle Road</a>
  </li>
</ul>

<h2>Any other matter</h2>

<p>Signed, Paul B. Howard, Chairman</p>
