import { Bullets, H2, Prose, Strong } from "@/docs/docs-site/guide"
import { CodePanel, DocTable, InlineCode, Terminal, TextLink } from "@/docs/docs-site/primitives"
import { REGISTRY, REGISTRY_URL } from "@/docs/docs-site/registry"

export const lead = "How the @expressive namespace plugs into the shadcn CLI, what an item is, and where files land."

const componentsJson = `{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "tsx": true,
  "tailwind": { "config": "", "css": "app/globals.css", "cssVariables": true },
  "aliases": {
    "components": "@/components",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "utils": "@/lib/utils",
    "hooks": "@/hooks"
  },
  "registries": {
    "@expressive": "${REGISTRY_URL}"
  }
}`

const itemJson = `{
  "name": "button",
  "type": "registry:ui",
  "dependencies": ["react-aria-components", "tailwind-variants"],
  "registryDependencies": [
    "@expressive/loading-indicator",
    "@expressive/ripple",
    "@expressive/utils"
  ],
  "files": [{ "path": "src/components/ui/button.tsx", "type": "registry:ui", "content": "…" }]
}`

const byType = (type: string) => Object.values(REGISTRY).filter((i) => i.type === type).length

export default function RegistryGuide() {
  return (
    <Prose>
      <p>
        Expressive React is a <Strong>shadcn registry</Strong>: a folder of JSON files, one per item, each carrying the item's source, its npm dependencies and the
        other items it needs. The shadcn CLI reads them and writes plain files into your project.
      </p>

      <H2>components.json</H2>
      <p>
        The <InlineCode>registries</InlineCode> map gives the CLI a URL template per namespace. Anything you add as <InlineCode>@expressive/&lt;name&gt;</InlineCode>{" "}
        is fetched from that template with <InlineCode>{"{name}"}</InlineCode> filled in. Your <InlineCode>aliases</InlineCode> decide where files go, and every
        import inside an item is rewritten to match them.
      </p>
      <CodePanel filename="components.json" icon="data_object" code={componentsJson} />

      <H2>Items</H2>
      <p>Every item has a type that decides where its files land:</p>
      <DocTable
        columns={["Type", "Lands in", "Count", "Examples"]}
        cellClassName={["font-mono text-body-sm text-primary", "font-mono text-body-sm", "tabular-nums", "text-on-surface-variant"]}
        rows={[
          ["registry:ui", "components/ui/", byType("registry:ui"), "button, dialog, data-table"],
          ["registry:hook", "hooks/", byType("registry:hook"), "use-window-size-class, use-tilt"],
          ["registry:block", "components/blocks/", byType("registry:block"), "login-1, admin-dashboard, kpi-cards"],
          ["registry:lib", "lib/", byType("registry:lib"), "utils"],
          ["registry:file", "styles/", byType("registry:file"), "theme (expressive.css)"],
        ]}
      />
      <p>An item's JSON, trimmed:</p>
      <CodePanel filename="r/button.json" icon="data_object" code={itemJson} />
      <Bullets>
        <li>
          <Strong>dependencies</Strong> are npm packages; the CLI installs them with your package manager.
        </li>
        <li>
          <Strong>registryDependencies</Strong> are other items. They resolve recursively, so adding <InlineCode>@expressive/admin-dashboard</InlineCode> pulls in
          every component it uses.
        </li>
        <li>
          <Strong>init</Strong> is a meta item with no files of its own: it bundles <InlineCode>theme</InlineCode>, <InlineCode>utils</InlineCode>,{" "}
          <InlineCode>icon</InlineCode> and <InlineCode>theme-provider</InlineCode>.
        </li>
      </Bullets>

      <H2>Look before you add</H2>
      <Terminal
        commands={[
          "npx shadcn search @expressive -q slider",
          "npx shadcn view @expressive/button",
          "npx shadcn add @expressive/button --dry-run",
          "npx shadcn add @expressive/button --diff components/ui/button.tsx",
        ]}
      />
      <p>
        More in <TextLink to="/docs/cli">CLI</TextLink>. Prefer to copy by hand? Every component page has a <Strong>Manual</Strong> tab with the exact source the
        CLI would write.
      </p>
    </Prose>
  )
}
