import Demo from "@/docs/docs-site/examples/appearance-picker/demo"
import demoSrc from "@/docs/docs-site/examples/appearance-picker/demo?raw"
import Panel from "@/docs/docs-site/examples/appearance-picker/panel"
import panelSrc from "@/docs/docs-site/examples/appearance-picker/panel?raw"
import { InlineCode, TextLink } from "@/docs/docs-site/primitives"
import type { ComponentDoc } from "@/docs/docs-site/types"

const c = (s: string) => <code className="font-mono text-body-sm">{s}</code>

export default {
  description: (
    <>
      The theme menu for your users: a grid of looks, each a <TextLink to="/docs/theme-presets">theme preset</TextLink> shown by its swatches, and a light /
      system / dark switch. It reads and writes <TextLink to="/docs/theme-provider">ThemeProvider</TextLink>, so the choice persists with the other theme
      settings. Try it here: it changes this site.
    </>
  ),
  links: { aria: "https://react-spectrum.adobe.com/react-aria/RadioGroup.html" },
  preview: { component: Demo, source: demoSrc },
  usage: `import { AppearancePicker } from "@/components/ui/appearance-picker"

// inside <ThemeProvider>
<header className="flex items-center gap-2">
  <h1 className="flex-1 text-title-lg">Attendance</h1>
  <AppearancePicker defaultLabel="Default" />
</header>`,
  examples: [
    {
      id: "panel",
      title: "Inline panel with your own looks",
      description: (
        <>
          <InlineCode>AppearancePanel</InlineCode> is the same content without the popover, for a settings page or a sheet. Pass <InlineCode>presets</InlineCode> to
          offer a short list; the default is every preset the provider knows.
        </>
      ),
      component: Panel,
      source: panelSrc,
    },
  ],
  api: [
    {
      name: "AppearancePanel",
      description: "The looks grid and the mode switch. Must be inside a ThemeProvider.",
      props: [
        { name: "presets", type: "readonly ThemePreset[]", default: "provider presets", description: "Looks to offer, in order." },
        { name: "defaultLabel", type: "string", default: "—", description: <>Adds a first option that removes the preset ({c("setPreset(null)")}), with this label.</> },
        { name: "showMode", type: "boolean", default: "true", description: "Show the light / system / dark switch." },
        { name: "title", type: "ReactNode", default: '"Appearance"', description: "Heading. Pass null for none." },
        { name: "description", type: "ReactNode", default: "—", description: "Line under the heading." },
        { name: "className", type: "string", default: "—", description: "Classes for the panel." },
      ],
    },
    {
      name: "AppearancePicker",
      description: "AppearancePanel in a popover behind a palette icon button. Takes every AppearancePanel prop, plus:",
      props: [
        { name: "aria-label", type: "string", default: '"Appearance"', description: "Name of the trigger and the popover." },
        { name: "icon", type: "string", default: '"palette"', description: "Material Symbols name for the trigger." },
        { name: "placement", type: "Placement", default: '"bottom end"', description: "Popover placement." },
        { name: "triggerClassName", type: "string", default: "—", description: "Classes for the icon button." },
      ],
    },
  ],
  accessibility: {
    description: (
      <>
        Looks are a React Aria {c("RadioGroup")} labelled "Look"; each option is announced with its name, and the swatches are hidden from assistive tech. The mode
        switch is a single-select toggle button group labelled "Mode". The popover contains focus and returns it to the trigger on close.
      </>
    ),
    keyboard: [
      { keys: ["Tab"], description: "Moves between the looks group, the mode switch and out of the popover." },
      { keys: ["↑", "↓", "←", "→"], description: "Moves between looks and selects them, in grid reading order." },
      { keys: ["Esc"], description: "Closes the popover." },
    ],
  },
} satisfies ComponentDoc
