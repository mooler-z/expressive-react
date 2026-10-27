import { Icon } from "@/components/ui/icon"
import { Bullets, H2, Prose, Strong } from "@/docs/docs-site/guide"
import { CodePanel, DocTable, InlineCode } from "@/docs/docs-site/primitives"

export const lead = "Material Symbols Rounded, as a variable font. Size, fill and weight are axes, so they animate with state."

const usage = `import { Icon } from "@/components/ui/icon"

<Icon name="favorite" />
<Icon name="favorite" size={20} filled />
<Icon name="settings" weight={600} />

// Inside components, pass icons through props
<Button icon={<Icon name="add" />}>New</Button>`

const toggleFill = `// Selected toggles fill their icon: FILL animates 0 → 1 on the effects spring
<ToggleIconButton aria-label="Favorite">
  <Icon name="favorite" />
</ToggleIconButton>`

export default function Icons() {
  return (
    <Prose>
      <p>
        <InlineCode>&lt;Icon&gt;</InlineCode> renders a Material Symbols ligature. It's <InlineCode>aria-hidden</InlineCode>, sized in pixels, and its optical size
        follows the size so strokes stay crisp from 16 to 48.
      </p>
      <div className="flex flex-wrap items-center gap-6 rounded-lg bg-surface-container-low p-6 text-on-surface">
        <Icon name="home" size={20} />
        <Icon name="favorite" />
        <Icon name="favorite" filled className="text-error" />
        <Icon name="bolt" size={32} weight={600} className="text-tertiary" />
        <Icon name="palette" size={40} filled className="text-primary" />
        <Icon name="rocket_launch" size={48} weight={300} />
      </div>
      <CodePanel code={usage} />

      <H2>Props</H2>
      <DocTable
        columns={["Prop", "Type", "Description"]}
        cellClassName={["font-mono text-body-sm text-primary", "font-mono text-body-sm", "text-on-surface-variant"]}
        rows={[
          ["name", "string", 'Ligature, e.g. "add". Children work too: <Icon>add</Icon>.'],
          ["size", "number", "Pixels. Defaults to the parent's --icon-size, else 24."],
          ["filled", "boolean", "FILL axis 1."],
          ["weight", "100 – 700", "wght axis."],
        ]}
      />

      <H2>How sizing works</H2>
      <Bullets>
        <li>
          Components set <InlineCode>--icon-size</InlineCode> for their slot (a Medium button sets 24px, an XL one 40px), so a bare{" "}
          <InlineCode>&lt;Icon name="add" /&gt;</InlineCode> is always the right size.
        </li>
        <li>
          Utilities for markup: <InlineCode>icon-16</InlineCode> … <InlineCode>icon-48</InlineCode>, <InlineCode>icon-fill</InlineCode>,{" "}
          <InlineCode>icon-bold</InlineCode>.
        </li>
        <li>
          <InlineCode>--icon-fill</InlineCode> and <InlineCode>--icon-wght</InlineCode> are registered properties, so they interpolate inside transitions.
        </li>
      </Bullets>
      <CodePanel code={toggleFill} />

      <H2>Loading the font</H2>
      <p>
        Use the Google Fonts link from Installation with <InlineCode>display=block</InlineCode>, so ligature text never flashes. Icons are clamped to a 1em square
        either way, so layouts don't jump while the font loads.
      </p>
      <p>
        <Strong>Why not .material-symbols-rounded?</Strong> Google's stylesheet styles that class outside any cascade layer, which beats every Tailwind utility.{" "}
        <InlineCode>Icon</InlineCode> uses its own <InlineCode>md-icon</InlineCode> class instead.
      </p>
    </Prose>
  )
}
