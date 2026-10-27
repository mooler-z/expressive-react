import { Icon } from "@/components/ui/icon"
import { Reveal } from "@/components/ui/reveal"
import { cn } from "@/lib/utils"

import { IntegrationsPreview, InventoryPreview, PolicyPreview, RolloutPreview } from "./marketing-feature-previews"

function PageIntro() {
  return (
    <section className="mx-auto max-w-7xl px-4 pt-8 pb-12 md:px-8 lg:pt-12">
      <div className="max-w-2xl">
        <h1 className="text-display-sm font-semibold tracking-tight text-balance md:text-display-md">
          Everything your platform team does, with fewer tabs.
        </h1>
        <p className="mt-5 text-body-lg text-on-surface-variant">
          Inventory, policy, rollouts and observability share one data model, so a change in one place shows up
          everywhere else, instantly.
        </p>
      </div>
    </section>
  )
}

function FeatureIcon({ icon, tone }: { icon: string; tone: string }) {
  return (
    <span className={cn("grid size-12 place-items-center rounded-md", tone)}>
      <Icon>{icon}</Icon>
    </span>
  )
}

/** Features page: alternating copy/preview rows and an integrations panel. */
export function FeatureRows() {
  return (
    <>
      <PageIntro />
      <Reveal className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 md:px-8 lg:grid-cols-2">
        <div>
          <FeatureIcon icon="inventory_2" tone="bg-primary-container text-on-primary-container" />
          <h2 className="mt-5 text-headline-md font-medium">Inventory that stays true</h2>
          <p className="mt-3 text-body-lg text-on-surface-variant">
            Connect read-only roles and Kestrel discovers clusters, namespaces, workloads and owners. Drift is flagged
            in minutes, not at audit time.
          </p>
          <ul className="mt-5 space-y-2 text-body-md">
            {["AWS, GCP, Azure, bare metal, edge", "Ownership inferred from repos and on-call schedules", "Export to your CMDB, or replace it"].map(
              (p) => (
                <li key={p} className="flex items-start gap-3">
                  <Icon size={20} className="text-primary">
                    check_circle
                  </Icon>
                  {p}
                </li>
              ),
            )}
          </ul>
        </div>
        <div className="rounded-xl bg-surface-container-low p-4">
          <div className="rounded-lg bg-surface p-4 shadow-1">
            <InventoryPreview />
          </div>
        </div>
      </Reveal>

      <section className="bg-surface-container-low">
        <Reveal className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 md:px-8 lg:grid-cols-2">
          <div className="rounded-xl bg-surface p-4 shadow-1">
            <PolicyPreview />
          </div>
          <div>
            <FeatureIcon icon="policy" tone="bg-tertiary-container text-on-tertiary-container" />
            <h2 className="mt-5 text-headline-md font-medium">Policy with a preview button</h2>
            <p className="mt-3 text-body-lg text-on-surface-variant">
              Write guardrails in Rego or plain YAML. See exactly what a rule would block before you turn it on, then
              enforce at plan, deploy and runtime.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {["OPA / Rego", "Kyverno", "CIS benchmarks", "Exceptions with expiry"].map((t) => (
                <span
                  key={t}
                  className="inline-flex h-8 items-center rounded-sm border border-outline-variant px-3 text-label-lg text-on-surface-variant"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      <Reveal className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 md:px-8 lg:grid-cols-2">
        <div>
          <FeatureIcon icon="rocket_launch" tone="bg-secondary-container text-on-secondary-container" />
          <h2 className="mt-5 text-headline-md font-medium">Rollouts that watch themselves</h2>
          <p className="mt-3 text-body-lg text-on-surface-variant">
            Pick canary, blue-green or all-at-once. Kestrel compares golden signals against the baseline and pauses or
            rolls back automatically.
          </p>
        </div>
        <div className="rounded-xl bg-surface-container-low p-4">
          <div className="rounded-lg bg-surface p-5 shadow-1">
            <RolloutPreview />
          </div>
        </div>
      </Reveal>

      <Reveal className="mx-auto max-w-7xl px-4 py-14 md:px-8">
        <div className="rounded-2xl bg-surface-container-low p-8 md:p-12">
          <h2 className="text-headline-md font-medium">Plays well with the tools you already pay for</h2>
          <div className="mt-6">
            <IntegrationsPreview chipClassName="bg-surface" />
          </div>
        </div>
      </Reveal>
    </>
  )
}
