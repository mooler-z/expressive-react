"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { InputOTP } from "@/components/ui/input-otp"
import { snackbar } from "@/components/ui/snackbar"
import { cn } from "@/lib/utils"

/*
 * Two-factor 02 · Authenticator setup
 * Scan the code or copy the setup key, confirm with six digits, then save backup codes.
 */


export interface TwoFactor2Props {
  /** Base32 setup key shown under the QR code. */
  secret?: string
  /** QR image for the otpauth:// URI. A placeholder glyph renders when omitted. */
  qrCode?: React.ReactNode
  backupCodes?: string[]
  verifyCode?: (code: string) => boolean | Promise<boolean>
  onDone?: () => void
  className?: string
}

const CODES = ["k7m2-9qxp", "r4tz-1hcw", "b8vn-6jds", "p3ye-0gfk", "w5ua-2mlq", "h9xr-7cbe", "d2qs-4nvt", "f6lk-8wzy", "m1oc-5tri", "z0he-3pad"]

export function TwoFactor2({ secret = "JBSWY3DPEHPK3PXP", qrCode, backupCodes = CODES, verifyCode, onDone, className }: TwoFactor2Props) {
  const [code, setCode] = React.useState("")
  const [bad, setBad] = React.useState(false)
  const [verified, setVerified] = React.useState(false)

  const check = async (value: string) => {
    const ok = verifyCode ? await verifyCode(value) : value !== "000000"
    setBad(!ok)
    if (ok) setVerified(true)
  }

  const copy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text)
      snackbar(`Copied ${label}`)
    } catch {
      snackbar("Copy failed · select the text instead")
    }
  }

  return (
    <div className={cn("grid min-h-[560px] place-items-center bg-surface-container-low px-4 py-10", className)}>
      <div className="w-full max-w-2xl rounded-xl bg-surface p-6 md:p-8">
        {verified ? (
          <div key="done" className="animate-pop">
            <div className="flex items-start gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary-container text-on-primary-container">
                <Icon filled>verified_user</Icon>
              </span>
              <div>
                <h2 className="text-title-lg font-medium">Authenticator added</h2>
                <p className="text-body-md text-on-surface-variant">Save these backup codes somewhere safe. Each one works once.</p>
              </div>
            </div>
            <ul className="mt-5 grid grid-cols-2 gap-2 rounded-lg bg-surface-container-low p-4 font-mono text-body-lg sm:grid-cols-5">
              {backupCodes.map((c) => (
                <li key={c} className="text-center">
                  {c}
                </li>
              ))}
            </ul>
            <div className="mt-5 flex flex-wrap items-center gap-2">
              <Button variant="outlined" className="pr-4 pl-3" onPress={() => copy(backupCodes.join("\n"), "backup codes")}>
                <Icon>content_copy</Icon>
                Copy
              </Button>
              <Button variant="outlined" className="pr-4 pl-3" onPress={() => snackbar("Downloaded lumen-backup-codes.txt")}>
                <Icon>download</Icon>
                Download
              </Button>
              <span className="flex-1" />
              <Button
                variant="text"
                onPress={() => {
                  setVerified(false)
                  setCode("")
                }}
              >
                Replay
              </Button>
              <Button onPress={() => (onDone ? onDone() : snackbar("Two-step verification is on"))}>Done</Button>
            </div>
          </div>
        ) : (
          <div key="setup" className="animate-pop">
            <h2 className="text-headline-sm font-medium">Set up an authenticator app</h2>
            <p className="mt-1 text-body-md text-on-surface-variant">Required for staff accounts with access to player data.</p>
            <div className="mt-6 grid gap-6 md:grid-cols-[200px_minmax(0,1fr)]">
              <div className="grid aspect-square w-full max-w-[200px] place-items-center rounded-lg border border-outline-variant bg-white p-2">
                {qrCode ?? (
                  <Icon size={168} className="leading-none text-black" aria-label="QR code">
                    qr_code_2
                  </Icon>
                )}
              </div>
              <ol className="space-y-6">
                <li className="flex gap-3">
                  <span className="grid size-7 shrink-0 place-items-center rounded-full bg-primary text-label-md text-on-primary">1</span>
                  <div className="min-w-0">
                    <div className="text-title-sm">Scan the QR code</div>
                    <p className="text-body-md text-on-surface-variant">Use 1Password, Google Authenticator or any TOTP app. Can't scan? Enter the key instead.</p>
                    <div className="mt-2 flex flex-wrap items-center gap-1">
                      <code className="rounded-xs bg-surface-container-high px-2 py-1 font-mono text-body-md">{secret.replace(/(.{4})/g, "$1 ").trim()}</code>
                      <Button variant="text" size="xs" className="px-2" onPress={() => copy(secret, "setup key")}>
                        <Icon size={18}>content_copy</Icon>
                        Copy key
                      </Button>
                    </div>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="grid size-7 shrink-0 place-items-center rounded-full bg-primary text-label-md text-on-primary">2</span>
                  <div className="min-w-0 flex-1">
                    <div className="text-title-sm">Enter the 6-digit code</div>
                    <p className="text-body-md text-on-surface-variant">It refreshes every 30 seconds.</p>
                    <InputOTP
                      fullWidth className="mt-3 max-w-sm"
                      size="sm"
                      aria-label="6-digit code"
                      groups={[6]}
                      value={code}
                      onChange={(v) => {
                        setCode(v)
                        if (v.length < 6) setBad(false)
                      }}
                      onComplete={check}
                      isInvalid={bad}
                      errorMessage="That code didn't match. Wait for the next one and try again."
                    />
                  </div>
                </li>
              </ol>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
