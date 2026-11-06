/**
 * The four `DROUGHT_ZONES` steps, mild to severe -- one hue, not the
 * rainbow the city's own chart legend uses (yellow through purple), because
 * a stage scale is an ordinal ramp: what says "worse" is one hue going
 * darker, not four hues that carry no order a reader hasn't already been
 * told.
 *
 * The hue is `chart-colours.ts`'s own orange (`#ea580c`, slot 2) rather than
 * a new one, tinted and shaded to four steps and checked against the
 * dataviz skill's ordinal validator (`validate_palette.js --ordinal`) on
 * both a light and a dark surface: lightness monotone, every adjacent step
 * >= 0.06 apart in OKLCH L, the lightest step still >= 2:1 against the
 * surface, and a hue spread of 7° -- comfortably inside the one-hue ceiling.
 */
export const DROUGHT_SCALE_COLOURS = ["#f39e72", "#ef7d41", "#ea580c", "#c0480a"]
