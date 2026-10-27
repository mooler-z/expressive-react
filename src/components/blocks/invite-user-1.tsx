"use client"

import * as React from "react"
import { Button as AriaButton } from "react-aria-components"

import { Button } from "@/components/ui/button"
import { Dialog } from "@/components/ui/dialog"
import { Icon } from "@/components/ui/icon"
import { IconButton } from "@/components/ui/icon-button"
import { Select, SelectItem } from "@/components/ui/select"
import { snackbar } from "@/components/ui/snackbar"
import { cn } from "@/lib/utils"

/*
 * Invite user 01 · Dialog with email chips
 * Addresses turn into chips on Enter, comma or space, and pasted lists split automatically.
 * Invalid ones turn red and block sending.
 *
 * `preview` renders the dialog inline (non-modal) inside the block, for docs and screenshots.
 */

const ROLES = ["Admin", "Live ops", "Analyst", "Support", "Viewer"]
const ROLE_DESC: Record<string, string> = {
  Admin: "Everything except billing and ownership",
  "Live ops": "Events, store and player tools",
  Analyst: "Dashboards and exports, read-only",
  Support: "Player lookup, bans and refunds",
  Viewer: "Read-only, no personal data",
}

const isEmail = (v: string) => /^[^@\s,;]+@[^@\s,;]+\.[^@\s,;]{2,}$/.test(v)

type Chip = { value: string; ok: boolean }

function InvitePeopleForm({ onClose }: { onClose: () => void }) {
  const [chips, setChips] = React.useState<Chip[]>([
    { value: "noor@cinder.gg", ok: true },
    { value: "hana@cinder.gg", ok: true },
  ])
  const [draft, setDraft] = React.useState("")
  const [role, setRole] = React.useState("Live ops")
  const [sending, setSending] = React.useState(false)
  const ok = chips.filter((c) => c.ok).length
  const bad = chips.length - ok

  const add = (list: string[]) =>
    setChips((current) => {
      const have = current.map((c) => c.value.toLowerCase())
      const next = list
        .map((v) => v.trim())
        .filter((v) => v && !have.includes(v.toLowerCase()))
        .map((value) => ({ value, ok: isEmail(value) }))
      return [...current, ...next]
    })

  const send = () => {
    setSending(true)
    setTimeout(() => {
      setSending(false)
      setChips([])
      setDraft("")
      snackbar(`${ok} ${ok === 1 ? "invite" : "invites"} sent · ${role}`)
    }, 1200)
  }

  return (
    <>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h5 className="text-headline-sm">Invite people</h5>
          <p className="mt-1 text-body-md text-on-surface-variant">They'll get an email to join Cinder Studio.</p>
        </div>
        <IconButton aria-label="Close" className="-mt-2 -mr-2" onPress={onClose}>
          <Icon>close</Icon>
        </IconButton>
      </div>

      <div className="mt-5">
        <div id="invite-emails-label" className="text-label-lg text-on-surface-variant">
          Email addresses
        </div>
        <div
          className={cn(
            "mt-2 flex min-h-14 flex-wrap items-center gap-1.5 rounded-xs border border-outline p-2",
            "focus-within:border-primary focus-within:ring-1 focus-within:ring-primary focus-within:ring-inset",
            bad > 0 && "border-error focus-within:border-error focus-within:ring-error",
          )}
        >
          {chips.map((c, i) => (
            <span
              key={c.value}
              className={cn(
                "inline-flex h-8 max-w-full items-center gap-1.5 rounded-sm pr-1 pl-2 text-label-lg",
                c.ok ? "bg-secondary-container text-on-secondary-container" : "bg-error-container text-on-error-container",
              )}
            >
              <Icon size={18}>{c.ok ? "person" : "error"}</Icon>
              <span className="truncate">{c.value}</span>
              <AriaButton
                aria-label={`Remove ${c.value}`}
                onPress={() => setChips((list) => list.filter((_, j) => j !== i))}
                className="state-layer focus-ring grid size-6 cursor-pointer place-items-center rounded-full"
              >
                <Icon size={16}>close</Icon>
              </AriaButton>
            </span>
          ))}
          <input
            value={draft}
            aria-labelledby="invite-emails-label"
            placeholder="name@studio.com"
            onChange={(e) => {
              const parts = e.target.value.split(/[\s,;]+/)
              if (parts.length > 1) {
                add(parts.slice(0, -1))
                setDraft(parts[parts.length - 1])
              } else setDraft(e.target.value)
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                if (draft.trim()) {
                  add([draft])
                  setDraft("")
                }
              } else if (e.key === "Backspace" && !draft && chips.length) setChips((list) => list.slice(0, -1))
            }}
            className="h-8 min-w-[10rem] flex-1 bg-transparent px-1 text-body-lg text-on-surface outline-none placeholder:text-on-surface-variant"
          />
        </div>
        <p className="mt-1 px-1 text-body-sm text-on-surface-variant">Press Enter, comma or space after each address. Paste a list to add several.</p>
        {bad > 0 && (
          <p role="alert" className="mt-1 px-1 text-body-sm text-error">
            {bad === 1 ? "1 address needs fixing" : `${bad} addresses need fixing`}
          </p>
        )}
      </div>

      <Select label="Role" selectedKey={role} onSelectionChange={(k) => setRole(String(k))} description={ROLE_DESC[role]} className="mt-5">
        {ROLES.map((r) => (
          <SelectItem key={r} id={r}>
            {r}
          </SelectItem>
        ))}
      </Select>

      <div className="mt-6 flex flex-wrap items-center justify-end gap-2">
        <Button variant="text" className="px-4" onPress={onClose}>
          Cancel
        </Button>
        <Button className="px-5" isPending={sending} isDisabled={ok === 0 || bad > 0} onPress={send}>
          {sending ? "Sending…" : ok === 1 ? "Send 1 invite" : `Send ${ok} invites`}
        </Button>
      </div>
    </>
  )
}

export function InviteUser1({ preview = false, className }: { preview?: boolean; className?: string }) {
  const [inline, setInline] = React.useState(preview)
  const [modal, setModal] = React.useState(false)

  return (
    <div className={cn("relative min-h-[600px] bg-surface-container-low p-6", className)}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-body-sm text-on-surface-variant">Settings</div>
          <h4 className="text-headline-sm font-medium">Members</h4>
        </div>
        <Button className="pr-4 pl-3" onPress={() => (preview ? setInline(true) : setModal(true))}>
          <Icon>person_add</Icon>
          Invite people
        </Button>
      </div>
      <div className="mt-5 space-y-2">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="h-14 rounded-lg bg-surface" />
        ))}
      </div>

      {preview ? (
        inline && (
          <div className="absolute inset-0 z-10 grid place-items-center bg-scrim/40 p-4">
            <div role="dialog" aria-label="Invite people" className="w-full max-w-lg animate-pop rounded-xl bg-surface-container-high p-6 shadow-3">
              <InvitePeopleForm onClose={() => setInline(false)} />
            </div>
          </div>
        )
      ) : (
        <Dialog aria-label="Invite people" modalClassName="max-w-lg" overlayProps={{ isOpen: modal, onOpenChange: setModal }}>
          <InvitePeopleForm onClose={() => setModal(false)} />
        </Dialog>
      )}
    </div>
  )
}
