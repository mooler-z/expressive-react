"use client"

import * as React from "react"
import { Form, Link } from "react-aria-components"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Icon } from "@/components/ui/icon"
import { Select, SelectItem } from "@/components/ui/select"
import { snackbar } from "@/components/ui/snackbar"
import { TextField } from "@/components/ui/text-field"
import { cn } from "@/lib/utils"

import { copyWithSnackbar } from "./marketing-shared"

/** Email / support / office cards. */
export function ContactChannels() {
  return (
    <div className="space-y-3">
      <Link
        onPress={() => copyWithSnackbar("hello@kestrel.io")}
        className="state-layer focus-ring flex cursor-pointer items-center gap-4 rounded-xl bg-surface-container-low p-4 text-on-surface outline-none"
      >
        <span className="grid size-12 place-items-center rounded-full bg-primary-container text-on-primary-container">
          <Icon>mail</Icon>
        </span>
        <div>
          <div className="text-title-md">hello@kestrel.io</div>
          <div className="text-body-md text-on-surface-variant">Sales, partnerships, press</div>
        </div>
      </Link>
      <Link
        onPress={() => snackbar("Opening status.kestrel.io")}
        className="state-layer focus-ring flex cursor-pointer items-center gap-4 rounded-xl bg-surface-container-low p-4 text-on-surface outline-none"
      >
        <span className="grid size-12 place-items-center rounded-full bg-tertiary-container text-on-tertiary-container">
          <Icon>support_agent</Icon>
        </span>
        <div>
          <div className="text-title-md">Support & status</div>
          <div className="text-body-md text-on-surface-variant">24/7 for Enterprise · status.kestrel.io</div>
        </div>
      </Link>
      <div className="flex items-center gap-4 rounded-xl bg-surface-container-low p-4">
        <span className="grid size-12 place-items-center rounded-full bg-secondary-container text-on-secondary-container">
          <Icon>location_on</Icon>
        </span>
        <div>
          <div className="text-title-md">Stockholm · Berlin · Austin</div>
          <div className="text-body-md text-on-surface-variant">Remote-first across 14 countries</div>
        </div>
      </div>
    </div>
  )
}

/** Stylised office map with a labelled pin. */
export function ContactMap({ className }: { className?: string }) {
  return (
    <div className={cn("relative h-40 overflow-hidden rounded-xl bg-surface-container-high", className)} aria-hidden>
      <div className="absolute inset-x-0 top-1/2 h-3 -rotate-3 bg-surface-container-highest" />
      <div className="absolute inset-y-0 left-1/3 w-3 rotate-6 bg-surface-container-highest" />
      <div className="absolute top-[45%] left-[55%] flex -translate-x-1/2 -translate-y-full flex-col items-center">
        <span className="rounded-full bg-inverse-surface px-3 py-1 text-label-md whitespace-nowrap text-inverse-on-surface shadow-2">
          Kestrel HQ · Södermalm
        </span>
        <Icon size={40} filled className="-mt-1 text-primary drop-shadow">
          location_on
        </Icon>
      </div>
    </div>
  )
}

const SIZES = ["Under 50 engineers", "50 – 200 engineers", "200 – 1,000 engineers", "1,000+ engineers"]

/** Lead form: name, email, team size, message and changelog opt-in. */
export function ContactForm({ className }: { className?: string }) {
  const [state, setState] = React.useState<"idle" | "sending" | "sent">("idle")
  return (
    <Form
      className={cn("grid gap-5 rounded-2xl bg-surface-container-low p-6 md:grid-cols-2 md:p-8", className)}
      onSubmit={(e) => {
        e.preventDefault()
        setState("sending")
        setTimeout(() => {
          setState("sent")
          snackbar("Thanks — an engineer will reply within a day")
          setTimeout(() => setState("idle"), 2400)
        }, 1200)
      }}
    >
      <TextField label="First name" name="first" />
      <TextField label="Last name" name="last" />
      <TextField label="Work email" name="email" type="email" className="md:col-span-2" />
      <Select label="Team size" name="size" defaultSelectedKey={SIZES[1]} className="md:col-span-2">
        {SIZES.map((s) => (
          <SelectItem key={s} id={s}>
            {s}
          </SelectItem>
        ))}
      </Select>
      <TextField label="What are you running today?" name="message" multiline rows={4} className="md:col-span-2" />
      <Checkbox defaultSelected className="-ml-3 text-body-md text-on-surface-variant md:col-span-2">
        Send me the monthly changelog digest
      </Checkbox>
      <div className="flex flex-wrap items-center justify-between gap-3 md:col-span-2">
        <span className="text-body-sm text-on-surface-variant">We reply within one business day.</span>
        <Button type="submit" isPending={state === "sending"} className="h-12 px-6">
          {state === "idle" && <Icon>send</Icon>}
          {state === "sent" && <Icon>check</Icon>}
          {state === "sending" ? "Sending…" : state === "sent" ? "Sent" : "Send message"}
        </Button>
      </div>
    </Form>
  )
}

/** Contact page: intro + channels + map beside the form. */
export function ContactPage() {
  return (
    <section className="mx-auto grid max-w-7xl gap-10 px-4 pt-8 pb-24 md:px-8 lg:grid-cols-[1fr_1.2fr] lg:pt-12">
      <div>
        <h1 className="text-display-sm font-semibold tracking-tight text-balance md:text-display-md">
          Talk to an engineer, not a form.
        </h1>
        <p className="mt-5 text-body-lg text-on-surface-variant">
          Fine, there is a form. But a platform engineer replies within one business day, and demos are hands-on with
          your own clusters.
        </p>
        <div className="mt-8">
          <ContactChannels />
        </div>
        <ContactMap className="mt-6" />
      </div>
      <ContactForm className="self-start" />
    </section>
  )
}

/** Contact in the supporting-pane layout: form first, channels + map in a side pane. */
export function ContactSupportingPane() {
  return (
    <>
      <section className="mx-auto max-w-7xl px-4 pt-10 pb-6 md:px-8 lg:pt-14">
        <h1 className="max-w-3xl text-display-sm font-semibold tracking-tight text-balance lg:text-display-md">
          Talk to an engineer, not a form.
        </h1>
        <p className="mt-4 max-w-2xl text-body-lg text-on-surface-variant">
          Fine, there is a form. But a platform engineer replies within one business day, and demos are hands-on with
          your own clusters.
        </p>
      </section>
      <section className="mx-auto grid max-w-7xl items-start gap-6 px-4 pb-16 md:px-8 xl:grid-cols-[minmax(0,1fr)_360px]">
        <ContactForm className="rounded-xl" />
        <aside className="space-y-3">
          <ContactChannels />
          <ContactMap className="h-48" />
        </aside>
      </section>
    </>
  )
}
