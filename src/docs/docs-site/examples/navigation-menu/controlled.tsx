import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuPanelLink,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"

export default function NavigationMenuControlled() {
  const [open, setOpen] = useState<string | null>(null)

  return (
    <div className="flex w-full max-w-2xl flex-col items-start gap-4">
      <div className="h-56 w-full rounded-xl border border-outline-variant bg-surface p-2">
        <NavigationMenu value={open} onValueChange={setOpen}>
          <NavigationMenuList>
            <NavigationMenuItem value="learn">
              <NavigationMenuTrigger>Learn</NavigationMenuTrigger>
              <NavigationMenuContent>
                <NavigationMenuPanelLink href="#guides" icon="school" title="Guides" />
                <NavigationMenuPanelLink href="#videos" icon="smart_display" title="Videos" />
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      <div className="flex items-center gap-3">
        <Button size="xs" variant="tonal" onPress={() => setOpen("learn")}>
          Open “Learn”
        </Button>
        <span className="text-body-sm text-on-surface-variant">value: {open ?? "null"}</span>
      </div>
    </div>
  )
}
