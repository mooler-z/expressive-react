import { Accordion, AccordionItem, Collapsible } from "@/components/ui/accordion"
import { Switch } from "@/components/ui/switch"
import { Section, Variant, Variants } from "@/docs/section"

const FAQ = [
  ["billing", "How does usage-based billing work?", "You're billed hourly for running workloads, rounded to the minute. Reserved capacity is billed monthly in advance and discounted up to 40%."],
  ["byoc", "Can I bring my own cloud accounts?", "Yes. Connect AWS, GCP and Azure accounts with read-only roles; Kestrel never stores long-lived credentials."],
  ["onprem", "Is there an on-premise option?", "Enterprise plans include an air-gapped installer and a dedicated success engineer."],
] as const

const SHORT = [
  ["workload", "What counts as a workload?", "A deployment, job or function Kestrel manages. Replicas don’t count."],
  ["cloud", "Can we bring our own cloud?", "Yes. Read-only roles on AWS, GCP and Azure."],
  ["onprem", "Is there an on-prem option?", "Enterprise includes an air-gapped installer."],
] as const

const TILE = "w-full"

export default function AccordionSection() {
  return (
    <Section
      id="accordion"
      description="React Aria disclosures with a spring height animation and a turning indicator; open panels gain a container tone. Arrow keys aren't needed: each trigger is a button, and find-in-page opens closed panels. Collapsible is the single-item version."
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Accordion defaultExpandedKeys={["billing"]}>
          {FAQ.map(([id, q, a]) => (
            <AccordionItem key={id} id={id} title={q}>
              {a}
            </AccordionItem>
          ))}
        </Accordion>
        <div className="space-y-3">
          <div className="text-label-md tracking-wider text-on-surface-variant uppercase">Collapsible</div>
          <Collapsible title="@kestrel/grid-core depends on 3 packages">
            <ul className="divide-y divide-outline-variant font-mono text-body-md">
              {[
                ["@kestrel/scheduler", "^4.2.0"],
                ["@kestrel/policy", "^1.9.3"],
                ["@kestrel/telemetry", "^2.0.1"],
              ].map(([pkg, v]) => (
                <li key={pkg} className="px-4 py-3">
                  {pkg} <span className="text-on-surface-variant">{v}</span>
                </li>
              ))}
            </ul>
          </Collapsible>
          <Collapsible variant="tonal" title="Show advanced options">
            <div className="space-y-2 px-4 pb-4 text-body-md">
              <Switch defaultSelected className="flex w-full flex-row-reverse justify-between text-body-md">
                Retry failed jobs automatically
              </Switch>
              <Switch className="flex w-full flex-row-reverse justify-between text-body-md">Verbose logging</Switch>
            </div>
          </Collapsible>
        </div>
      </div>

      <Variants cols="md:grid-cols-2 xl:grid-cols-3">
        <Variant n={1} label="Flush" className={TILE}>
          <Accordion variant="flush" defaultExpandedKeys={["workload"]}>
            {SHORT.map(([id, q, a]) => (
              <AccordionItem key={id} id={id} title={q}>
                {a}
              </AccordionItem>
            ))}
          </Accordion>
        </Variant>
        <Variant n={2} label="Outlined" className={TILE}>
          <Accordion variant="outlined" defaultExpandedKeys={["cloud"]}>
            {SHORT.map(([id, q, a]) => (
              <AccordionItem key={id} id={id} title={q}>
                {a}
              </AccordionItem>
            ))}
          </Accordion>
        </Variant>
        <Variant n={3} label="With icons" className={TILE}>
          <Accordion variant="list" defaultExpandedKeys={["clusters"]}>
            {(
              [
                ["clusters", "dns", "Clusters", 12],
                ["policies", "policy", "Policies", 48],
                ["owners", "group", "Owners", 6],
              ] as const
            ).map(([id, icon, label, n]) => (
              <AccordionItem key={id} id={id} leading={icon} title={label} trailing={n}>
                {n} items synced 2 min ago.
              </AccordionItem>
            ))}
          </Accordion>
        </Variant>
        <Variant n={4} label="Expressive" className={TILE}>
          <Accordion variant="expressive" defaultExpandedKeys={["workload"]}>
            {SHORT.map(([id, q, a]) => (
              <AccordionItem key={id} id={id} title={q}>
                {a}
              </AccordionItem>
            ))}
          </Accordion>
        </Variant>
        <Variant n={5} label="Numbered · multiple open" className={TILE}>
          <Accordion variant="numbered" allowsMultipleExpanded defaultExpandedKeys={["onprem"]}>
            {SHORT.map(([id, q, a], i) => (
              <AccordionItem key={id} id={id} number={i + 1} title={q}>
                {a}
              </AccordionItem>
            ))}
          </Accordion>
        </Variant>
      </Variants>
    </Section>
  )
}
