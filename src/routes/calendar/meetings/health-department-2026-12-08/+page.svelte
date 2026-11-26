<script lang="ts">
  import { Router } from "$lib/router"

  /** This page's own directory name, which is the meeting's id. */
  const MEETING = "health-department-2026-12-08"
</script>

<ol>
  <li>
    OPENING OF MEETING
    <p>
      <a href={Router.meetingItem(MEETING, "welcome-to-new-board-member")}>
        Welcome to New Board Member
      </a>
    </p>
  </li>
  <li>ATTENDANCE</li>
  <li>
    APPROVAL OF MINUTES
    <p>Minutes from the March 3, 2026 Board Meeting.</p>
  </li>
  <li>
    LICENSE/PERMIT REQUESTS:
    <ol type="a">
      <li>
        <a href={Router.meetingItem(MEETING, "license-permit-requests")}>
          Horse Stabling Permit, 75 Vale St
        </a>
      </li>
      <li>
        <a href={Router.meetingItem(MEETING, "license-permit-requests")}>
          Keeping of Domestic Animals Permit, 449 Amesbury Rd
        </a>
      </li>
      <li>
        <a href={Router.meetingItem(MEETING, "license-permit-requests")}>
          Keeping of Domestic Animals Permit, 52 Center St.
        </a>
      </li>
      <li>
        <a href={Router.meetingItem(MEETING, "license-permit-requests")}>
          Keeping of Domestic Animals Permit, 21 Greenlawn Ave
        </a>
      </li>
      <li>
        <a href={Router.meetingItem(MEETING, "license-permit-requests")}>
          Keeping of Domestic Animals Permit, 327 Lake St.
        </a>
      </li>
      <li>
        <a href={Router.meetingItem(MEETING, "license-permit-requests")}>
          Keeping of Domestic Animals Permit, 28 Forest St
        </a>
      </li>
      <li>
        <a href={Router.meetingItem(MEETING, "license-permit-requests")}>
          Keeping of Domestic Animals Permit, 50 Sun Valley Dr.
        </a>
      </li>
    </ol>
  </li>
  <li>COMMUNICATIONS/INFORMATIONAL:</li>
  <li>OTHER BUSINESS:</li>
  <li>DATE &amp; TIME OF NEXT MEETING:</li>
  <li>MEETING ADJOURNMENT:</li>
</ol>
