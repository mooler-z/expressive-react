import { Avatar } from "@/components/ui/avatar"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/popover"

export default function PopoverHoverCard() {
  return (
    <p className="max-w-md text-body-lg text-on-surface">
      Deployed by{" "}
      <HoverCard>
        <HoverCardTrigger href="#maya">@maya</HoverCardTrigger>
        <HoverCardContent>
          <div className="flex gap-3">
            <Avatar size="lg" name="Maya Lindqvist" status="online" />
            <div className="min-w-0">
              <div className="text-title-sm text-on-surface">Maya Lindqvist</div>
              <div className="text-body-sm text-on-surface-variant">Platform · Stockholm</div>
              <p className="mt-2 text-body-md text-on-surface-variant">Owns checkout-api and the deploy pipeline.</p>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>{" "}
      to production 12 minutes ago.
    </p>
  )
}
