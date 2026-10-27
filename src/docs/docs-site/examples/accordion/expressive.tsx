import { Accordion, AccordionItem } from "@/components/ui/accordion"

export default function ExpressiveAccordion() {
  return (
    <Accordion variant="expressive" className="w-full max-w-xl" defaultExpandedKeys={["billing"]}>
      <AccordionItem id="billing" title="How does billing work?">
        Usage is metered per project and billed monthly. Credits apply first.
      </AccordionItem>
      <AccordionItem id="seats" title="Do viewers count as seats?">
        No. Only members who can edit count toward your plan.
      </AccordionItem>
      <AccordionItem id="cancel" title="Can I cancel anytime?">
        Yes. Your workspace stays readable for 30 days after you cancel.
      </AccordionItem>
    </Accordion>
  )
}
