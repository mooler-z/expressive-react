import { Accordion, AccordionItem } from "@/components/ui/accordion"

export default function AccordionDemo() {
  return (
    <Accordion className="w-full max-w-xl" defaultExpandedKeys={["install"]}>
      <AccordionItem id="install" title="How do I install a component?">
        Run npx shadcn add @expressive/accordion. The file lands in your repo as plain TypeScript.
      </AccordionItem>
      <AccordionItem id="theme" title="Can I use my own colors?">
        Yes. Pass a seed to ThemeProvider or edit the --md-* tokens in expressive.css.
      </AccordionItem>
      <AccordionItem id="motion" title="Does it respect reduced motion?">
        Panels stop animating their height when the system asks for reduced motion.
      </AccordionItem>
    </Accordion>
  )
}
