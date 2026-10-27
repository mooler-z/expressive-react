import { Icon } from "@/components/ui/icon"
import { Reveal } from "@/components/ui/reveal"

/** Outcomes bento: headline stat, two KPI tiles and a customer quote. */
export function ProofBento() {
  return (
    <Reveal className="mx-auto max-w-7xl px-4 pb-20 md:px-8">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl bg-primary p-8 text-on-primary md:col-span-2">
          <div className="text-display-md font-semibold tabular-nums md:text-display-lg">
            30%<span className="text-headline-md"> faster rollouts</span>
          </div>
          <p className="mt-3 max-w-md text-body-lg opacity-90">
            Canary, blue-green or plain old all-at-once. Kestrel watches the golden signals and rolls back before your
            pager does.
          </p>
        </div>
        <div className="flex flex-col justify-between gap-6 rounded-xl bg-tertiary-container p-8 text-on-tertiary-container">
          <Icon size={40}>savings</Icon>
          <div>
            <div className="text-display-sm font-semibold tabular-nums">−22%</div>
            <div className="mt-1 text-body-lg">cloud spend after the first quarter, on average</div>
          </div>
        </div>
        <div className="flex flex-col justify-between gap-6 rounded-xl bg-surface-container-highest p-8">
          <Icon size={40} className="text-primary">
            timer
          </Icon>
          <div>
            <div className="text-display-sm font-semibold tabular-nums">4 min</div>
            <div className="mt-1 text-body-lg text-on-surface-variant">median time from alert to root cause</div>
          </div>
        </div>
        <div className="rounded-xl bg-secondary-container p-8 text-on-secondary-container md:col-span-2">
          <div className="flex items-start gap-4">
            <Icon size={40}>format_quote</Icon>
            <div>
              <p className="text-title-lg font-normal text-pretty">
                “We replaced four dashboards and a spreadsheet nobody trusted. Our on-call rotation stopped dreading
                Thursdays.”
              </p>
              <div className="mt-4 flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-full bg-secondary text-label-lg text-on-secondary">
                  PN
                </span>
                <div>
                  <div className="text-title-sm">Priya Nair</div>
                  <div className="text-body-sm opacity-80">VP Platform, Halide Bank</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  )
}
