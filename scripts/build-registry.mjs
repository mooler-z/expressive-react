// Merges registry/*.json (one item per file) into registry.json, which `shadcn build` reads.
// Items are ordered: init, theme, utils first, then ui, blocks, everything else alphabetically.
import { readdirSync, readFileSync, writeFileSync } from "node:fs"

const FIRST = ["init", "theme", "utils"]
const TYPE_ORDER = ["registry:item", "registry:file", "registry:lib", "registry:hook", "registry:ui", "registry:component", "registry:block"]

const items = readdirSync("registry")
  .filter((f) => f.endsWith(".json"))
  .map((f) => {
    const item = JSON.parse(readFileSync(`registry/${f}`, "utf8"))
    if (`${item.name}.json` !== f) throw new Error(`registry/${f}: name "${item.name}" must match the file name`)
    return item
  })
  .sort((a, b) => {
    const fa = FIRST.indexOf(a.name), fb = FIRST.indexOf(b.name)
    if (fa !== -1 || fb !== -1) return (fa === -1 ? 99 : fa) - (fb === -1 ? 99 : fb)
    return TYPE_ORDER.indexOf(a.type) - TYPE_ORDER.indexOf(b.type) || a.name.localeCompare(b.name)
  })

const registry = {
  $schema: "https://ui.shadcn.com/schema/registry.json",
  name: "expressive",
  homepage: "https://expressive-react.moolerz.et",
  items,
}
writeFileSync("registry.json", JSON.stringify(registry, null, 2) + "\n")
console.log(`registry.json · ${items.length} items`)
