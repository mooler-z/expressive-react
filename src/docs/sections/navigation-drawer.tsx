import * as React from "react"
import { Button as AriaButton, DialogTrigger } from "react-aria-components"

import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { Menu, MenuItem, MenuPopover, MenuTrigger } from "@/components/ui/menu"
import {
  ModalNavigationDrawer,
  NavigationDrawer,
  NavigationDrawerDivider,
  NavigationDrawerGroup,
  NavigationDrawerHeadline,
  NavigationDrawerItem,
} from "@/components/ui/navigation-drawer"
import { snackbar } from "@/components/ui/snackbar"
import { Section, Variant, Variants } from "@/docs/section"

function MailItems() {
  return (
    <>
      <NavigationDrawerHeadline>Mail</NavigationDrawerHeadline>
      <NavigationDrawerItem value="inbox" icon="inbox" badge={24}>
        Inbox
      </NavigationDrawerItem>
      <NavigationDrawerItem value="outbox" icon="send" badge="100+">
        Outbox
      </NavigationDrawerItem>
      <NavigationDrawerItem value="favorites" icon="favorite">
        Favorites
      </NavigationDrawerItem>
      <NavigationDrawerItem value="trash" icon="delete">
        Trash
      </NavigationDrawerItem>
      <NavigationDrawerDivider />
      <NavigationDrawerHeadline>Labels</NavigationDrawerHeadline>
      <NavigationDrawerItem value="incidents" icon="label">
        Incidents
      </NavigationDrawerItem>
      <NavigationDrawerItem value="vendors" icon="label">
        Vendors
      </NavigationDrawerItem>
    </>
  )
}

const frame = "overflow-hidden rounded-lg bg-surface"

export default function NavigationDrawerSection() {
  const [mail, setMail] = React.useState("inbox")
  return (
    <Section
      id="navigation-drawer"
      description="360dp wide, items 56dp with a full-radius active indicator. Sectioned with headlines and dividers; standard or modal."
      spec="https://m3.material.io/components/navigation-drawer/overview"
    >
      <div className="flex flex-wrap items-start gap-6">
        <NavigationDrawer value={mail} onValueChange={setMail} className="rounded-lg bg-surface-container-low ring-1 ring-outline-variant">
          <MailItems />
        </NavigationDrawer>
        <div className="max-w-xs space-y-3 text-body-md text-on-surface-variant">
          <DialogTrigger>
            <Button>
              <Icon>menu</Icon>
              Open modal drawer
            </Button>
            <ModalNavigationDrawer value={mail} onValueChange={setMail}>
              <MailItems />
            </ModalNavigationDrawer>
          </DialogTrigger>
          <p>
            Standard drawer on the left; the modal variant slides over content on compact windows and closes on scrim tap, Esc or selection. Both
            share the selection here: <span className="font-medium text-on-surface capitalize">{mail}</span>.
          </p>
        </div>
      </div>

      <Variants>
        <Variant n={1} label="Dense · text only" className={frame}>
          <NavigationDrawer dense variant="plain" defaultValue="theming" className="p-2">
            <NavigationDrawerHeadline className="min-h-10">Docs</NavigationDrawerHeadline>
            <NavigationDrawerItem value="start">Getting started</NavigationDrawerItem>
            <NavigationDrawerItem value="install">Installation</NavigationDrawerItem>
            <NavigationDrawerItem value="theming">Theming</NavigationDrawerItem>
            <NavigationDrawerItem value="components">Components</NavigationDrawerItem>
            <NavigationDrawerItem value="changelog">Changelog</NavigationDrawerItem>
          </NavigationDrawer>
        </Variant>
        <Variant n={2} label="Tertiary · counts" className={frame}>
          <NavigationDrawer indicator="tertiary" variant="plain" defaultValue="inbox" className="p-2">
            <NavigationDrawerItem value="inbox" icon="inbox" badge={24}>
              Inbox
            </NavigationDrawerItem>
            <NavigationDrawerItem value="outbox" icon="send" badge={3}>
              Outbox
            </NavigationDrawerItem>
            <NavigationDrawerItem value="favorites" icon="favorite">
              Favorites
            </NavigationDrawerItem>
            <NavigationDrawerItem value="trash" icon="delete">
              Trash
            </NavigationDrawerItem>
          </NavigationDrawer>
        </Variant>
        <Variant n={3} label="Nested group" className={frame}>
          <NavigationDrawer variant="plain" defaultValue="grid" className="p-2">
            <NavigationDrawerItem value="overview" icon="dashboard">
              Overview
            </NavigationDrawerItem>
            <NavigationDrawerGroup title="Projects" icon="folder" defaultExpanded>
              <NavigationDrawerItem value="grid">Kestrel Grid</NavigationDrawerItem>
              <NavigationDrawerItem value="edge">Edge cache</NavigationDrawerItem>
            </NavigationDrawerGroup>
            <NavigationDrawerItem value="billing" icon="credit_card">
              Billing
            </NavigationDrawerItem>
          </NavigationDrawer>
        </Variant>
        <Variant n={4} label="Account header" className={frame}>
          <NavigationDrawer variant="plain" defaultValue="home" className="p-2">
            <MenuTrigger>
              <AriaButton className="state-layer focus-ring relative mb-2 flex h-16 w-full cursor-pointer items-center gap-3 rounded-lg px-3 text-start text-on-surface">
                <Avatar name="Maya Lindqvist" color="tertiary" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-title-sm">Maya Lindqvist</span>
                  <span className="block truncate text-body-sm text-on-surface-variant">maya@kestrel.io</span>
                </span>
                <Icon className="text-on-surface-variant">unfold_more</Icon>
              </AriaButton>
              <MenuPopover placement="bottom start">
                <Menu aria-label="Account" onAction={(k) => snackbar(`Switched to ${String(k)}`)} className="w-60">
                  <MenuItem id="maya@kestrel.io" icon="check">maya@kestrel.io</MenuItem>
                  <MenuItem id="maya@labs.kestrel.io">maya@labs.kestrel.io</MenuItem>
                </Menu>
              </MenuPopover>
            </MenuTrigger>
            <NavigationDrawerItem value="home" icon="home">
              Home
            </NavigationDrawerItem>
            <NavigationDrawerItem value="team" icon="group">
              Team
            </NavigationDrawerItem>
            <NavigationDrawerItem value="billing" icon="credit_card">
              Billing
            </NavigationDrawerItem>
            <NavigationDrawerDivider />
            <NavigationDrawerItem icon="logout" onPress={() => snackbar("Signed out")}>
              Sign out
            </NavigationDrawerItem>
          </NavigationDrawer>
        </Variant>
      </Variants>
    </Section>
  )
}
