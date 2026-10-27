import { H2, Prose } from "@/docs/docs-site/guide"
import { CodePanel, DocTable, InlineCode, TextLink } from "@/docs/docs-site/primitives"

export const lead = "Fifteen M3 type styles on Roboto Flex. One class sets size, line height, letter spacing and weight together."

// Literal class names so Tailwind generates them.
const SCALE: [string, number, number, string, number?][] = [
  ["text-display-lg", 57, 64, "-0.25px"],
  ["text-display-md", 45, 52, "0"],
  ["text-display-sm", 36, 44, "0"],
  ["text-headline-lg", 32, 40, "0"],
  ["text-headline-md", 28, 36, "0"],
  ["text-headline-sm", 24, 32, "0"],
  ["text-title-lg", 22, 28, "0"],
  ["text-title-md", 16, 24, "0.15px", 500],
  ["text-title-sm", 14, 20, "0.1px", 500],
  ["text-body-lg", 16, 24, "0.5px"],
  ["text-body-md", 14, 20, "0.25px"],
  ["text-body-sm", 12, 16, "0.4px"],
  ["text-label-lg", 14, 20, "0.1px", 500],
  ["text-label-md", 12, 16, "0.5px", 500],
  ["text-label-sm", 11, 16, "0.5px", 500],
]

const usage = `<h1 className="text-display-sm font-semibold tracking-tight">Billing</h1>
<p className="text-body-lg text-on-surface-variant">Plans, invoices and payment methods.</p>
<span className="text-label-lg">Upgrade</span>`

export default function Typography() {
  return (
    <Prose>
      <p>
        Each style is a Tailwind v4 font-size token with its line height, tracking and (for titles and labels) weight attached, so{" "}
        <InlineCode>text-title-md</InlineCode> is the whole M3 style. Add <InlineCode>font-medium</InlineCode> or <InlineCode>font-semibold</InlineCode> for the
        Expressive "emphasized" versions.
      </p>
      <CodePanel code={usage} />

      <H2>The scale</H2>
      <DocTable
        minWidth={560}
        columns={["Class", "Size / line", "Tracking", "Weight", "Sample"]}
        cellClassName={["font-mono text-body-sm text-primary", "tabular-nums", "tabular-nums", "tabular-nums"]}
        rows={SCALE.map(([name, size, line, track, weight]) => [
          name,
          `${size} / ${line}`,
          track,
          weight ?? 400,
          <span className={`${name} block truncate text-on-surface`} style={{ maxWidth: 220 }}>
            Expressive
          </span>,
        ])}
      />

      <H2>Fonts</H2>
      <p>
        <InlineCode>font-sans</InlineCode> is Roboto Flex (a variable font, so optical size follows the text size) and <InlineCode>font-mono</InlineCode> is Roboto
        Mono. Both come from the Google Fonts link in <TextLink to="/docs/install">Installation</TextLink>; self-host them the same way if you prefer. Without them
        the stack falls back to Roboto, then the system UI font.
      </p>
      <p>
        Long-form text reads better with <InlineCode>text-pretty</InlineCode> and headings with <InlineCode>text-balance</InlineCode>; both are plain Tailwind.
      </p>
    </Prose>
  )
}
