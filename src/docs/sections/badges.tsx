import * as React from "react"

import { Avatar } from "@/components/ui/avatar"
import { BadgeAnchor, StatusBadge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { IconButton } from "@/components/ui/icon-button"
import { Row, Section, Variant, Variants } from "@/docs/section"

export default function BadgesSection() {
  const [mailDot, setMailDot] = React.useState(true)
  const [counts, setCounts] = React.useState({ notifications: 3, chat: 1200, inbox: 12 })
  const bump = (k: keyof typeof counts) => setCounts((c) => ({ ...c, [k]: c[k] + 1 }))
  return (
    <Section
      id="badges"
      description="Small (6dp dot) and large (16dp, label-small) on the error role. Pin to the top-right of an icon."
      spec="https://m3.material.io/components/badges/overview"
    >
      <Row label="Press icons to add · Mark all read clears">
        <IconButton size="md" width="narrow" aria-label="Toggle unread dot" onPress={() => setMailDot((d) => !d)}>
          <BadgeAnchor dot={mailDot} badgeLabel="Unread">
            <Icon>mail</Icon>
          </BadgeAnchor>
        </IconButton>
        <IconButton size="md" width="narrow" aria-label={`Notifications, ${counts.notifications} new`} onPress={() => bump("notifications")}>
          <BadgeAnchor count={counts.notifications}>
            <Icon>notifications</Icon>
          </BadgeAnchor>
        </IconButton>
        <IconButton size="md" width="narrow" aria-label={`Chat, ${counts.chat} new`} onPress={() => bump("chat")}>
          <BadgeAnchor count={counts.chat}>
            <Icon>chat</Icon>
          </BadgeAnchor>
        </IconButton>
        <IconButton aria-label={`Inbox, ${counts.inbox} new`} className="h-8 w-14 bg-secondary-container text-on-secondary-container" onPress={() => bump("inbox")}>
          <BadgeAnchor count={counts.inbox} className="static" badgeClassName="start-auto -end-1">
            <Icon filled>inbox</Icon>
          </BadgeAnchor>
        </IconButton>
        <Button variant="outlined" onPress={() => setCounts({ notifications: 0, chat: 0, inbox: 0 })}>
          <Icon>done_all</Icon>
          Mark all read
        </Button>
      </Row>

      <Variants cols="md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
        <Variant n={1} label="Dot">
          <Avatar size="lg" name="Maya Lindqvist" color="primary" status="online" className="size-12" />
          <BadgeAnchor dot className="text-on-surface-variant">
            <Icon>chat</Icon>
          </BadgeAnchor>
        </Variant>
        <Variant n={2} label="Count on nav">
          <span className="flex flex-col items-center gap-1 text-label-md">
            <span className="grid h-8 w-14 place-items-center rounded-full bg-secondary-container text-on-secondary-container">
              <BadgeAnchor count={12}>
                <Icon filled>inbox</Icon>
              </BadgeAnchor>
            </span>
            Inbox
          </span>
        </Variant>
        <Variant n={3} label="Status labels">
          <StatusBadge variant="primary">New</StatusBadge>
          <StatusBadge variant="tertiary">Beta</StatusBadge>
          <StatusBadge variant="outlined">Deprecated</StatusBadge>
        </Variant>
        <Variant n={4} label="Inline count">
          <span className="flex w-full items-center gap-3 text-body-lg">
            <Icon className="text-on-surface-variant">rocket_launch</Icon>
            <span className="flex-1">Deployments</span>
            <StatusBadge variant="outlined" shape="pill" size="md">
              128
            </StatusBadge>
          </span>
        </Variant>
        <Variant n={5} label="Icon badge">
          <span className="relative">
            <Avatar size="lg" name="Ava Reyes" color="tertiary" className="size-12" />
            <span className="absolute -right-1 -bottom-1 grid size-5 place-items-center rounded-full bg-primary text-on-primary ring-2 ring-surface">
              <Icon size={16} weight={600}>
                check
              </Icon>
            </span>
          </span>
        </Variant>
      </Variants>
    </Section>
  )
}
