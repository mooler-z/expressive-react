"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { ChipGroup, FilterChip } from "@/components/ui/chip"
import { Dialog, DialogActions, DialogBody, DialogHeadline } from "@/components/ui/dialog"
import { EmptyState } from "@/components/ui/empty-state"
import { Icon } from "@/components/ui/icon"
import { IconButton } from "@/components/ui/icon-button"
import { Select, SelectItem } from "@/components/ui/select"
import { snackbar } from "@/components/ui/snackbar"
import { TextField } from "@/components/ui/text-field"
import { cn } from "@/lib/utils"

/*
 * Integrations 03 · API keys
 * Masked keys with reveal, copy and revoke. Creating a key picks a name, scopes and expiry,
 * then shows the full key once.
 */

export interface ApiKey {
  id: string
  name: string
  key: string
  scopes: string[]
  created: string
  used: string
}

export interface Integrations3Props {
  keys?: ApiKey[]
  scopes?: string[]
  /** Create a key server-side and return it. Defaults to a local random key. */
  onCreate?: (values: { name: string; scopes: string[]; expires: string }) => Promise<ApiKey> | ApiKey
  onRevoke?: (id: string) => void
  className?: string
}

const KEYS: ApiKey[] = [
  { id: "k1", name: "Matchmaker service", key: "lmn_live_8f2c9a71d4e0b6", scopes: ["players:read", "matches:write"], created: "Aug 12, 2026", used: "2 min ago" },
  { id: "k2", name: "Economy ETL", key: "lmn_live_3b7e1f94c2a8d5", scopes: ["economy:read"], created: "Jun 3, 2026", used: "1 h ago" },
  { id: "k3", name: "Discord bot", key: "lmn_live_c1d9e47a0f6b32", scopes: ["events:read"], created: "Feb 20, 2026", used: "34 days ago" },
]
const SCOPES = ["players:read", "players:write", "events:read", "events:write", "economy:read", "matches:write"]
const EXPIRY = ["30 days", "90 days", "1 year", "Never"]
const COLS = "grid-cols-[minmax(160px,1fr)_minmax(260px,1.4fr)_minmax(160px,1fr)_100px_88px]"

const mask = (key: string) => key.slice(0, 9) + "••••••••" + key.slice(-4)

export function Integrations3({ keys: initialKeys = KEYS, scopes = SCOPES, onCreate, onRevoke, className }: Integrations3Props) {
  const [keys, setKeys] = React.useState(initialKeys)
  const [revealed, setRevealed] = React.useState<string[]>([])
  const [fresh, setFresh] = React.useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [draft, setDraft] = React.useState({ name: "", scopes: ["players:read"], expires: "90 days" })
  const freshKey = keys.find((k) => k.id === fresh)

  const copy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text)
      snackbar(`Copied ${label}`)
    } catch {
      snackbar("Copy failed · select the key instead")
    }
  }

  const revoke = (k: ApiKey) => {
    const index = keys.indexOf(k)
    setKeys((list) => list.filter((x) => x.id !== k.id))
    if (fresh === k.id) setFresh(null)
    onRevoke?.(k.id)
    snackbar(`Revoked ${k.name}`, { action: { label: "Undo", onAction: () => setKeys((list) => [...list.slice(0, index), k, ...list.slice(index)]) } })
  }

  const create = async () => {
    const values = { name: draft.name.trim(), scopes: draft.scopes, expires: draft.expires }
    const key = onCreate
      ? await onCreate(values)
      : {
          id: `k${Date.now()}`,
          name: values.name,
          key: "lmn_live_" + Array.from({ length: 14 }, () => Math.floor(Math.random() * 16).toString(16)).join(""),
          scopes: values.scopes,
          created: "Just now",
          used: "Never",
        }
    setKeys((list) => [key, ...list])
    setFresh(key.id)
    setRevealed((r) => [...r, key.id])
    setDialogOpen(false)
  }

  return (
    <div className={cn("relative min-h-[520px] bg-surface", className)}>
      <div className="flex flex-wrap items-center gap-3 px-4 py-4 md:px-6">
        <div className="min-w-0 flex-1">
          <h3 className="text-title-lg font-medium">API keys</h3>
          <p className="text-body-sm text-on-surface-variant">Server-to-server access to the Lumen API. Keep keys out of game clients.</p>
        </div>
        <Button
          className="pr-4 pl-3"
          onPress={() => {
            setDraft({ name: "", scopes: ["players:read"], expires: "90 days" })
            setDialogOpen(true)
          }}
        >
          <Icon>key</Icon>
          Create key
        </Button>
      </div>
      {freshKey && (
        <div role="status" className="mx-4 mb-4 flex animate-fade-up flex-wrap items-center gap-3 rounded-lg bg-primary-container p-4 text-on-primary-container md:mx-6">
          <Icon>key</Icon>
          <div className="min-w-0 flex-1">
            <div className="text-title-sm">Copy the {freshKey.name} key now</div>
            <div className="font-mono text-body-md break-all">{freshKey.key}</div>
            <div className="text-body-sm opacity-80">The full key is only shown once.</div>
          </div>
          <Button className="pr-4 pl-3" onPress={() => copy(freshKey.key, "API key")}>
            <Icon>content_copy</Icon>
            Copy
          </Button>
          <IconButton
            aria-label="Dismiss"
            className="text-on-primary-container"
            onPress={() => {
              setRevealed((r) => r.filter((x) => x !== freshKey.id))
              setFresh(null)
            }}
          >
            <Icon>close</Icon>
          </IconButton>
        </div>
      )}
      <div className="relative overflow-x-auto border-t border-outline-variant">
        <div role="table" aria-label="API keys" className="min-w-[780px]">
          <div role="row" className={cn("grid items-center gap-3 border-b border-outline-variant bg-surface-container-low px-4 py-2 text-label-md text-on-surface-variant md:px-6", COLS)}>
            <span role="columnheader">Name</span>
            <span role="columnheader">Key</span>
            <span role="columnheader">Scopes</span>
            <span role="columnheader">Last used</span>
            <span role="columnheader">
              <span className="sr-only">Actions</span>
            </span>
          </div>
          {keys.map((k) => {
            const shown = revealed.includes(k.id)
            return (
              <div
                role="row"
                key={k.id}
                className={cn("grid items-center gap-3 border-b border-outline-variant/60 px-4 py-3 text-body-md transition-colors md:px-6", COLS, fresh === k.id && "bg-primary-container/40")}
              >
                <span role="cell" className="min-w-0">
                  <span className="block truncate font-medium">{k.name}</span>
                  <span className="block text-body-sm text-on-surface-variant">Created {k.created}</span>
                </span>
                <span role="cell" className="flex min-w-0 items-center gap-1">
                  <code className="min-w-0 truncate font-mono text-body-sm">{shown ? k.key : mask(k.key)}</code>
                  <IconButton size="xs" className="size-9" aria-label={shown ? `Hide ${k.name} key` : `Show ${k.name} key`} onPress={() => setRevealed((r) => (shown ? r.filter((x) => x !== k.id) : [...r, k.id]))}>
                    <Icon size={20}>{shown ? "visibility_off" : "visibility"}</Icon>
                  </IconButton>
                  <IconButton size="xs" className="size-9" aria-label={`Copy ${k.name} key`} onPress={() => copy(k.key, `${k.name} key`)}>
                    <Icon size={20}>content_copy</Icon>
                  </IconButton>
                </span>
                <span role="cell" className="flex flex-wrap gap-1">
                  {k.scopes.map((s) => (
                    <span key={s} className="inline-flex h-6 items-center rounded-xs bg-surface-container-highest px-1.5 font-mono text-label-sm text-on-surface-variant">
                      {s}
                    </span>
                  ))}
                </span>
                <span role="cell" className="text-on-surface-variant">
                  {k.used}
                </span>
                <span role="cell" className="justify-self-end">
                  <Button variant="text" size="xs" className="h-9 text-error" onPress={() => revoke(k)}>
                    Revoke
                  </Button>
                </span>
              </div>
            )
          })}
        </div>
        {keys.length === 0 && <EmptyState size="sm" variant="plain" shape={false} icon="key_off" title="No API keys" description="Create one for each service that calls the API." className="py-10" />}
      </div>

      <Dialog aria-label="Create API key" overlayProps={{ isOpen: dialogOpen, onOpenChange: setDialogOpen }} modalClassName="max-w-md">
        <DialogHeadline>Create API key</DialogHeadline>
        <DialogBody className="space-y-5 overflow-visible">
          <TextField label="Key name" placeholder="e.g. Leaderboard sync" value={draft.name} onChange={(name) => setDraft({ ...draft, name })} autoFocus />
          <div>
            <div id="is3-scopes" className="text-label-lg text-on-surface-variant">
              Scopes
            </div>
            <ChipGroup
              aria-labelledby="is3-scopes"
              className="mt-2"
              selectedKeys={draft.scopes}
              onSelectionChange={(k) => setDraft({ ...draft, scopes: [...k].map(String) })}
            >
              {scopes.map((s) => (
                <FilterChip key={s} id={s} className="font-mono text-label-md">
                  {s}
                </FilterChip>
              ))}
            </ChipGroup>
          </div>
          <Select label="Expires after" selectedKey={draft.expires} onSelectionChange={(k) => setDraft({ ...draft, expires: String(k) })}>
            {EXPIRY.map((e) => (
              <SelectItem key={e} id={e}>
                {e}
              </SelectItem>
            ))}
          </Select>
        </DialogBody>
        <DialogActions>
          <Button variant="text" slot="close">
            Cancel
          </Button>
          <Button isDisabled={!draft.name.trim() || draft.scopes.length === 0} onPress={create}>
            Create key
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
