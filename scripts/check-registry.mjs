// Verifies every registry/*.json item against the code it ships:
//   · each listed file exists
//   · registryDependencies == the @expressive items its files import (@/components/…, @/hooks/…, @/lib/utils)
//   · dependencies ⊇ the npm packages its files import
//   · files the item imports from blocks are shipped by the item itself or by a dependency
// `--fix` rewrites files/registryDependencies/dependencies from the imports (for blocks, also adds
// sibling files in the same folder that are imported).  Exits 1 on any mismatch without --fix.
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs"
import { dirname, join, normalize } from "node:path"

const FIX = process.argv.includes("--fix")
const IMPLICIT = new Set(["react", "react-dom"])
const items = readdirSync("registry").filter((f) => f.endsWith(".json")).map((f) => ({ f, item: JSON.parse(readFileSync(`registry/${f}`, "utf8")) }))

// file path → item name
const owner = new Map()
for (const { item } of items) for (const file of item.files ?? []) owner.set(file.path, item.name)

const resolveAlias = (spec) => {
  const base = spec.replace(/^@\//, "src/")
  for (const ext of [".tsx", ".ts", "/index.tsx", "/index.ts"]) if (existsSync(base + ext)) return base + ext
  return null
}
const resolveRelative = (from, spec) => {
  const base = normalize(join(dirname(from), spec))
  for (const ext of [".tsx", ".ts", "/index.tsx", "/index.ts"]) if (existsSync(base + ext)) return base + ext
  return null
}
const importsOf = (path) =>
  [...readFileSync(path, "utf8").matchAll(/(?:import|export)[^"']*?from\s+["']([^"']+)["']|import\(\s*["']([^"']+)["']\s*\)/g)].map((m) => m[1] ?? m[2])
const pkgName = (spec) => (spec.startsWith("@") ? spec.split("/").slice(0, 2).join("/") : spec.split("/")[0])

let problems = 0
for (const { f, item } of items) {
  if (!item.files?.length) continue // meta items (e.g. init) only bundle other items
  const files = [...(item.files ?? [])]
  const shipped = new Set(files.map((x) => x.path))
  const reg = new Set()
  const npm = new Set()
  const missingFiles = []

  // Walk imports; for blocks, pull in same-item sibling files transitively when fixing.
  for (let i = 0; i < files.length; i++) {
    const path = files[i].path
    if (!existsSync(path)) {
      missingFiles.push(path)
      continue
    }
    if (!/\.(tsx?|jsx?)$/.test(path)) continue
    for (const spec of importsOf(path)) {
      let target = null
      if (spec.startsWith("@/")) target = resolveAlias(spec)
      else if (spec.startsWith(".")) target = resolveRelative(path, spec)
      else {
        if (!IMPLICIT.has(pkgName(spec))) npm.add(pkgName(spec))
        continue
      }
      if (!target) {
        console.error(`✗ ${f}: ${path} imports unresolved "${spec}"`)
        problems++
        continue
      }
      if (shipped.has(target)) continue
      const other = owner.get(target)
      if (other && other !== item.name) reg.add(`@expressive/${other}`)
      else if (item.type === "registry:block" && FIX) {
        files.push({ path: target, type: "registry:component" })
        shipped.add(target)
      } else {
        console.error(`✗ ${f}: ${path} imports ${target}, which no registry item ships`)
        problems++
      }
    }
  }

  const want = [...reg].sort()
  const have = [...(item.registryDependencies ?? [])].filter((d) => d !== "@expressive/theme")
  const keepTheme = (item.registryDependencies ?? []).includes("@expressive/theme")
  const regDiff = JSON.stringify(want) !== JSON.stringify([...have].sort())
  const npmMissing = [...npm].filter((p) => !(item.dependencies ?? []).includes(p))
  const npmExtra = (item.dependencies ?? []).filter((p) => !npm.has(p) && item.type !== "registry:lib")

  if (missingFiles.length) {
    console.error(`✗ ${f}: missing files ${missingFiles.join(", ")}`)
    problems++
  }
  if (FIX) {
    if (missingFiles.length) item.files = files.filter((x) => !missingFiles.includes(x.path))
    else item.files = files
    const deps = [...want, ...(keepTheme ? ["@expressive/theme"] : [])]
    if (deps.length) item.registryDependencies = deps
    else delete item.registryDependencies
    const npmAll = [...new Set([...(item.dependencies ?? []).filter((p) => npm.has(p) || item.type === "registry:lib"), ...npm])].sort()
    if (npmAll.length) item.dependencies = npmAll
    else delete item.dependencies
    writeFileSync(`registry/${f}`, JSON.stringify(item, null, 2) + "\n")
  } else {
    if (regDiff) {
      console.error(`✗ ${f}: registryDependencies should be [${want.join(", ")}]${keepTheme ? " (+theme)" : ""}, has [${have.sort().join(", ")}]`)
      problems++
    }
    if (npmMissing.length) {
      console.error(`✗ ${f}: missing npm dependencies ${npmMissing.join(", ")}`)
      problems++
    }
    if (npmExtra.length) console.warn(`! ${f}: unused npm dependencies ${npmExtra.join(", ")}`)
  }
}
if (!FIX && problems) {
  console.error(`\n${problems} registry problem(s). Run \`node scripts/check-registry.mjs --fix\` to sync from imports.`)
  process.exit(1)
}
console.log(FIX ? `synced ${items.length} registry items from their imports` : `registry ok · ${items.length} items match their imports`)
