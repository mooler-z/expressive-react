// Theme presets: every shipped preset must meet WCAG AA in light and dark, and the helpers must behave.
// Run with `pnpm test`. Vite loads the TypeScript source (path aliases, and the color library's extensionless imports).
import assert from "node:assert/strict"
import { after, before, describe, test } from "node:test"
import { fileURLToPath } from "node:url"
import { createServer } from "vite"

const root = fileURLToPath(new URL("..", import.meta.url))
let server, mod

before(async () => {
  server = await createServer({
    root,
    logLevel: "error",
    appType: "custom",
    server: { middlewareMode: true, hmr: false, ws: false },
    ssr: { noExternal: ["@material/material-color-utilities"] },
  })
  mod = await server.ssrLoadModule("/src/components/ui/theme-presets.ts")
})
after(() => server?.close())

// WCAG 2.x relative luminance and contrast ratio
const channel = (v) => {
  const s = v / 255
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
}
const luminance = (hex) => {
  const n = parseInt(hex.slice(1), 16)
  return 0.2126 * channel((n >> 16) & 255) + 0.7152 * channel((n >> 8) & 255) + 0.0722 * channel(n & 255)
}
const contrast = (a, b) => {
  const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p)
  return (x + 0.05) / (y + 0.05)
}

/** Text pairs (AA body text, 4.5:1): body and supporting text on every surface, every on-color on its container, text buttons. */
const TEXT_PAIRS = [
  ...["surface", "surface-container-lowest", "surface-container-low", "surface-container", "surface-container-high", "surface-container-highest"].flatMap((bg) => [
    ["on-surface", bg],
    ["on-surface-variant", bg],
  ]),
  ["on-primary", "primary"],
  ["on-primary-container", "primary-container"],
  ["on-secondary", "secondary"],
  ["on-secondary-container", "secondary-container"],
  ["on-tertiary", "tertiary"],
  ["on-tertiary-container", "tertiary-container"],
  ["on-error", "error"],
  ["on-error-container", "error-container"],
  ["primary", "surface"],
  ["primary", "surface-container-low"],
  ["inverse-on-surface", "inverse-surface"],
]
/** Non-text pairs (AA UI components, 3:1): field outlines and primary controls on the strongest container. */
const UI_PAIRS = [
  ["outline", "surface"],
  ["primary", "surface-container-highest"],
]

describe("THEME_PRESETS", () => {
  test("ships 20 presets with unique ids and complete metadata", () => {
    const { THEME_PRESETS, COLOR_ROLES } = mod
    assert.equal(THEME_PRESETS.length, 20)
    assert.equal(new Set(THEME_PRESETS.map((p) => p.id)).size, 20)
    for (const p of THEME_PRESETS) {
      assert.match(p.id, /^[a-z][a-z0-9-]*$/, p.id)
      assert.ok(p.name && p.description, `${p.id}: name and description`)
      assert.match(p.seed, /^#[0-9a-f]{6}$/i, `${p.id}: seed`)
      assert.equal(p.swatches?.light.length, 4, `${p.id}: light swatches`)
      assert.equal(p.swatches?.dark.length, 4, `${p.id}: dark swatches`)
      if (p.font?.href) assert.match(p.font.href, /^https:\/\/fonts\.googleapis\.com\/css2\?/, `${p.id}: font href`)
      for (const mode of ["light", "dark"])
        for (const [role, hex] of Object.entries(p.colors?.[mode] ?? {})) {
          assert.ok(COLOR_ROLES.includes(role), `${p.id}: unknown role ${role}`)
          assert.match(hex, /^#[0-9a-f]{6}$/i, `${p.id}: ${role}`)
        }
    }
  })

  for (const mode of ["light", "dark"]) {
    test(`every preset meets WCAG AA in ${mode} mode`, async () => {
      const failures = []
      for (const p of mod.THEME_PRESETS) {
        const t = await mod.presetTokens(p, mode === "dark")
        const check = ([fg, bg], min) => {
          const ratio = contrast(t[`--md-${fg}`], t[`--md-${bg}`])
          if (ratio < min) failures.push(`${p.id} ${mode}: ${fg} on ${bg} = ${ratio.toFixed(2)} (needs ${min})`)
        }
        TEXT_PAIRS.forEach((pair) => check(pair, 4.5))
        UI_PAIRS.forEach((pair) => check(pair, 3))
      }
      assert.deepEqual(failures, [])
    })
  }

  test("presets look different from each other", () => {
    const keys = mod.THEME_PRESETS.map((p) => `${p.swatches.light[0]}|${p.swatches.light[3]}|${p.font?.sans}`)
    assert.equal(new Set(keys).size, keys.length)
  })
})

describe("preset helpers", () => {
  test("getThemePreset finds by id, case-insensitively", () => {
    assert.equal(mod.getThemePreset("Campus")?.id, "campus")
    assert.equal(mod.getThemePreset("nope"), undefined)
    assert.equal(mod.getThemePreset(null), undefined)
  })

  test("presetTokens sets colors, type, shape and elevation", async () => {
    const campus = mod.getThemePreset("campus")
    const t = await mod.presetTokens(campus, false)
    assert.equal(t["--md-surface"], campus.colors.light.surface)
    assert.equal(t["--md-tertiary-container"], campus.colors.light.tertiaryContainer)
    assert.match(t["--font-sans"], /Lexend/)
    assert.equal(t["--radius-md"], mod.SHAPE_SCALES.subtle.md)
    assert.equal(t["--md-elevation-1"], mod.ELEVATIONS.crisp[0])
    assert.equal(Object.keys(t).filter((k) => k.startsWith("--md-") && !k.startsWith("--md-elevation")).length, mod.COLOR_ROLES.length)
  })

  test("a different seed, variant or contrast keeps type and shape but drops the hand-tuned colors", async () => {
    const campus = mod.getThemePreset("campus")
    for (const options of [{ seed: "#B3261E" }, { variant: "tonalSpot" }, { contrast: 0.5 }]) {
      const t = await mod.presetTokens(campus, false, options)
      assert.notEqual(t["--md-surface"], campus.colors.light.surface, JSON.stringify(options))
      assert.match(t["--font-sans"], /Lexend/)
    }
    // Same seed in another case still counts as the preset's own
    const same = await mod.presetTokens(campus, false, { seed: campus.seed.toLowerCase() })
    assert.equal(same["--md-surface"], campus.colors.light.surface)
  })

  test("presetStyleTokens(null) restores the library defaults", () => {
    const t = mod.presetStyleTokens(null)
    assert.match(t["--font-sans"], /Roboto Flex/)
    assert.equal(t["--radius-xl"], "28px")
    assert.equal(t["--md-elevation-3"], mod.ELEVATIONS.standard[2])
  })

  test("custom shapes and elevations merge over the defaults", () => {
    const t = mod.presetStyleTokens({ id: "x", name: "X", description: "", seed: "#000000", variant: "neutral", shape: { md: "3px" }, elevation: ["a", "b", "c", "d", "e"] })
    assert.equal(t["--radius-md"], "3px")
    assert.equal(t["--radius-lg"], "16px")
    assert.equal(t["--md-elevation-5"], "e")
  })

  test("presetCss writes both modes and imports the font first", async () => {
    const paper = mod.getThemePreset("paper")
    const css = await mod.presetCss(paper)
    assert.ok(css.startsWith(`@import url("${paper.font.href}");`))
    assert.match(css, /html:root\{[^}]*--md-surface:#[0-9a-f]{6};[^}]*--font-sans:[^}]*\}html\.dark\{[^}]*--md-surface:/)
    assert.ok(!(await mod.presetCss(paper, { fonts: false })).includes("@import"))
  })
})
