"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { snackbar } from "@/components/ui/snackbar"
import { StatusBadge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

/*
 * Two-factor 03 · Security settings
 * Method management after setup: status per method, an SMS fallback switch, and backup codes
 * that reveal on demand.
 */

export interface TwoFactor3Props {
  backupCodes?: string[]
  /** Codes already used; shown struck through. */
  usedCodes?: number
  phone?: string
  className?: string
}

const CODES = ["k7m2-9qxp", "r4tz-1hcw", "b8vn-6jds", "p3ye-0gfk", "w5ua-2mlq", "h9xr-7cbe", "d2qs-4nvt", "f6lk-8wzy", "m1oc-5tri", "z0he-3pad"]

export function TwoFactor3({ backupCodes = CODES, usedCodes = 2, phone = "+1 ••• ••• 0193", className }: TwoFactor3Props) {
  const [sms, setSms] = React.useState(false)
  const [showCodes, setShowCodes] = React.useState(false)
  const unused = backupCodes.slice(usedCodes)

  const flipSms = (on: boolean) => {
    setSms(on)
    snackbar(on ? `Text message codes on for ${phone}` : "Text message codes turned off")
  }

  const copyUnused = async () => {
    try {
      await navigator.clipboard.writeText(unused.join("\n"))
      snackbar(`Copied ${unused.length} backup codes`)
    } catch {
      snackbar("Copy failed · select the codes instead")
    }
  }

  return (
    <div className={cn("bg-surface-container-low p-4 md:p-8", className)}>
      <div className="mx-auto max-w-3xl space-y-4">
        <div>
          <h2 className="text-headline-sm font-medium">Two-step verification</h2>
          <p className="mt-1 text-body-md text-on-surface-variant">On since Mar 4, 2026 · required by Cinder Studio</p>
        </div>
        <ul className="divide-y divide-outline-variant overflow-hidden rounded-xl bg-surface">
          <li className="flex flex-wrap items-center gap-4 p-4 md:p-5">
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary-container text-on-primary-container">
              <Icon>smartphone</Icon>
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-title-md">Authenticator app</span>
                <StatusBadge variant="primary-container" size="md">
                  Default
                </StatusBadge>
              </div>
              <div className="text-body-md text-on-surface-variant">1Password · added Mar 4, 2026</div>
            </div>
            <Button variant="outlined" onPress={() => snackbar("Scan a new QR code to replace this app")}>
              Replace
            </Button>
          </li>
          <li className="flex flex-wrap items-center gap-4 p-4 md:p-5">
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-secondary-container text-on-secondary-container">
              <Icon>key</Icon>
            </span>
            <div className="min-w-0 flex-1">
              <div className="text-title-md">Security keys</div>
              <div className="text-body-md text-on-surface-variant">2 keys · YubiKey 5C, MacBook Touch ID</div>
            </div>
            <Button variant="outlined" onPress={() => snackbar("Insert your key or touch the sensor…")}>
              Add key
            </Button>
          </li>
          <li className="flex flex-wrap items-center gap-4 p-4 md:p-5">
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-surface-container-highest text-on-surface-variant">
              <Icon>sms</Icon>
            </span>
            <div className="min-w-0 flex-1">
              <div className="text-title-md">Text message</div>
              <div className="text-body-md text-on-surface-variant">{sms ? `On · ${phone}` : "Off"}</div>
            </div>
            <Switch aria-label="Text message codes" isSelected={sms} onChange={flipSms} />
          </li>
        </ul>
        <div className="rounded-xl bg-surface p-4 md:p-5">
          <div className="flex flex-wrap items-center gap-4">
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-tertiary-container text-on-tertiary-container">
              <Icon>password</Icon>
            </span>
            <div className="min-w-0 flex-1">
              <div className="text-title-md">Backup codes</div>
              <div className="text-body-md text-on-surface-variant">
                {unused.length} of {backupCodes.length} left · generated Mar 4, 2026
              </div>
            </div>
            <Button variant="outlined" className="pr-4 pl-3" aria-expanded={showCodes} onPress={() => setShowCodes((s) => !s)}>
              <Icon>{showCodes ? "visibility_off" : "visibility"}</Icon>
              {showCodes ? "Hide codes" : "Show codes"}
            </Button>
          </div>
          {showCodes && (
            <div className="mt-4 animate-fade-up space-y-3">
              <ul className="grid grid-cols-2 gap-2 rounded-lg bg-surface-container-low p-4 font-mono text-body-lg sm:grid-cols-5">
                {backupCodes.map((c, i) => (
                  <li key={c} className={cn("text-center", i < usedCodes && "text-on-surface-variant line-through opacity-60")}>
                    {c}
                    {i < usedCodes && <span className="sr-only"> (used)</span>}
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-2">
                <Button variant="outlined" className="pr-4 pl-3" onPress={copyUnused}>
                  <Icon>content_copy</Icon>
                  Copy unused
                </Button>
                <Button
                  variant="text"
                  className="pr-4 pl-3 text-error"
                  onPress={() =>
                    snackbar("Generated 10 new codes · the old ones stopped working", {
                      action: { label: "Undo", onAction: () => snackbar("Restored your previous codes") },
                    })
                  }
                >
                  <Icon>autorenew</Icon>
                  Generate new codes
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
