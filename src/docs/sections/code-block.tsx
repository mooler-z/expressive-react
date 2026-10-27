import { CodeBlock, CodeCommand } from "@/components/ui/code-block"
import { Divider } from "@/components/ui/divider"
import { Kbd, KbdGroup } from "@/components/ui/kbd"
import { Section, Variant, Variants } from "@/docs/section"

const BUTTON = `<Button variant="filled" size="md">
  <Icon>add</Icon>
  Create
</Button>`

const DIFF = ` replicas: 3
-image: checkout-api:4.1.2
+image: checkout-api:4.2.0
 strategy:
-  maxSurge: 25%
+  maxSurge: 50%
+  canarySteps: [10, 50, 100]`

const SNIPPETS = [
  {
    label: "cURL",
    code: `curl -X POST https://api.kestrel.io/v1/deploys \\
  -H "Authorization: Bearer $KESTREL_TOKEN" \\
  -d '{"service":"checkout-api","version":"4.2.0"}'`,
  },
  {
    label: "JavaScript",
    code: `import { Kestrel } from '@kestrel/sdk';

const kestrel = new Kestrel();
await kestrel.deploys.create({ service: 'checkout-api', version: '4.2.0' });`,
  },
  {
    label: "Python",
    code: `from kestrel import Kestrel

kestrel = Kestrel()
kestrel.deploys.create(service="checkout-api", version="4.2.0")`,
  },
]

const SHORTCUTS: [string, string[], string?][] = [
  ["Command palette", ["⌘", "K"]],
  ["Search files", ["⌘", "P"]],
  ["Toggle sidebar", ["⌘", "B"]],
  ["Go to deploys", ["G", "D"], "then"],
  ["Close panel", ["Esc"]],
]

export default function CodeBlockSection() {
  return (
    <Section id="code-block" description="Roboto Mono on surface-container-lowest with a toolbar header and line numbers. Keyboard keys use a 1dp bottom edge.">
      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        <CodeBlock filename="create-button.tsx" language="tsx" lineNumbers code={BUTTON} />
        <div className="space-y-4">
          <div className="text-label-md tracking-wider text-on-surface-variant uppercase">Kbd</div>
          <p className="text-body-md text-on-surface-variant">
            Press <KbdGroup keys={["⌘", "K"]} /> to open the command palette, <Kbd>Esc</Kbd> to close.
          </p>
          <div className="flex flex-wrap gap-2">
            {["Shift", "⏎", "↑", "↓"].map((k) => (
              <Kbd key={k} variant="tonal" size="lg">
                {k}
              </Kbd>
            ))}
          </div>
        </div>
      </div>

      <Variants cols="md:grid-cols-2">
        <Variant n={1} label="Command · inverse & tonal" className="flex min-h-24 flex-col gap-4 rounded-lg bg-surface p-4">
          <CodeCommand variant="inverse" command="npm i @kestrel/cli" />
          <CodeCommand command="kestrel deploy --canary 10%" />
        </Variant>
        <Variant n={2} label="Diff" className="flex min-h-24 flex-col gap-4 rounded-lg bg-surface p-4">
          <CodeBlock filename="deploy.yaml" diff startLine={12} code={DIFF} copyable={false} />
        </Variant>
        <Variant n={3} label="Language tabs" className="flex min-h-24 flex-col gap-4 rounded-lg bg-surface p-4">
          <CodeBlock snippets={SNIPPETS} />
        </Variant>
        <Variant n={4} label="Shortcuts sheet" className="flex min-h-24 flex-col gap-4 rounded-lg bg-surface p-4">
          <div className="w-full">
            {SHORTCUTS.map(([label, keys, sep], i) => (
              <div key={label}>
                {i > 0 && <Divider />}
                <div className="flex items-center justify-between gap-3 py-2.5">
                  <span className="text-body-md">{label}</span>
                  <KbdGroup keys={keys} separator={sep} className="[&_kbd]:bg-surface [&_kbd]:text-on-surface-variant" />
                </div>
              </div>
            ))}
          </div>
          <p className="text-body-sm text-on-surface-variant">
            Inline: press <Kbd size="sm">?</Kbd> anywhere to open this sheet.
          </p>
        </Variant>
      </Variants>
    </Section>
  )
}
