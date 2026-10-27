import * as React from "react"

import { ExtendedFab, Fab, FabMenu, FabMenuItem } from "@/components/ui/fab"
import { Icon } from "@/components/ui/icon"
import { List, ListItem } from "@/components/ui/list"
import { snackbar } from "@/components/ui/snackbar"
import { Switch } from "@/components/ui/switch"
import { DockedToolbar, ToolbarButton } from "@/components/ui/toolbar"
import { Row, Section, Variant, Variants } from "@/docs/section"

const demo = (label: string) => () => snackbar(`${label} · demo action`)

export default function FabSection() {
  const [expanded, setExpanded] = React.useState(true)
  const [menuOpen, setMenuOpen] = React.useState(false)
  return (
    <Section
      id="fab"
      description="Small 40 · FAB 56 · medium 80 · large 96, extended FAB, and the Expressive FAB menu. Primary-container is the default color; secondary, tertiary and the solid roles are alternates."
      spec="https://m3.material.io/components/floating-action-button/overview"
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_auto]">
        <div className="space-y-8">
          <Row label="Sizes & colors">
            <Fab size="sm" aria-label="Edit" onPress={demo("Small FAB")}>
              <Icon>edit</Icon>
            </Fab>
            <Fab aria-label="Edit" onPress={demo("FAB")}>
              <Icon>edit</Icon>
            </Fab>
            <Fab size="md" aria-label="Edit" onPress={demo("Medium FAB")}>
              <Icon>edit</Icon>
            </Fab>
            <Fab size="lg" aria-label="Edit" onPress={demo("Large FAB")}>
              <Icon>edit</Icon>
            </Fab>
            <span className="mx-1 h-8 w-px bg-outline-variant" />
            <Fab color="secondary-container" aria-label="Edit" onPress={demo("Secondary FAB")}>
              <Icon>edit</Icon>
            </Fab>
            <Fab color="tertiary-container" aria-label="Edit" onPress={demo("Tertiary FAB")}>
              <Icon>edit</Icon>
            </Fab>
            <Fab color="primary" aria-label="Edit" onPress={demo("Primary FAB")}>
              <Icon>edit</Icon>
            </Fab>
          </Row>
          <Row label="Extended · S M L">
            <ExtendedFab icon="add" onPress={demo("Compose")}>
              Compose
            </ExtendedFab>
            <ExtendedFab icon="navigation" color="tertiary-container" size="md" onPress={demo("Navigate")}>
              Navigate
            </ExtendedFab>
            <ExtendedFab color="secondary-container" onPress={demo("Text only")}>
              Text only
            </ExtendedFab>
          </Row>
          <Row label="Extended · collapse (e.g. on scroll)">
            <ExtendedFab icon="edit" expanded={expanded} onPress={demo("Compose")}>
              Compose
            </ExtendedFab>
            <ExtendedFab icon="edit" size="lg" expanded={expanded} onPress={demo("Compose")}>
              Compose
            </ExtendedFab>
            <Switch isSelected={expanded} onChange={setExpanded}>
              Expanded
            </Switch>
          </Row>
        </div>
        <div className="space-y-3">
          <div className="text-label-md tracking-wider text-on-surface-variant uppercase">
            FAB menu · {menuOpen ? "open" : "closed"}
          </div>
          <div className="flex min-h-[260px] items-end justify-end">
            <FabMenu
              aria-label="Meeting actions"
              isOpen={menuOpen}
              onOpenChange={setMenuOpen}
              onAction={(key) => snackbar(`${key} · demo action`)}
            >
              <FabMenuItem id="Start meeting" icon="videocam">
                Start meeting
              </FabMenuItem>
              <FabMenuItem id="Schedule" icon="calendar_add_on">
                Schedule
              </FabMenuItem>
              <FabMenuItem id="Copy invite link" icon="link">
                Copy invite link
              </FabMenuItem>
            </FabMenu>
          </div>
        </div>
      </div>

      <Variants>
        <Variant n={1} label="Medium · 80dp">
          <Fab size="md" aria-label="Edit">
            <Icon>edit</Icon>
          </Fab>
          <Fab size="md" color="secondary-container" aria-label="Add">
            <Icon>add</Icon>
          </Fab>
        </Variant>
        <Variant n={2} label="Extended · roles" className="flex min-h-24 flex-col items-center justify-center gap-3 rounded-lg bg-surface p-4">
          <ExtendedFab icon="edit_square" color="tertiary-container">
            Compose
          </ExtendedFab>
          <ExtendedFab icon={<Icon filled>navigation</Icon>} color="primary">
            Route
          </ExtendedFab>
        </Variant>
        <Variant n={3} label="In a bottom app bar" className="flex min-h-24 flex-col justify-end overflow-hidden rounded-lg bg-surface">
          <DockedToolbar aria-label="Note actions" className="h-20 pe-4 ps-2">
            <div className="flex gap-1">
              {["check_box", "brush", "mic", "image"].map((i) => (
                <ToolbarButton key={i} aria-label={i.replace("_", " ")}>
                  <Icon>{i}</Icon>
                </ToolbarButton>
              ))}
            </div>
            <Fab aria-label="New note" className="shadow-none data-hovered:shadow-none">
              <Icon>add</Icon>
            </Fab>
          </DockedToolbar>
        </Variant>
        <Variant n={4} label="Anchored over a list" className="relative min-h-24 overflow-hidden rounded-lg bg-surface pb-16">
          <List className="divide-y divide-outline-variant">
            <ListItem trailingText="09:41">Rollout notes</ListItem>
            <ListItem trailingText="Yesterday">Canary review</ListItem>
            <ListItem trailingText="Mon">Incident #482</ListItem>
          </List>
          <Fab aria-label="New note" className="absolute end-3 bottom-3">
            <Icon>add</Icon>
          </Fab>
        </Variant>
      </Variants>
    </Section>
  )
}
