import qrcode from "qrcode-generator"

/**
 * A QR code for `text` as a single SVG path in a `size` x `size` grid of
 * unit squares, plus the quiet zone the standard asks for round it.
 *
 * Drawn as a path and not handed to `{@html}` as the library's own SVG string:
 * the component then owns the markup, and the code is built at render time
 * from nothing but the address, so there is no image to commit or to drift out
 * of date with it. Error correction "M" survives a smudged print; the type
 * number 0 lets the library pick the smallest symbol that holds the text.
 */
export function qrPath(text: string): { d: string; size: number } {
  const quiet = 4
  const qr = qrcode(0, "M")
  qr.addData(text)
  qr.make()
  const count = qr.getModuleCount()
  let d = ""
  for (let row = 0; row < count; row++) {
    for (let col = 0; col < count; col++) {
      if (qr.isDark(row, col)) d += `M${col + quiet} ${row + quiet}h1v1h-1z`
    }
  }
  return { d, size: count + quiet * 2 }
}
