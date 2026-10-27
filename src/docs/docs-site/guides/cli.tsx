import { H2, Prose } from "@/docs/docs-site/guide"
import { DocTable, InlineCode, Terminal, TextLink } from "@/docs/docs-site/primitives"

export const lead = "Everything goes through the shadcn CLI. Here are the commands you'll use with @expressive, and the ones we use to build it."

export default function Cli() {
  return (
    <Prose>
      <H2>Adding</H2>
      <Terminal
        commands={[
          "npx shadcn add @expressive/init",
          "npx shadcn add @expressive/button @expressive/dialog",
          "npx shadcn add @expressive/admin-dashboard",
        ]}
      />
      <DocTable
        columns={["Flag", "Does"]}
        cellClassName={["font-mono text-body-sm text-primary whitespace-nowrap", "text-on-surface-variant"]}
        rows={[
          ["--dry-run", "Show what would be written, write nothing."],
          ["--diff <path>", "Compare a file you already have with the registry version. How you pick up upstream fixes."],
          ["--view <path>", "Print a file from the item without installing it."],
          ["-o, --overwrite", "Replace existing files without asking."],
          ["-p, --path <dir>", "Write the item somewhere other than its alias."],
          ["-y, --yes", "Skip the confirmation prompt."],
        ]}
      />

      <H2>Browsing</H2>
      <Terminal
        commands={["npx shadcn search @expressive", "npx shadcn search @expressive -q chart -t block", "npx shadcn view @expressive/slider"]}
      />
      <p>
        <InlineCode>search</InlineCode> (alias <InlineCode>list</InlineCode>) filters by query and type (<InlineCode>ui</InlineCode>, <InlineCode>block</InlineCode>,{" "}
        <InlineCode>hook</InlineCode>); <InlineCode>view</InlineCode> prints an item's JSON, source included.
      </p>

      <H2>Building the registry</H2>
      <p>For contributors and forks. The registry is one JSON file per item in <InlineCode>registry/</InlineCode>:</p>
      <Terminal commands={["pnpm registry:build"]} output={["registry ok · every item matches its imports", "registry.json merged", "public/r/*.json written"]} />
      <DocTable
        columns={["Step", "Does"]}
        cellClassName={["font-mono text-body-sm text-primary whitespace-nowrap", "text-on-surface-variant"]}
        rows={[
          ["scripts/check-registry.mjs", "Fails if an item's files, registryDependencies or npm dependencies don't match what its code imports. --fix rewrites them from the imports."],
          ["scripts/build-registry.mjs", "Merges registry/*.json into registry.json."],
          ["shadcn build --output public/r", "Inlines each file's source and writes the JSON the CLI downloads."],
        ]}
      />
      <p>
        Host <InlineCode>public/r</InlineCode> anywhere static and point your <TextLink to="/docs/registry">registries</TextLink> entry at it.
      </p>
    </Prose>
  )
}
