import { Icon } from "@/components/ui/icon"
import { Reveal } from "@/components/ui/reveal"
import { cn } from "@/lib/utils"

const ITEMS = [
  {
    icon: "hub",
    tone: "bg-primary-container text-on-primary-container",
    title: "Every cluster, one view",
    body: "AWS, GCP, Azure and the rack in the basement. Kestrel Grid inventories it all in minutes and keeps it honest.",
  },
  {
    icon: "policy",
    tone: "bg-tertiary-container text-on-tertiary-container",
    title: "Guardrails as code",
    body: "Write a policy once. It's enforced at plan, deploy and runtime, with a preview so nobody gets surprised on a Friday.",
  },
  {
    icon: "monitoring",
    tone: "bg-secondary-container text-on-secondary-container",
    title: "Observe without the tab sprawl",
    body: "Traces, logs and metrics, correlated per deploy. The incident timeline writes itself.",
  },
]

/** "Why us" section: three cards whose icon tile rounds into a circle on hover. */
export function ProblemCards({
  title = "Three problems, one control plane.",
  items = ITEMS,
}: {
  title?: string
  items?: typeof ITEMS
}) {
  return (
    <Reveal className="mx-auto max-w-7xl px-4 py-20 md:px-8">
      <div className="max-w-2xl">
        <h2 className="text-headline-lg font-semibold text-balance md:text-display-sm">{title}</h2>
      </div>
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {items.map((it) => (
          <div
            key={it.title}
            className="group rounded-xl bg-surface-container-low p-6 transition-[translate,background-color] duration-(--md-spring-fast-spatial-duration) ease-fast-spatial hover:-translate-y-1 hover:bg-surface-container"
          >
            <span
              className={cn(
                "grid size-14 place-items-center rounded-lg shape-morph group-hover:rounded-[28px]",
                it.tone,
              )}
            >
              <Icon size={28}>{it.icon}</Icon>
            </span>
            <h3 className="mt-6 text-title-lg">{it.title}</h3>
            <p className="mt-2 text-body-md text-on-surface-variant">{it.body}</p>
          </div>
        ))}
      </div>
    </Reveal>
  )
}
