"use client"

import * as React from "react"
import { Checkbox as AriaCheckbox, CheckboxGroup } from "react-aria-components"

import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { IconButton } from "@/components/ui/icon-button"
import { ChoiceCard, ChoiceGroup } from "@/components/ui/questionnaire"
import { SideSheet } from "@/components/ui/sheet"
import { snackbar } from "@/components/ui/snackbar"
import { TextField } from "@/components/ui/text-field"
import { cn } from "@/lib/utils"

/*
 * Invite user 03 · Side sheet with access
 * A modal side sheet with role cards and per-title access. The footer summarises what the invite grants.
 *
 * `preview` renders the sheet inline (non-modal) inside the block, for docs and screenshots.
 */

const ROLES = [
  { id: "Admin", desc: "Everything except billing and ownership" },
  { id: "Live ops", desc: "Events, store and player tools" },
  { id: "Analyst", desc: "Dashboards and exports, read-only" },
  { id: "Support", desc: "Player lookup, bans and refunds" },
  { id: "Viewer", desc: "Read-only, no personal data" },
]

const TITLES = [
  { id: "Ember Tactics", mono: "ET", sub: "PC · PS5 · Xbox Series", box: "bg-tertiary-container text-on-tertiary-container" },
  { id: "Tidebreak", mono: "TB", sub: "iOS · Android", box: "bg-primary-container text-on-primary-container" },
  { id: "Arena (beta)", mono: "AR", sub: "Closed playtest", box: "bg-secondary-container text-on-secondary-container" },
]

const isEmail = (v: string) => /^[^@\s,;]+@[^@\s,;]+\.[^@\s,;]{2,}$/.test(v)

function InviteSheet({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = React.useState("dana@cinder.gg")
  const [role, setRole] = React.useState("Admin")
  const [titles, setTitles] = React.useState<string[]>(["Ember Tactics", "Tidebreak"])
  const invalid = !!email && !isEmail(email)

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 px-6 pt-5 pb-2">
        <h5 className="flex-1 text-headline-sm">Invite a teammate</h5>
        <IconButton aria-label="Close" className="-mr-2" onPress={onClose}>
          <Icon>close</Icon>
        </IconButton>
      </div>
      <div className="relative min-h-0 flex-1 space-y-6 overflow-y-auto px-6 pt-3 pb-6">
        <TextField
          label="Work email"
          type="email"
          value={email}
          onChange={setEmail}
          isInvalid={invalid}
          errorMessage="Enter a full email address"
        />
        <div>
          <div className="text-title-sm">Role</div>
          <ChoiceGroup aria-label="Role" value={role} onChange={setRole} className="mt-2">
            {ROLES.map((r) => (
              <ChoiceCard key={r.id} value={r.id} description={r.desc}>
                {r.id}
              </ChoiceCard>
            ))}
          </ChoiceGroup>
        </div>
        <CheckboxGroup value={titles} onChange={setTitles} aria-label="Title access">
          <div className="text-title-sm">Title access</div>
          <div className="mt-1 space-y-1">
            {TITLES.map((t) => (
              <AriaCheckbox key={t.id} value={t.id} className="group flex cursor-pointer items-center gap-3 py-1">
                <span
                  className={cn(
                    "relative grid size-10 shrink-0 place-items-center rounded-full",
                    "before:absolute before:inset-0 before:rounded-full before:bg-on-surface before:opacity-0 group-data-hovered:before:opacity-8 group-data-focus-visible:before:opacity-10",
                  )}
                >
                  <span className="grid size-[18px] place-items-center rounded-[2px] border-2 border-on-surface-variant text-on-primary transition-colors group-data-selected:border-primary group-data-selected:bg-primary group-data-focus-visible:outline-3 group-data-focus-visible:outline-offset-[9px] group-data-focus-visible:outline-secondary">
                    <Icon size={16} weight={600} className="opacity-0 transition-opacity group-data-selected:opacity-100">
                      check
                    </Icon>
                  </span>
                </span>
                <span className={cn("grid size-9 shrink-0 place-items-center rounded-md text-label-md", t.box)}>{t.mono}</span>
                <span className="min-w-0">
                  <span className="block text-body-lg">{t.id}</span>
                  <span className="block text-body-sm text-on-surface-variant">{t.sub}</span>
                </span>
              </AriaCheckbox>
            ))}
          </div>
        </CheckboxGroup>
        <div className="flex items-center gap-3 rounded-lg bg-surface-container-low p-3 text-body-md text-on-surface-variant">
          <Icon>event_seat</Icon>
          Uses 1 of 6 open seats
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2 border-t border-outline-variant px-6 py-4">
        <span className="min-w-0 flex-1 truncate text-body-sm text-on-surface-variant">
          {role} access to {titles.length === 1 ? "1 title" : `${titles.length} titles`}
        </span>
        <Button variant="text" className="px-4" onPress={onClose}>
          Cancel
        </Button>
        <Button
          className="px-5"
          isDisabled={!isEmail(email) || titles.length === 0}
          onPress={() => {
            snackbar(`Invite sent to ${email} · ${role}`)
            onClose()
          }}
        >
          Send invite
        </Button>
      </div>
    </div>
  )
}

export function InviteUser3({ preview = false, className }: { preview?: boolean; className?: string }) {
  const [inline, setInline] = React.useState(preview)
  const [modal, setModal] = React.useState(false)

  return (
    <div className={cn("relative min-h-[700px] overflow-hidden bg-surface-container-low", className)}>
      <div className="p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-body-sm text-on-surface-variant">Settings</div>
            <h4 className="text-headline-sm font-medium">Members</h4>
          </div>
          <Button className="pr-4 pl-3" onPress={() => (preview ? setInline(true) : setModal(true))}>
            <Icon>person_add</Icon>
            Invite
          </Button>
        </div>
        <div className="mt-5 space-y-2">
          {Array.from({ length: 5 }, (_, i) => (
            <div key={i} className="h-14 rounded-lg bg-surface" />
          ))}
        </div>
      </div>

      {preview ? (
        inline && (
          <>
            <div aria-hidden className="absolute inset-0 z-10 bg-scrim/30" onClick={() => setInline(false)} />
            <aside
              role="dialog"
              aria-label="Invite a teammate"
              className="absolute inset-y-0 right-0 z-20 w-full max-w-md animate-fade-up bg-surface shadow-3 sm:rounded-l-xl"
            >
              <InviteSheet onClose={() => setInline(false)} />
            </aside>
          </>
        )
      ) : (
        <SideSheet aria-label="Invite a teammate" isOpen={modal} onOpenChange={setModal} className="max-w-md p-0">
          <InviteSheet onClose={() => setModal(false)} />
        </SideSheet>
      )}
    </div>
  )
}
