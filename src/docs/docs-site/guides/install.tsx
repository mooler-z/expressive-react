import { Callout, CodePanel, InlineCode, SectionHeading, Step, Steps, Terminal, TextLink } from "@/docs/docs-site/primitives"
import { REGISTRY_URL } from "@/docs/docs-site/registry"

export const lead = "Copy the source with the shadcn CLI (four steps), or install the npm package. React 19 and Tailwind CSS v4 are the only prerequisites."

const registryJson = `{
  "registries": {
    "@expressive": "${REGISTRY_URL}"
  }
}`

const cssImport = `@import "tailwindcss";
@import "./styles/expressive.css";`

const fonts = `<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=Roboto+Flex:opsz,wght@8..144,100..1000&family=Roboto+Mono:wght@400;500&family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block"
/>`

const provider = `import { ThemeProvider } from "@/components/ui/theme-provider"

export function Providers({ children }: { children: React.ReactNode }) {
  return <ThemeProvider defaultMode="system">{children}</ThemeProvider>
}`

const npmCss = `@import "tailwindcss";
@import "expressive-react/styles.css";`

const npmUsage = `import { Button } from "expressive-react/button"
import { Icon } from "expressive-react/icon"
import { ThemeProvider } from "expressive-react/theme-provider"

<ThemeProvider defaultMode="system">
  <Button icon={<Icon name="add" />}>Create</Button>
</ThemeProvider>`

export default function Installation() {
  return (
    <>
      <div className="mt-8">
        <Steps>
          <Step title="Register the registry">
            <p className="mt-1 text-body-md text-on-surface-variant">
              Add <code className="font-mono">@expressive</code> to <code className="font-mono">registries</code> in components.json. The{" "}
              <code className="font-mono">{"{name}"}</code> placeholder is filled by the CLI. No components.json yet? Run <InlineCode>npx shadcn init</InlineCode> first.
            </p>
            <CodePanel className="mt-3" filename="components.json" icon="data_object" copyLabel="registry entry" code={registryJson} />
          </Step>
          <Step title="Run init">
            <p className="mt-1 text-body-md text-on-surface-variant">
              Adds the theme CSS (color roles, type, shape and elevation scales, springs, state layers), <code className="font-mono">lib/utils.ts</code> with{" "}
              <code className="font-mono">cn()</code> and <code className="font-mono">tv()</code>, the <code className="font-mono">Icon</code> component and the{" "}
              <code className="font-mono">ThemeProvider</code>.
            </p>
            <Terminal
              className="mt-3"
              commands={["npx shadcn add @expressive/init"]}
              output={["Created styles/expressive.css", "Created lib/utils.ts", "Created components/ui/icon.tsx, components/ui/theme-provider.tsx"]}
            />
          </Step>
          <Step title="Wire up the theme">
            <p className="mt-1 text-body-md text-on-surface-variant">
              Import the theme once, right after Tailwind, in your global CSS (the path is relative to that file). Then load Roboto Flex and Material Symbols, and
              wrap your app in <code className="font-mono">ThemeProvider</code>.
            </p>
            <CodePanel className="mt-3" filename="app/globals.css" icon="css" code={cssImport} />
            <CodePanel className="mt-3" filename="app/layout.tsx · <head>" icon="html" copyLabel="font links" code={fonts} />
            <CodePanel className="mt-3" filename="app/providers.tsx" code={provider} />
          </Step>
          <Step title="Add components">
            <p className="mt-1 text-body-md text-on-surface-variant">One at a time, several at once, or a whole block. Dependencies between items resolve automatically.</p>
            <Terminal className="mt-3" header={false} commands={["npx shadcn add @expressive/button @expressive/switch @expressive/fab", "npx shadcn add @expressive/login-1"]} />
          </Step>
        </Steps>
      </div>
      <div className="mt-10">
        <Callout title="Already on shadcn/ui?">
          Both registries can live side by side. Expressive components use the same <code className="font-mono">components/ui</code> folder and the same{" "}
          <code className="font-mono">cn()</code> helper: init's <code className="font-mono">lib/utils.ts</code> keeps it and teaches tailwind-merge the M3 scales, so
          the CLI asks before replacing yours. The theme does override Tailwind's breakpoints and radius scale with M3 values; see{" "}
          <TextLink to="/docs/theming">Theming</TextLink>.
        </Callout>
      </div>

      <div className="mt-14">
        <SectionHeading id="npm">Or install from npm</SectionHeading>
        <p className="mt-3 text-body-lg text-on-surface-variant">
          Prefer a dependency you update instead of code you own? The <InlineCode>expressive-react</InlineCode> package ships the same components, compiled, with
          one entry point per component.
        </p>
        <div className="mt-6">
          <Steps>
            <Step title="Install">
              <Terminal className="mt-3" commands={["npm i expressive-react"]} />
            </Step>
            <Step title="Import the theme">
              <p className="mt-1 text-body-md text-on-surface-variant">
                Once, right after Tailwind. It also registers the package as a Tailwind source, so no <InlineCode>@source</InlineCode> line is needed. Load the
                fonts as above.
              </p>
              <CodePanel className="mt-3" filename="app/globals.css" icon="css" code={npmCss} />
            </Step>
            <Step title="Use components">
              <p className="mt-1 text-body-md text-on-surface-variant">
                Each component page lists its exact import. Everything is also re-exported from <InlineCode>expressive-react</InlineCode>.
              </p>
              <CodePanel className="mt-3" filename="app/page.tsx" code={npmUsage} />
            </Step>
          </Steps>
        </div>
      </div>
    </>
  )
}
