"use client"

import * as React from "react"
import { Button as AriaButton, Form } from "react-aria-components"

import { PageIntro } from "@/components/blocks/landing/landing-shared"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Icon } from "@/components/ui/icon"
import { Ripple } from "@/components/ui/ripple"
import { Select, SelectItem } from "@/components/ui/select"
import { snackbar } from "@/components/ui/snackbar"
import { TextField } from "@/components/ui/text-field"
import { cn } from "@/lib/utils"

/* Contact · supporting-pane canonical layout: form, contact cards and a map beside it on wide windows. */

const TEAM_SIZES = [
  { id: "lt50", label: "Under 50 engineers" },
  { id: "50-200", label: "50 – 200 engineers" },
  { id: "200-1000", label: "200 – 1,000 engineers" },
  { id: "1000+", label: "1,000+ engineers" },
]

function ContactCard({
  icon,
  tone,
  title,
  body,
  onPress,
}: {
  icon: string
  tone: string
  title: string
  body: string
  onPress?: () => void
}) {
  const inner = (
    <>
      <span className={cn("grid size-12 shrink-0 place-items-center rounded-full", tone)}>
        <Icon>{icon}</Icon>
      </span>
      <div className="text-left">
        <div className="text-title-md">{title}</div>
        <div className="text-body-md text-on-surface-variant">{body}</div>
      </div>
    </>
  )
  const cls = "flex w-full items-center gap-4 rounded-xl bg-surface-container-low p-4 text-on-surface"
  return onPress ? (
    <AriaButton onPress={onPress} className={cn("state-layer focus-ring relative cursor-pointer outline-none", cls)}>
      {inner}
      <Ripple />
    </AriaButton>
  ) : (
    <div className={cls}>{inner}</div>
  )
}

export function LandingContact() {
  const [sending, setSending] = React.useState(false)

  return (
    <>
      <PageIntro title="Talk to an engineer, not a form.">
        Fine, there is a form. But a platform engineer replies within one business day, and demos are hands-on with your own
        clusters.
      </PageIntro>
      <section className="grid items-start gap-6 px-4 pb-16 md:px-6 lg:px-10 xl:grid-cols-[minmax(0,1fr)_360px]">
        <Form
          className="grid gap-5 rounded-xl bg-surface-container-low p-6 md:grid-cols-2 md:p-8"
          onSubmit={(e) => {
            e.preventDefault()
            setSending(true)
            setTimeout(() => {
              setSending(false)
              snackbar("Thanks — an engineer will reply within a day")
            }, 1400)
          }}
        >
          <TextField label="First name" name="first" autoComplete="given-name" />
          <TextField label="Last name" name="last" autoComplete="family-name" />
          <TextField label="Work email" name="email" type="email" autoComplete="email" className="md:col-span-2" />
          <Select label="Team size" name="size" defaultSelectedKey="50-200" items={TEAM_SIZES} className="md:col-span-2">
            {(s) => <SelectItem id={s.id}>{s.label}</SelectItem>}
          </Select>
          <TextField label="What are you running today?" name="message" multiline rows={4} className="md:col-span-2" />
          <Checkbox defaultSelected name="digest" className="text-body-md text-on-surface-variant md:col-span-2">
            Send me the monthly changelog digest
          </Checkbox>
          <div className="flex flex-wrap items-center justify-between gap-3 md:col-span-2">
            <span className="text-body-sm text-on-surface-variant">We reply within one business day.</span>
            <Button type="submit" isPending={sending} className="h-12 px-6">
              {!sending && <Icon size={20}>send</Icon>}
              {sending ? "Sending…" : "Send message"}
            </Button>
          </div>
        </Form>

        <aside className="space-y-3">
          <ContactCard
            icon="mail"
            tone="bg-primary-container text-on-primary-container"
            title="hello@kestrel.io"
            body="Sales, partnerships, press"
            onPress={() => {
              navigator.clipboard?.writeText("hello@kestrel.io").catch(() => {})
              snackbar("hello@kestrel.io copied")
            }}
          />
          <ContactCard
            icon="support_agent"
            tone="bg-tertiary-container text-on-tertiary-container"
            title="Support & status"
            body="24/7 for Enterprise · status.kestrel.io"
            onPress={() => snackbar("Opening status.kestrel.io")}
          />
          <ContactCard
            icon="location_on"
            tone="bg-secondary-container text-on-secondary-container"
            title="Stockholm · Berlin · Austin"
            body="Remote-first across 14 countries"
          />
          <div className="relative h-48 overflow-hidden rounded-xl bg-surface-container-high" role="img" aria-label="Map: Kestrel HQ in Södermalm, Stockholm">
            <div className="absolute inset-x-0 top-1/2 h-3 -rotate-3 bg-surface-container-highest" />
            <div className="absolute inset-y-0 left-1/3 w-3 rotate-6 bg-surface-container-highest" />
            <div className="absolute top-[45%] left-[55%] flex -translate-x-1/2 -translate-y-full flex-col items-center">
              <span className="rounded-full bg-inverse-surface px-3 py-1 text-label-md text-inverse-on-surface shadow-2">Kestrel HQ · Södermalm</span>
              <Icon size={40} filled className="-mt-1 text-primary drop-shadow">
                location_on
              </Icon>
            </div>
          </div>
        </aside>
      </section>
    </>
  )
}
