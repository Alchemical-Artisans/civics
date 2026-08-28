// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import type { MeetingDetails } from "$lib/calendar"

declare global {
  namespace App {
    // interface Error {}
    // interface Locals {}
    interface PageData {
      /**
       * Set by a hand-written document page, for the layout above it to render
       * into the header. Optional because it is the only kind of page that has
       * one -- see src/routes/calendar/documents/.
       */
      meeting?: MeetingDetails
    }
    // interface PageState {}
    // interface Platform {}
  }
}

export {}
