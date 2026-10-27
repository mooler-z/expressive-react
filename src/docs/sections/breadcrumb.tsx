import * as React from "react"
import { Breadcrumb as AriaBreadcrumb, Button as AriaButton } from "react-aria-components"

import { Avatar } from "@/components/ui/avatar"
import { Breadcrumb, BreadcrumbBack, BreadcrumbMenu, Breadcrumbs } from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { Menu, MenuItem, MenuPopover, MenuTrigger } from "@/components/ui/menu"
import { snackbar } from "@/components/ui/snackbar"
import { Section, Variant, Variants } from "@/docs/section"

const PROJECTS = ["Kestrel Grid", "Ledger", "Edge cache"]

export default function BreadcrumbSection() {
  const [project, setProject] = React.useState("Kestrel Grid")
  return (
    <Section
      id="breadcrumb"
      description="Label-large links with chevron separators; the current page sits in a secondary-container pill. Collapse the middle of a deep path into an icon button with a menu."
    >
      <div className="space-y-6">
        <Breadcrumbs>
          <Breadcrumb href="#breadcrumb" icon="home">
            Home
          </Breadcrumb>
          <Breadcrumb href="#breadcrumb">Projects</Breadcrumb>
          <Breadcrumb href="#breadcrumb">Kestrel Grid</Breadcrumb>
          <Breadcrumb>Settings</Breadcrumb>
        </Breadcrumbs>
        <Breadcrumbs current="plain">
          <Breadcrumb href="#breadcrumb">Home</Breadcrumb>
          <BreadcrumbMenu
            items={[{ label: "Projects" }, { label: "Kestrel Grid" }, { label: "Infrastructure" }]}
            onAction={(it) => snackbar(it.label)}
          />
          <Breadcrumb href="#breadcrumb">Clusters</Breadcrumb>
          <Breadcrumb className="font-mono">kestrel-prod-01</Breadcrumb>
        </Breadcrumbs>
      </div>

      <Variants cols="md:grid-cols-2">
        <Variant n={1} label="Slash · compact" className="flex min-h-24 flex-col justify-center gap-3 rounded-lg bg-surface p-4">
          <Breadcrumbs separator="slash" current="plain" size="sm" className="font-mono">
            <Breadcrumb href="#breadcrumb">kestrel</Breadcrumb>
            <Breadcrumb href="#breadcrumb">platform</Breadcrumb>
            <Breadcrumb href="#breadcrumb">checkout-api</Breadcrumb>
            <Breadcrumb>deployments</Breadcrumb>
          </Breadcrumbs>
          <Breadcrumbs separator="slash" current="plain" size="sm">
            <Breadcrumb href="#breadcrumb">Docs</Breadcrumb>
            <Breadcrumb href="#breadcrumb">Guides</Breadcrumb>
            <Breadcrumb>Progressive rollouts</Breadcrumb>
          </Breadcrumbs>
        </Variant>
        <Variant n={2} label="Segment switcher">
          <Breadcrumbs current="plain">
            <Breadcrumb href="#breadcrumb">
              <span className="flex items-center gap-2">
                <Avatar name="Kestrel Ops" size="xs" shape="square" color="primary-solid" />
                Kestrel Ops
              </span>
            </Breadcrumb>
            <AriaBreadcrumb className="flex items-center gap-1">
              <MenuTrigger>
                <AriaButton className="state-layer focus-ring relative inline-flex h-8 cursor-pointer items-center gap-1 rounded-full ps-3 pe-1 text-label-lg text-on-surface">
                  {project}
                  <Icon size={18}>unfold_more</Icon>
                </AriaButton>
                <MenuPopover placement="bottom start">
                  <Menu
                    aria-label="Project"
                    selectionMode="single"
                    selectedKeys={[project]}
                    onAction={(k) => setProject(String(k))}
                    className="w-56"
                  >
                    {PROJECTS.map((p) => (
                      <MenuItem key={p} id={p}>
                        {p}
                      </MenuItem>
                    ))}
                  </Menu>
                </MenuPopover>
              </MenuTrigger>
              <Icon size={18} className="rtl:rotate-180">chevron_right</Icon>
            </AriaBreadcrumb>
            <Breadcrumb>Settings</Breadcrumb>
          </Breadcrumbs>
        </Variant>
        <Variant n={3} label="In a page header" className="flex min-h-24 flex-col justify-center gap-2 rounded-lg bg-surface p-4">
          <Breadcrumbs current="plain" size="sm">
            <Breadcrumb href="#breadcrumb">Projects</Breadcrumb>
            <Breadcrumb href="#breadcrumb">Kestrel Grid</Breadcrumb>
            <Breadcrumb>Deployments</Breadcrumb>
          </Breadcrumbs>
          <div className="flex flex-wrap items-center gap-3">
            <h4 className="text-headline-sm">Deployments</h4>
            <span className="inline-flex h-6 items-center rounded-sm bg-tertiary-container px-2 text-label-md text-on-tertiary-container">Production</span>
            <span className="flex-1" />
            <Button variant="outlined" size="xs">
              Export
            </Button>
            <Button size="xs" onPress={() => snackbar("Deploy started")}>
              <Icon>add</Icon>
              Deploy
            </Button>
          </div>
        </Variant>
        <Variant n={4} label="Compact · back & truncate" className="flex min-h-24 flex-col justify-center gap-3 rounded-lg bg-surface p-4">
          <BreadcrumbBack href="#breadcrumb">Clusters</BreadcrumbBack>
          <Breadcrumbs current="plain" className="max-w-full flex-nowrap">
            <Breadcrumb href="#breadcrumb" className="max-w-32 shrink">
              Infrastructure and platform
            </Breadcrumb>
            <Breadcrumb href="#breadcrumb" className="max-w-40 shrink font-mono">
              kestrel-prod-eu-central-01
            </Breadcrumb>
            <Breadcrumb className="shrink-0">Node pools</Breadcrumb>
          </Breadcrumbs>
        </Variant>
      </Variants>
    </Section>
  )
}
