import { Accordion, AccordionItem } from "@/components/ui/accordion"

export default function OutlinedAccordions() {
  return (
    <div className="grid w-full max-w-3xl gap-6 md:grid-cols-2">
      <Accordion variant="outlined" allowsMultipleExpanded defaultExpandedKeys={["a", "b"]}>
        <AccordionItem id="a" title="Outlined · multiple open">
          allowsMultipleExpanded lets several panels stay open.
        </AccordionItem>
        <AccordionItem id="b" title="Open panels outline in primary">
          The border switches to primary while expanded.
        </AccordionItem>
        <AccordionItem id="c" title="Disabled item" isDisabled>
          Hidden.
        </AccordionItem>
      </Accordion>
      <Accordion variant="flush" defaultExpandedKeys={["x"]}>
        <AccordionItem id="x" title="Flush">
          Dividers between items, no containers.
        </AccordionItem>
        <AccordionItem id="y" title="Compact rows">
          48dp triggers in title-small.
        </AccordionItem>
        <AccordionItem id="z" title="Hover tints the label">
          The trigger turns primary on hover.
        </AccordionItem>
      </Accordion>
    </div>
  )
}
