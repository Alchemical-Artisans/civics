import { paraglideVitePlugin } from "@inlang/paraglide-js"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from "vitest/config"
import { playwright } from "@vitest/browser-playwright"
import adapter from "@sveltejs/adapter-static"
import { sveltekit } from "@sveltejs/kit/vite"
import path from "node:path"
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin"

// Where the site is served from, when that is not the root of a domain.
//
// It is empty everywhere today: dev, preview and the test suites run at the
// root, and so does the deployed site, because static/CNAME points GitHub Pages
// at haverhill.alchemicalartisans.com. The knob exists for the fallback case —
// without the custom domain GitHub Pages serves a project site from
// https://<owner>.github.io/<repo>, and the build has to know it lives under
// that subdirectory. Set BASE_PATH=/civics to produce that build.
//
// Every internal link is built by Router in src/lib/router.ts, which applies
// this once. See docs/deployment.md.
const base = (process.env.BASE_PATH ?? "") as "" | `/${string}`

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  plugins: [
    tailwindcss(),
    sveltekit({
      compilerOptions: {
        // Force runes mode for the project, except for libraries. Can be removed in svelte 6.
        runes: ({ filename }) =>
          filename.split(/[/\\]/).includes("node_modules") ? undefined : true,
      },
      // GitHub Pages serves 404.html for any path it cannot find. Emitting one
      // means an unknown or stale URL lands on the app's own not-found page
      // rather than GitHub's, which would be a dead end off the site.
      adapter: adapter({ fallback: "404.html" }),
      paths: { base },
    }),
    paraglideVitePlugin({
      project: "./project.inlang",
      outdir: "./src/lib/paraglide",
      emitTsDeclarations: true,
    }),
  ],
  test: {
    expect: {
      requireAssertions: true,
    },
    projects: [
      {
        extends: "./vite.config.ts",
        test: {
          name: "client",
          browser: {
            enabled: true,
            provider: playwright(),
            instances: [
              {
                browser: "chromium",
                headless: true,
              },
            ],
          },
          include: ["src/**/*.svelte.{test,spec}.{js,ts}"],
          exclude: ["src/lib/server/**"],
        },
      },
      {
        extends: "./vite.config.ts",
        test: {
          name: "server",
          environment: "node",
          include: ["src/**/*.{test,spec}.{js,ts}", "scripts/**/*.spec.mjs"],
          exclude: ["src/**/*.svelte.{test,spec}.{js,ts}"],
        },
      },
      {
        extends: true,
        plugins: [
          // The plugin will run tests for the stories defined in your Storybook config
          // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
          storybookTest({
            configDir: path.join(import.meta.dirname, ".storybook"),
          }),
        ],
        test: {
          name: "storybook",
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [
              {
                browser: "chromium",
              },
            ],
          },
        },
      },
    ],
  },
})
