import { Section } from "@/docs/section"

const SCALE: [token: string, metrics: string, sample: string, weight: string, className: string][] = [
  ["display-lg", "57/64", "Expressive by default", "emphasized 600", "text-display-sm font-semibold md:text-display-lg"],
  ["display-md", "45/52", "Infrastructure that keeps up", "400", "text-display-sm md:text-display-md"],
  ["display-sm", "36/44", "Ship Friday, sleep Saturday", "400", "text-display-sm"],
  ["headline-lg", "32/40", "Headline large, emphasized", "500", "text-headline-lg font-medium"],
  ["headline-md", "28/36", "Headline medium", "400", "text-headline-md"],
  ["headline-sm", "24/32", "Headline small", "400", "text-headline-sm"],
  ["title-lg", "22/28", "Title large — app bar titles, card headers", "400", "text-title-lg"],
  ["title-md", "16/24", "Title medium — list headlines, dialog subheads", "500 · +0.15", "text-title-md"],
  ["title-sm", "14/20", "Title small — dense headers", "500 · +0.1", "text-title-sm"],
  ["body-lg", "16/24", "Body large — long-form reading, dialog copy", "400 · +0.5", "text-body-lg"],
  ["body-md", "14/20", "Body medium — default UI text, table cells", "400 · +0.25", "text-body-md"],
  ["body-sm", "12/16", "Body small — supporting text, captions", "400 · +0.4", "text-body-sm"],
  ["label-lg", "14/20", "Label large — buttons, chips, nav items", "500 · +0.1", "text-label-lg"],
  ["label-md", "12/16", "Label medium — nav bar labels, badges", "500 · +0.5", "text-label-md"],
  ["label-sm", "11/16", "Label small — overlines, table headers", "500 · +0.5", "text-label-sm"],
]

export default function TypographySection() {
  return (
    <Section
      id="typography"
      description="Roboto Flex. 15 styles as text-display-lg … text-label-sm; add font-medium / font-semibold for the Expressive emphasized variants."
      spec="https://m3.material.io/styles/typography/type-scale-tokens"
    >
      <div className="-my-4 divide-y divide-outline-variant">
        {SCALE.map(([token, metrics, sample, weight, className]) => (
          <div key={token} className="grid items-baseline gap-2 py-4 md:grid-cols-[180px_1fr_120px]">
            <span className="font-mono text-body-sm text-on-surface-variant">
              {token} · {metrics}
            </span>
            <span className={`truncate ${className}`}>{sample}</span>
            <span className="hidden text-body-sm text-on-surface-variant md:block">{weight}</span>
          </div>
        ))}
      </div>
    </Section>
  )
}
