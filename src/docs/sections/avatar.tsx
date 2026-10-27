import * as React from "react"
import { Dialog, DialogTrigger, Popover, Button as AriaButton } from "react-aria-components"

import { Avatar, AvatarGroup } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Divider } from "@/components/ui/divider"
import { Icon } from "@/components/ui/icon"
import { IconButton } from "@/components/ui/icon-button"
import { Skeleton } from "@/components/ui/skeleton"
import { Section, Variant, Variants } from "@/docs/section"

const REVIEWERS = ["Elena Ruiz", "Tomás Weber", "Priya Nair", "Sam Okafor"]

export default function AvatarSection() {
  const [assignees, setAssignees] = React.useState(["Maya", "Jonah"])
  return (
    <Section id="avatar" description="Initials on container roles, image placeholder, status badge, and stacked groups with overflow count. Sizes 24 · 32 · 40 · 56 · 96.">
      <div className="flex flex-wrap items-center gap-8">
        <div className="flex items-end gap-3">
          <Avatar size="xs" name="Maya" fallback="M" color="primary" />
          <Avatar size="sm" name="Jonah Park" color="secondary" />
          <Avatar size="md" name="Ava Reyes" color="tertiary" />
          <Avatar size="lg" name="Kai Larsen" color="primary-solid" />
          <Avatar size="xl" icon="person" />
        </div>
        <div className="flex items-center gap-4 [--avatar-ring:var(--md-surface-container-low)]">
          <Avatar size="lg" name="Sam Okafor" color="secondary" status="online" className="size-12" />
          <Avatar size="lg" name="Dana Novak" color="primary" status="offline" className="size-12" />
          <span className="relative">
            <Avatar size="lg" shape="square" icon="smart_toy" color="tertiary" className="size-12" />
            <Badge count={2} className="absolute -top-1 -right-1" />
          </span>
        </div>
        <AvatarGroup
          max={4}
          className="[--avatar-ring:var(--md-surface-container-low)]"
          renderOverflow={(hidden) => (
            <DialogTrigger>
              <AriaButton
                aria-label={`${hidden} more reviewers`}
                className="state-layer focus-ring -ms-2 grid size-10 cursor-pointer place-items-center rounded-full bg-surface-container-highest text-label-lg text-on-surface ring-2 ring-surface-container-low"
              >
                +{hidden}
              </AriaButton>
              <Popover placement="bottom start" offset={8} className="w-60 rounded-md bg-surface-container p-2 shadow-2 outline-none data-entering:animate-[m3-fade-in_150ms]">
                <Dialog aria-label="Also on this review" className="outline-none">
                  <div className="px-2 pt-1 pb-1 text-label-md text-on-surface-variant">Also on this review</div>
                  {REVIEWERS.map((n) => (
                    <div key={n} className="flex h-11 items-center gap-3 rounded-full px-2 text-body-md text-on-surface">
                      <Avatar size="sm" name={n} />
                      {n}
                    </div>
                  ))}
                </Dialog>
              </Popover>
            </DialogTrigger>
          )}
        >
          {["Ana", "Ben", "Cleo", "Dev", "Eli", "Fay", "Gus", "Hal", "Ivy", "Jo"].map((n, i) => (
            <Avatar key={n} name={n} fallback={n[0]} color={(["primary-solid", "tertiary-solid", "secondary-solid", "primary"] as const)[i % 4]} />
          ))}
        </AvatarGroup>
      </div>

      <Variants cols="md:grid-cols-2 xl:grid-cols-3">
        <Variant n={1} label="Expressive shapes · hover">
          <Avatar size="lg" name="Maya Lindqvist" color="primary" shape="cookie7" hoverShape="clover4" />
          <Avatar size="lg" name="Jonah Park" color="secondary" shape="clover4" hoverShape="sunny" />
          <Avatar size="lg" name="Ava Reyes" color="tertiary" shape="sunny" hoverShape="cookie12" />
          <Avatar size="lg" icon="smart_toy" color="primary-solid" shape="squircle" hoverShape="puffy" />
        </Variant>

        <Variant n={2} label="Rings · live & speaking" className="flex min-h-24 flex-wrap items-center justify-center gap-6 rounded-lg bg-surface p-4">
          <div className="flex flex-col items-center gap-2">
            <span className="relative rounded-full ring-2 ring-error ring-offset-2 ring-offset-surface">
              <Avatar size="lg" name="Sam Okafor" color="secondary" />
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-xs bg-error px-1.5 text-label-sm text-on-error">LIVE</span>
            </span>
            <span className="mt-1 text-label-sm text-on-surface-variant">Streaming</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="relative grid">
              <span className="absolute inset-0 animate-ping rounded-full bg-tertiary/25 motion-reduce:animate-none" />
              <Avatar size="lg" name="Dana Novak" color="tertiary" className="rounded-full ring-2 ring-tertiary" />
            </span>
            <span className="mt-1 text-label-sm text-on-surface-variant">Speaking</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="relative">
              <Avatar size="lg" name="Kai Larsen" color="neutral" />
              <span className="absolute -right-1 -bottom-1 grid size-6 place-items-center rounded-full bg-surface-container-high text-on-surface-variant ring-2 ring-surface">
                <Icon size={16}>mic_off</Icon>
              </span>
            </span>
            <span className="mt-1 text-label-sm text-on-surface-variant">Muted</span>
          </div>
        </Variant>

        <Variant n={3} label="Identity · 3 densities" className="flex min-h-24 flex-col gap-4 rounded-lg bg-surface p-4">
          <div className="flex items-center gap-2">
            <Avatar size="xs" name="Maya Lindqvist" color="primary" />
            <span className="text-body-sm">Maya Lindqvist</span>
          </div>
          <div className="flex items-center gap-3">
            <Avatar size="sm" name="Jonah Park" color="secondary" />
            <div>
              <div className="text-body-md">Jonah Park</div>
              <div className="text-body-sm text-on-surface-variant">Reviewer</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Avatar name="Ava Reyes" color="tertiary" className="text-title-sm" />
            <div>
              <div className="text-title-sm">Ava Reyes</div>
              <div className="text-body-sm text-on-surface-variant">Staff engineer · Lisbon</div>
            </div>
          </div>
        </Variant>

        <Variant n={4} label="Assignee chips">
          {assignees.map((n) => (
            <span key={n} className="inline-flex h-8 items-center gap-2 rounded-sm border border-outline-variant px-1 text-label-lg text-on-surface-variant">
              <Avatar size="xs" name={n} color={n === "Maya" ? "primary" : "secondary"} fallback={n === "Maya" ? "ML" : "JP"} />
              {n}
              <IconButton size="xs" width="narrow" aria-label={`Remove ${n}`} className="size-6 [--icon-size:18px]" onPress={() => setAssignees((a) => a.filter((x) => x !== n))}>
                <Icon>close</Icon>
              </IconButton>
            </span>
          ))}
          <span className="inline-flex h-8 items-center gap-2 rounded-sm bg-secondary-container pr-3 pl-1 text-label-lg text-on-secondary-container">
            <Avatar size="xs" name="Ava Reyes" color="tertiary-solid" />
            Ava · owner
          </span>
          <Button variant="outlined" size="xs" shape="square" className="rounded-sm border-dashed border-outline" onPress={() => setAssignees(["Maya", "Jonah"])}>
            <Icon size={18}>person_add</Icon>
            Assign
          </Button>
        </Variant>

        <Variant n={5} label="Profile header" className="flex min-h-24 flex-col items-center justify-center gap-4 rounded-lg bg-surface p-4">
          <span className="relative">
            <Avatar size="xl" name="Maya Lindqvist" color="primary" />
            <IconButton variant="filled" size="sm" aria-label="Change photo" className="absolute right-0 bottom-0 size-9 ring-4 ring-surface [--icon-size:18px]">
              <Icon>photo_camera</Icon>
            </IconButton>
          </span>
          <div className="text-center">
            <div className="text-title-lg">Maya Lindqvist</div>
            <div className="text-body-md text-on-surface-variant">@maya · Staff Platform Engineer</div>
          </div>
          <div className="flex gap-2">
            <Button variant="tonal" className="px-6">
              Message
            </Button>
            <Button className="px-6">Follow</Button>
          </div>
        </Variant>

        <Variant n={6} label="Square · loading">
          <Avatar size="sm" shape="square" fallback="K" color="primary-solid" />
          <Avatar shape="square" name="Kai Larsen" color="tertiary" className="text-title-sm" />
          <Avatar size="lg" shape="square" icon="smart_toy" color="secondary" />
          <Divider orientation="vertical" className="mx-1 h-8 self-center" />
          <Skeleton className="size-10 rounded-full" />
          <Skeleton className="size-10 rounded-md" />
        </Variant>
      </Variants>
    </Section>
  )
}
