// Registry metadata + real source files for the docs pages. Everything here is derived from the repo,
// so install commands, dependencies and the Manual tab can never drift from what the CLI ships.

/** Where the shadcn CLI fetches items. One place to change when the docs get a real host. */
export const REGISTRY_URL = "https://expressive-react.moolerz.et/r/{name}.json"

export interface RegistryFile {
  path: string
  type: string
  target?: string
}

export interface RegistryItem {
  name: string
  type: string
  title?: string
  description?: string
  dependencies?: string[]
  registryDependencies?: string[]
  files?: RegistryFile[]
}

const items = import.meta.glob<RegistryItem>("/registry/*.json", { eager: true, import: "default" })

export const REGISTRY: Record<string, RegistryItem> = Object.fromEntries(
  Object.values(items).map((item) => [item.name, item]),
)

export function registryItem(id: string): RegistryItem | undefined {
  return REGISTRY[id]
}

export const installCommand = (id: string) => `npx shadcn add @expressive/${id}`

/** Lazily loaded raw source of every shippable file, keyed by repo path ("src/components/ui/button.tsx"). */
const sources = {
  ...import.meta.glob<string>("/src/components/ui/*.{ts,tsx}", { query: "?raw", import: "default" }),
  ...import.meta.glob<string>("/src/hooks/*.ts", { query: "?raw", import: "default" }),
  ...import.meta.glob<string>("/src/lib/*.ts", { query: "?raw", import: "default" }),
}

export async function loadSource(path: string): Promise<string | null> {
  const load = sources["/" + path.replace(/^\//, "")]
  return load ? load() : null
}

/** Where a file lands in a default shadcn project (src/ prefix dropped, as the CLI shows it). */
export const displayPath = (path: string) => path.replace(/^src\//, "")
