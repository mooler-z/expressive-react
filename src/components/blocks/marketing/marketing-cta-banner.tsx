import { Reveal } from "@/components/ui/reveal"

import { ButtonLink, DecorShape } from "./marketing-shared"

/** Closing call-to-action on a primary-container panel with a slowly spinning sunny shape. */
export function CtaBanner({
  title = "Your first cluster is connected in an afternoon. Promise.",
  body = "Free for teams up to 10. No card, no sales call unless you want one.",
  primary = { label: "Start free", href: "#pricing" },
  secondary = { label: "Talk to an engineer", href: "#contact" },
}: {
  title?: string
  body?: string
  primary?: { label: string; href: string }
  secondary?: { label: string; href: string }
}) {
  return (
    <Reveal className="mx-auto max-w-7xl px-4 pb-24 md:px-8">
      <div className="relative overflow-hidden rounded-2xl bg-primary-container px-6 py-14 text-on-primary-container md:px-14">
        <DecorShape
          shape="sunny"
          cycle={["sunny", "cookie12", "clover8"]}
          interval={3200}
          spin={80}
          className="pointer-events-none absolute -top-10 -right-10 size-64 text-primary/15 md:size-96"
        />
        <div className="relative max-w-2xl">
          <h2 className="text-headline-lg font-semibold text-balance md:text-display-sm">{title}</h2>
          <p className="mt-4 text-body-lg">{body}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href={primary.href} size="md">
              {primary.label}
            </ButtonLink>
            <ButtonLink
              href={secondary.href}
              size="md"
              variant="outlined"
              className="border-on-primary-container/30 text-on-primary-container"
            >
              {secondary.label}
            </ButtonLink>
          </div>
        </div>
      </div>
    </Reveal>
  )
}
