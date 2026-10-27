import { Button } from "@/components/ui/button"
import { Divider } from "@/components/ui/divider"
import { Icon } from "@/components/ui/icon"
import { IconButton } from "@/components/ui/icon-button"
import { ListSubheader } from "@/components/ui/list"
import { Section, Variant, Variants } from "@/docs/section"

export default function DividersSection() {
  return (
    <Section
      id="dividers"
      description="1dp outline-variant. Full-width, inset (aligned with list content) and middle-inset, plus vertical."
      spec="https://m3.material.io/components/divider/overview"
    >
      <div className="grid gap-6 md:grid-cols-[1fr_auto]">
        <div className="rounded-md bg-surface py-2 text-body-lg">
          <div className="px-4 py-3">Full width</div>
          <Divider />
          <div className="px-4 py-3">Inset</div>
          <Divider inset="start" />
          <div className="px-4 py-3">Middle inset</div>
          <Divider inset="middle" />
          <div className="px-4 py-3">Last item</div>
        </div>
        <div className="flex h-24 items-center gap-4 rounded-md bg-surface px-6 text-label-lg">
          <span>Vertical</span>
          <Divider orientation="vertical" />
          <span>Divider</span>
          <Divider orientation="vertical" className="h-8 self-center" />
          <span>Inset</span>
        </div>
      </div>

      <Variants cols="md:grid-cols-2 xl:grid-cols-3">
        <Variant n={1} label="With label">
          <div className="w-full space-y-3">
            <Button variant="outlined" className="w-full">
              <Icon>key</Icon>
              Continue with SSO
            </Button>
            <Divider>or</Divider>
            <Button className="w-full">Email me a link</Button>
          </div>
        </Variant>

        <Variant n={2} label="Section subheader" className="overflow-hidden rounded-lg bg-surface">
          <div className="px-4 py-3 text-body-lg">production</div>
          <Divider />
          <ListSubheader>Archived</ListSubheader>
          <div className="px-4 py-3 text-body-lg text-on-surface-variant">legacy-billing</div>
        </Variant>

        <Variant n={3} label="In a menu">
          <ul className="w-full max-w-[220px] rounded-xs bg-surface-container py-2 text-body-lg shadow-2">
            <li className="flex h-12 items-center px-3">Copy</li>
            <li className="flex h-12 items-center px-3">Paste</li>
            <li role="none">
              <Divider className="my-2" />
            </li>
            <li className="flex h-12 items-center px-3">Select all</li>
            <li role="none">
              <Divider className="my-2" />
            </li>
            <li className="flex h-12 items-center px-3 text-error">Delete</li>
          </ul>
        </Variant>

        <Variant n={4} label="Thick · section gap" className="overflow-hidden rounded-lg bg-surface">
          <div className="p-4 text-body-md">Today · 3 deploys</div>
          <Divider className="h-2 bg-surface-container" />
          <div className="p-4 text-body-md">Yesterday · 7 deploys</div>
        </Variant>

        <Variant n={5} label="Vertical · toolbar">
          <div className="flex items-center rounded-full bg-surface-container p-1">
            <IconButton aria-label="Bold">
              <Icon>format_bold</Icon>
            </IconButton>
            <IconButton aria-label="Italic">
              <Icon>format_italic</Icon>
            </IconButton>
            <Divider orientation="vertical" className="mx-1 h-6 self-center" />
            <IconButton aria-label="Bulleted list">
              <Icon>format_list_bulleted</Icon>
            </IconButton>
            <IconButton aria-label="Link">
              <Icon>link</Icon>
            </IconButton>
            <Divider orientation="vertical" className="mx-1 h-6 self-center" />
            <IconButton aria-label="More">
              <Icon>more_vert</Icon>
            </IconButton>
          </div>
        </Variant>

        <Variant n={6} label="Card sections" className="overflow-hidden rounded-lg bg-surface ring-1 ring-outline-variant">
          <div className="px-4 pt-4 pb-3">
            <div className="text-title-md">Weekly digest</div>
            <div className="text-body-sm text-on-surface-variant">Every Monday, 09:00</div>
          </div>
          <Divider />
          <div className="px-4 py-3 text-body-md text-on-surface-variant">Deploys, incidents and spend for each workspace.</div>
          <Divider inset="middle" />
          <div className="flex justify-end gap-2 p-2">
            <Button variant="text">Preview</Button>
            <Button variant="text">Edit</Button>
          </div>
        </Variant>
      </Variants>
    </Section>
  )
}
