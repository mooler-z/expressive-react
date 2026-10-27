import { Accordion, AccordionItem } from "@/components/ui/accordion"

export default function ListAccordion() {
  return (
    <Accordion variant="list" className="w-full max-w-md" allowsMultipleExpanded>
      <AccordionItem id="inbox" title="Inbox" leading="inbox" trailing="12">
        3 unread from your team, 9 notifications.
      </AccordionItem>
      <AccordionItem id="drafts" title="Drafts" leading="draft" trailing="2">
        Release notes and the quarterly update.
      </AccordionItem>
      <AccordionItem id="archive" title="Archive" leading="archive">
        Conversations older than 90 days.
      </AccordionItem>
    </Accordion>
  )
}
