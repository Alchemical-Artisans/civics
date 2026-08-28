// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import type { Meeting, MeetingDetails } from "$lib/calendar"

declare global {
  namespace App {
    // interface Error {}
    // interface Locals {}
    interface PageData {
      /**
       * Set by a hand-written document page, for the layout above it to render
       * into the header. Optional because it is the only kind of page that has
       * one -- see src/routes/calendar/documents/. Named `details` rather than
       * `meeting` because a `Meeting` is now a thing of its own, below.
       */
      details?: MeetingDetails
      /** Set by a meeting page, which is about one sitting of one board. */
      meeting?: Meeting
      /**
       * Set by a page for one agenda item, so the layout can title itself
       * after the item rather than after the whole document.
       */
      item?: { title: string }
    }
    // interface PageState {}
    // interface Platform {}
  }
}

export {}
