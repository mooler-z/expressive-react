import * as React from "react"
import { Link } from "react-aria-components"

import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { IconButton } from "@/components/ui/icon-button"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuGroupLabel,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuPanelLink,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils"
import { Section, Variant, Variants } from "@/docs/section"

function Brand({ small }: { small?: boolean }) {
  return (
    <span className={cn("flex items-center gap-2 pr-4 font-semibold", small ? "text-title-sm" : "text-title-md")}>
      <span className={cn("grid place-items-center bg-primary text-on-primary", small ? "size-7 rounded-sm" : "size-8 rounded-full")}>
        <Icon size={small ? 18 : 20} filled>flight_takeoff</Icon>
      </span>
      Kestrel
    </span>
  )
}

export default function NavigationMenuSection() {
  return (
    <Section
      id="navigation-menu"
      description="Marketing-site header with a mega-menu panel: link groups with icons and a featured card, on surface-container. One panel at a time; Escape or an outside press closes it."
    >
      <div className="overflow-hidden rounded-lg bg-surface">
        <NavigationMenu>
          <div className="flex h-16 items-center gap-1 px-4">
            <Brand />
            <NavigationMenuList className="hidden md:flex">
              <NavigationMenuItem value="products">
                <NavigationMenuTrigger>Products</NavigationMenuTrigger>
                <NavigationMenuContent className="grid gap-6 p-6 md:grid-cols-[1fr_1fr_260px]">
                  <div>
                    <NavigationMenuGroupLabel>Platform</NavigationMenuGroupLabel>
                    <NavigationMenuPanelLink href="#navigation-menu" icon="grid_view" title="Kestrel Grid">One control plane for every cluster</NavigationMenuPanelLink>
                    <NavigationMenuPanelLink href="#navigation-menu" icon="policy" title="Policy engine">Guardrails as code, enforced at deploy</NavigationMenuPanelLink>
                    <NavigationMenuPanelLink href="#navigation-menu" icon="monitoring" title="Observe">Traces, logs and metrics, correlated</NavigationMenuPanelLink>
                  </div>
                  <div>
                    <NavigationMenuGroupLabel>Developers</NavigationMenuGroupLabel>
                    <NavigationMenuPanelLink href="#navigation-menu" icon="terminal" title="CLI & SDKs">Go, TypeScript, Python</NavigationMenuPanelLink>
                    <NavigationMenuPanelLink href="#navigation-menu" icon="api" title="API reference">REST and gRPC, versioned</NavigationMenuPanelLink>
                    <NavigationMenuPanelLink href="#navigation-menu" icon="school" title="Guides">From zero to production in an afternoon</NavigationMenuPanelLink>
                  </div>
                  <Link
                    href="#navigation-menu"
                    className="state-layer focus-ring flex flex-col justify-between gap-6 rounded-lg bg-primary-container p-5 text-on-primary-container"
                  >
                    <Icon size={32}>new_releases</Icon>
                    <span>
                      <span className="block text-title-md">What's new in 4.2</span>
                      <span className="mt-1 block text-body-sm">Policy previews, expanded rail, and 30% faster rollouts.</span>
                    </span>
                  </Link>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem value="solutions">
                <NavigationMenuTrigger>Solutions</NavigationMenuTrigger>
                <NavigationMenuContent className="grid gap-6 p-6 md:grid-cols-3">
                  <NavigationMenuPanelLink href="#navigation-menu" icon="account_balance" title="Financial services">Audit-ready by default</NavigationMenuPanelLink>
                  <NavigationMenuPanelLink href="#navigation-menu" icon="local_hospital" title="Healthcare">HIPAA-aligned regions</NavigationMenuPanelLink>
                  <NavigationMenuPanelLink href="#navigation-menu" icon="storefront" title="Retail">Scale through peak traffic</NavigationMenuPanelLink>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink href="#navigation-menu">Pricing</NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink href="#navigation-menu">Docs</NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
            <div className="ml-auto flex items-center gap-2">
              <Button variant="text" className="hidden sm:inline-flex">Sign in</Button>
              <Button>Start free</Button>
            </div>
          </div>
          <NavigationMenuViewport />
        </NavigationMenu>
      </div>

      <Variants cols="lg:grid-cols-[minmax(0,1fr)_300px]">
        <Variant n={1} label="Dropdown · single column" className="relative min-h-24 rounded-lg bg-surface p-4 pb-[360px]">
          <NavigationMenu className="w-full">
            <div className="flex h-14 items-center gap-1 rounded-md bg-surface-container-low px-3">
              <Brand small />
              <NavigationMenuList>
                <NavigationMenuItem value="product">
                  <NavigationMenuTrigger className="h-9">Product</NavigationMenuTrigger>
                  <NavigationMenuContent className="w-80">
                    <NavigationMenuPanelLink href="#navigation-menu" icon="rocket_launch" title="Deploys">Progressive rollouts with automatic rollback</NavigationMenuPanelLink>
                    <NavigationMenuPanelLink href="#navigation-menu" icon="monitoring" title="Observability">Traces, metrics and logs in one place</NavigationMenuPanelLink>
                    <NavigationMenuPanelLink href="#navigation-menu" icon="policy" title="Policies">Guardrails as code, checked on every deploy</NavigationMenuPanelLink>
                    <NavigationMenuPanelLink href="#navigation-menu" icon="crisis_alert" title="Incidents">On-call, paging and status pages</NavigationMenuPanelLink>
                    <Link
                      href="#navigation-menu"
                      className="state-layer focus-ring mt-1 flex items-center justify-between rounded-md bg-secondary-container px-3 py-2 text-label-lg text-on-secondary-container"
                    >
                      What's new in 4.2
                      <Icon size={20}>arrow_forward</Icon>
                    </Link>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink href="#navigation-menu" className="h-9">Docs</NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink href="#navigation-menu" className="h-9">Pricing</NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </div>
          </NavigationMenu>
        </Variant>

        <Variant n={2} label="Compact · expandable" className="rounded-lg bg-surface">
          <CompactNav />
        </Variant>
      </Variants>
    </Section>
  )
}

/** Compact widths: the row collapses into a sheet with expandable groups. */
function CompactNav() {
  const [open, setOpen] = React.useState<string | null>("Product")
  const groups: [string, string[]][] = [
    ["Product", ["Deploys", "Observability", "Policies", "Incidents"]],
    ["Solutions", ["Platform teams", "Fintech", "Gaming"]],
  ]
  return (
    <div className="w-full">
      <div className="flex h-14 items-center px-3">
        <Brand small />
        <IconButton aria-label="Close menu" className="ml-auto">
          <Icon>close</Icon>
        </IconButton>
      </div>
      <nav aria-label="Compact" className="space-y-1 px-2 pb-3">
        {groups.map(([title, links]) => {
          const isOpen = open === title
          return (
            <div key={title} className={cn("rounded-lg", isOpen && "bg-surface-container")}>
              <button
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? null : title)}
                className="state-layer focus-ring flex h-12 w-full items-center justify-between rounded-lg px-4 text-title-sm"
              >
                {title}
                <Icon className={cn("transition-transform duration-(--md-spring-fast-spatial-duration) ease-fast-spatial", isOpen && "rotate-180")}>
                  expand_more
                </Icon>
              </button>
              {isOpen && (
                <div className="m3-panel-enter pb-2">
                  {links.map((l) => (
                    <a key={l} href="#navigation-menu" className="state-layer flex h-10 items-center rounded-full px-6 text-body-md text-on-surface-variant">
                      {l}
                    </a>
                  ))}
                </div>
              )}
            </div>
          )
        })}
        {["Pricing", "Docs"].map((l) => (
          <a key={l} href="#navigation-menu" className="state-layer flex h-12 items-center rounded-lg px-4 text-title-sm">
            {l}
          </a>
        ))}
        <div className="flex gap-2 px-2 pt-2">
          <Button className="flex-1">Start free</Button>
          <Button variant="outlined" className="flex-1">Sign in</Button>
        </div>
      </nav>
    </div>
  )
}
