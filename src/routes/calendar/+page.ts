import type { PageLoad } from './$types';
import raw from '$lib/data/meetings.json';
import type { Meeting, MeetingKind } from '$lib/calendar';

/**
 * Runs at build time (the site is fully prerendered), so the trimmed meeting
 * list is baked into the page rather than fetched by the browser. Fields only
 * the scraper cares about -- rawMeetingDate, category, dateSource -- are dropped
 * here to keep the serialized payload small.
 */
export const load: PageLoad = () => {
	const dated = raw.meetings.filter((m) => m.date);

	// A handful of PDFs are published under two media pages, which would
	// otherwise render the same document twice. Keep one copy, preferring the
	// record whose date the scraper did not flag.
	const best = new Map<string, (typeof dated)[number]>();
	for (const m of dated) {
		const key = m.fileUrl ?? m.pageUrl;
		const kept = best.get(key);
		if (!kept || (kept.needsReview && !m.needsReview)) best.set(key, m);
	}

	const kept = [...best.values()];
	const meetings: Meeting[] = kept.map((m) => ({
		title: m.title,
		date: m.date,
		board: m.board,
		kind: m.kind as MeetingKind,
		fileUrl: m.fileUrl,
		pageUrl: m.pageUrl
	}));

	return {
		meetings,
		generatedAt: raw.generatedAt,
		source: raw.source,
		undated: raw.meetings.length - dated.length,
		duplicates: dated.length - meetings.length,
		flagged: kept.filter((m) => m.needsReview).length
	};
};
