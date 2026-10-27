import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { Menu, MenuItem, MenuPopover, MenuSection, MenuTrigger, SubmenuTrigger } from "@/components/ui/menu"
import { Select, SelectItem } from "@/components/ui/select"
import { snackbar } from "@/components/ui/snackbar"
import { Section, Variant, Variants } from "@/docs/section"

const REGIONS = [
  ["iad", "US East (N. Virginia)"],
  ["pdx", "US West (Oregon)"],
  ["fra", "Europe (Frankfurt)"],
  ["nrt", "Asia Pacific (Tokyo)"],
] as const

export default function MenusSection() {
  return (
    <Section
      id="menus"
      description="Expressive menus: surface-container-low at level 2, 16dp corners, 44dp items with leading icons, shortcuts or submenu arrows. Sections become separate segments. The exposed dropdown pairs a menu with a text field."
      spec="https://m3.material.io/components/menus/overview"
    >
      <div className="flex flex-wrap items-start gap-8">
        <div className="space-y-2">
          <MenuTrigger>
            <Button variant="tonal" className="pr-3">
              Edit
              <Icon size={20}>arrow_drop_down</Icon>
            </Button>
            <MenuPopover>
              <Menu aria-label="Edit" onAction={(k) => snackbar(`${k} · demo action`)} className="w-64">
                <MenuSection>
                  <MenuItem id="Cut" icon="content_cut" shortcut="⌘X">Cut</MenuItem>
                  <MenuItem id="Copy" icon="content_copy" shortcut="⌘C">Copy</MenuItem>
                  <MenuItem id="Paste" icon="content_paste" shortcut="⌘V">Paste</MenuItem>
                </MenuSection>
                <MenuSection>
                  <SubmenuTrigger>
                    <MenuItem id="share" icon="share">Share</MenuItem>
                    <MenuPopover>
                      <Menu aria-label="Share" onAction={(k) => snackbar(`${k} · demo action`)}>
                        <MenuItem id="Email" icon="mail">Email</MenuItem>
                        <MenuItem id="Slack" icon="chat">Slack</MenuItem>
                        <MenuItem id="Copy link" icon="link">Copy link</MenuItem>
                      </Menu>
                    </MenuPopover>
                  </SubmenuTrigger>
                  <MenuItem id="Delete" icon="delete" isDisabled>Delete</MenuItem>
                </MenuSection>
              </Menu>
            </MenuPopover>
          </MenuTrigger>
        </div>

        <div className="w-64 space-y-2">
          <div className="text-label-md tracking-wider text-on-surface-variant uppercase">Exposed dropdown · outlined</div>
          <Select label="Region" defaultSelectedKey="fra">
            {REGIONS.map(([id, name]) => (
              <SelectItem key={id} id={id}>{name}</SelectItem>
            ))}
          </Select>
        </div>
        <div className="w-64 space-y-2">
          <div className="text-label-md tracking-wider text-on-surface-variant uppercase">Filled · with icon</div>
          <Select label="Region" variant="filled" icon="public" description="Where new projects deploy">
            {REGIONS.map(([id, name]) => (
              <SelectItem key={id} id={id}>{name}</SelectItem>
            ))}
          </Select>
        </div>
        <div className="w-64 space-y-2">
          <div className="text-label-md tracking-wider text-on-surface-variant uppercase">Error · disabled</div>
          <Select label="Plan" isInvalid errorMessage="Pick a plan to continue">
            <SelectItem id="free">Free</SelectItem>
            <SelectItem id="pro">Pro</SelectItem>
          </Select>
          <Select label="Owner" isDisabled defaultSelectedKey="maya" className="pt-4">
            <SelectItem id="maya">Maya Lindqvist</SelectItem>
          </Select>
        </div>
      </div>

      <Variants cols="md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
        <Variant n={1} label="Single select" className="rounded-lg bg-surface p-4">
          <Menu aria-label="Sort by" selectionMode="single" defaultSelectedKeys={["newest"]} className="drop-elevation-2 w-full">
            <MenuSection title="Sort by">
              <MenuItem id="newest">Newest</MenuItem>
              <MenuItem id="oldest">Oldest</MenuItem>
              <MenuItem id="name">Name</MenuItem>
              <MenuItem id="owner">Owner</MenuItem>
            </MenuSection>
          </Menu>
        </Variant>
        <Variant n={2} label="Sectioned" className="rounded-lg bg-surface p-4">
          <Menu aria-label="Deploy actions" className="drop-elevation-2 w-full">
            <MenuSection title="Deploy">
              <MenuItem icon="play_arrow">Run now</MenuItem>
              <MenuItem icon="schedule">Schedule…</MenuItem>
            </MenuSection>
            <MenuSection title="Danger">
              <MenuItem icon="undo" className="text-error [&_[data-slot=icon]]:text-error">
                Roll back
              </MenuItem>
            </MenuSection>
          </Menu>
        </Variant>
        <Variant n={3} label="People" className="rounded-lg bg-surface p-4">
          <Menu aria-label="Assign to" className="drop-elevation-2 w-full">
            <MenuSection title="Assign to">
              {(
                [
                  ["ML", "Maya Lindqvist", "bg-primary-container text-on-primary-container"],
                  ["JP", "Jonah Park", "bg-tertiary-container text-on-tertiary-container"],
                  ["AR", "Ava Reyes", "bg-secondary-container text-on-secondary-container"],
                ] as const
              ).map(([initials, name, tone]) => (
                <MenuItem
                  key={name}
                  textValue={name}
                  leading={<span className={`grid size-8 place-items-center rounded-full text-label-md ${tone}`}>{initials}</span>}
                >
                  {name}
                </MenuItem>
              ))}
            </MenuSection>
          </Menu>
        </Variant>
        <Variant n={4} label="Vibrant" className="rounded-lg bg-surface p-4">
          <Menu
            aria-label="Role"
            variant="vibrant"
            selectionMode="single"
            defaultSelectedKeys={["editor"]}
            disallowEmptySelection
            className="drop-elevation-2 w-full"
          >
            <MenuItem id="viewer" icon="visibility">Viewer</MenuItem>
            <MenuItem id="editor" icon="edit">Editor</MenuItem>
            <MenuItem id="admin" icon="admin_panel_settings">Admin</MenuItem>
          </Menu>
        </Variant>
        <Variant n={5} label="Icon grid" className="rounded-lg bg-surface p-4">
          <div className="drop-elevation-2 grid w-full grid-cols-3 gap-1 rounded-lg bg-surface-container-low p-2">
            {(
              [
                ["link", "Copy link"],
                ["mail", "Email"],
                ["chat", "Slack"],
                ["qr_code_2", "QR code"],
                ["download", "Export"],
                ["more_horiz", "More"],
              ] as const
            ).map(([icon, label]) => (
              <button key={label} className="state-layer focus-ring flex flex-col items-center gap-1 rounded-md py-3 text-label-sm text-on-surface-variant">
                <Icon className="text-primary">{icon}</Icon>
                {label}
              </button>
            ))}
          </div>
        </Variant>
      </Variants>
    </Section>
  )
}
