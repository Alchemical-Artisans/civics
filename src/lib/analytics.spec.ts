import { describe, expect, it } from "vitest"
import { analyticsHead } from "./analytics"

describe("analyticsHead", () => {
  const head = analyticsHead("G-TEST123")

  it("denies all four Consent Mode signals before anything else runs", () => {
    for (const signal of [
      "ad_storage",
      "ad_user_data",
      "ad_personalization",
      "analytics_storage",
    ]) {
      expect(head).toContain(`${signal}: "denied"`)
    }
    expect(head).not.toContain('"granted"')
  })

  it("sets the consent default before the library and the config call", () => {
    const consent = head.indexOf('gtag("consent", "default"')
    const library = head.indexOf("googletagmanager.com/gtag/js")
    const config = head.indexOf('gtag("config"')

    expect(consent).toBeGreaterThan(-1)
    expect(consent).toBeLessThan(config)
    expect(config).toBeLessThan(library)
    expect(head.indexOf("<script async")).toBeGreaterThan(head.indexOf("</script>"))
  })

  it("loads the library for the given property and turns Google signals off", () => {
    expect(head).toContain("https://www.googletagmanager.com/gtag/js?id=G-TEST123")
    expect(head).toContain('gtag("config", "G-TEST123", { allow_google_signals: false })')
  })
})
