"use client"

import * as React from "react"

import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { snackbar } from "@/components/ui/snackbar"
import { TextField } from "@/components/ui/text-field"
import { cn } from "@/lib/utils"

/*
 * Profile settings 03 · Inline edit + danger zone
 * A read-first card that turns into fields on Edit. Deleting the account asks you to type
 * DELETE before the button unlocks.
 */

export interface ProfileSettings3Props {
  name?: string
  title?: string
  onSave?: (values: { name: string; title: string }) => void | Promise<void>
  onTransferOwnership?: () => void
  onDeleteAccount?: () => void
  className?: string
}

export function ProfileSettings3({
  name: initialName = "Maya Ortiz",
  title: initialTitle = "Live ops lead",
  onSave,
  onTransferOwnership,
  onDeleteAccount,
  className,
}: ProfileSettings3Props) {
  const [name, setName] = React.useState(initialName)
  const [title, setTitle] = React.useState(initialTitle)
  const [draft, setDraft] = React.useState<{ name: string; title: string } | null>(null)
  const [confirm, setConfirm] = React.useState("")
  const initials = name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()

  const save = async () => {
    if (!draft) return
    const next = { name: draft.name.trim() || name, title: draft.title.trim() || title }
    await onSave?.(next)
    setName(next.name)
    setTitle(next.title)
    setDraft(null)
    snackbar("Profile updated")
  }

  return (
    <div className={cn("bg-surface-container-low p-4 md:p-8", className)}>
      <div className="mx-auto max-w-3xl space-y-4">
        <div className="rounded-xl bg-surface p-5 md:p-6">
          <div className="flex flex-wrap items-start gap-4">
            <span className="grid size-16 shrink-0 place-items-center rounded-lg-plus bg-tertiary-container text-title-lg text-on-tertiary-container">{initials}</span>
            {draft ? (
              <form
                className="grid min-w-0 flex-1 animate-fade-up gap-4 sm:grid-cols-2"
                onSubmit={(e) => {
                  e.preventDefault()
                  save()
                }}
              >
                <TextField label="Name" value={draft.name} onChange={(v) => setDraft({ ...draft, name: v })} autoFocus />
                <TextField label="Job title" value={draft.title} onChange={(v) => setDraft({ ...draft, title: v })} />
                <div className="flex gap-2 sm:col-span-2">
                  <Button type="submit">Save</Button>
                  <Button variant="text" onPress={() => setDraft(null)}>
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              <>
                <div className="min-w-0 flex-1 pt-1">
                  <div className="text-title-lg font-medium">{name}</div>
                  <div className="text-body-md text-on-surface-variant">{title} · Cinder Studio</div>
                </div>
                <Button variant="outlined" className="pr-4 pl-3" onPress={() => setDraft({ name, title })}>
                  <Icon>edit</Icon>
                  Edit
                </Button>
              </>
            )}
          </div>
          <dl className="mt-6 grid gap-4 border-t border-outline-variant pt-5 sm:grid-cols-3">
            {[
              ["Role", "Owner"],
              ["Teams", "Live ops, Insights"],
              ["Member since", "January 2024"],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="text-body-sm text-on-surface-variant">{k}</dt>
                <dd className="mt-0.5 text-body-lg">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
        <section aria-labelledby="ps3-danger" className="rounded-xl border border-error/50 bg-surface p-5 md:p-6">
          <h3 id="ps3-danger" className="text-title-lg font-medium text-error">
            Danger zone
          </h3>
          <ul className="mt-2 divide-y divide-outline-variant">
            <li className="flex flex-wrap items-center gap-3 py-4">
              <div className="min-w-0 flex-1">
                <div className="text-title-sm">Transfer ownership</div>
                <div className="text-body-md text-on-surface-variant">Hand Cinder Studio to another admin. You become an admin.</div>
              </div>
              <Button variant="outlined" onPress={() => (onTransferOwnership ? onTransferOwnership() : snackbar("Pick an admin to transfer ownership to"))}>
                Transfer
              </Button>
            </li>
            <li className="flex flex-wrap items-center gap-3 pt-4">
              <div className="min-w-0 flex-1">
                <div className="text-title-sm">Delete account</div>
                <div className="text-body-md text-on-surface-variant">Removes your access and personal data. Events you created stay with the studio.</div>
              </div>
              <AlertDialogTrigger onOpenChange={(open) => !open && setConfirm("")}>
                <Button className="bg-error px-4 text-on-error">Delete account</Button>
                <AlertDialog
                  destructive
                  icon="warning"
                  title="Delete your account?"
                  confirmLabel="Delete"
                  isConfirmDisabled={confirm !== "DELETE"}
                  onConfirm={() => {
                    if (onDeleteAccount) onDeleteAccount()
                    else
                      snackbar("Account scheduled for deletion in 14 days", {
                        action: { label: "Undo", onAction: () => snackbar("Deletion cancelled") },
                      })
                  }}
                >
                  <p>
                    This can't be undone. Type <span className="font-mono font-medium text-on-surface">DELETE</span> to confirm.
                  </p>
                  <TextField
                    aria-label="Type DELETE to confirm"
                    placeholder="DELETE"
                    autoComplete="off"
                    value={confirm}
                    onChange={setConfirm}
                    density="sm"
                    className="mt-4"
                    inputClassName="font-mono"
                  />
                </AlertDialog>
              </AlertDialogTrigger>
            </li>
          </ul>
        </section>
      </div>
    </div>
  )
}
