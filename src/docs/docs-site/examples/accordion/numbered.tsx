import { Accordion, AccordionItem } from "@/components/ui/accordion"

export default function NumberedAccordion() {
  return (
    <Accordion variant="numbered" className="w-full max-w-xl" defaultExpandedKeys={["create"]}>
      <AccordionItem id="create" number={1} title="Create a project">
        Pick a name and a region. You can change both later.
      </AccordionItem>
      <AccordionItem id="connect" number={2} title="Connect a repository">
        Install the GitHub app and choose which repositories it can read.
      </AccordionItem>
      <AccordionItem id="deploy" number={3} title="Deploy">
        Every push to main builds and deploys automatically.
      </AccordionItem>
    </Accordion>
  )
}
