"use client"

import * as React from "react"
import { Form, Link } from "react-aria-components"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Icon } from "@/components/ui/icon"
import { InputOTP } from "@/components/ui/input-otp"
import { Shape } from "@/components/ui/shape"
import { snackbar } from "@/components/ui/snackbar"
import { TextField } from "@/components/ui/text-field"
import { cn } from "@/lib/utils"

/*
 * Two-factor 01 · Code challenge
 * Six-digit authenticator code with paste support, a trust-this-device option and a
 * backup-code fallback. Any six digits pass; 000000 shows the error state.
 */


export interface TwoFactor1Props {
  email?: string
  verifyCode?: (code: string, trustDevice: boolean) => boolean | Promise<boolean>
  verifyBackupCode?: (code: string) => boolean | Promise<boolean>
  cancelHref?: string
  className?: string
}

export function TwoFactor1({ email = "maya@cinder.gg", verifyCode, verifyBackupCode, cancelHref = "#", className }: TwoFactor1Props) {
  const [mode, setMode] = React.useState<"app" | "backup" | "done">("app")
  const [code, setCode] = React.useState("")
  const [bad, setBad] = React.useState(false)
  const [trust, setTrust] = React.useState(true)

  const check = async (value: string) => {
    const ok = verifyCode ? await verifyCode(value, trust) : value !== "000000"
    setBad(!ok)
    if (!ok) return
    setMode("done")
    snackbar("Code verified. Welcome back, Maya.")
  }

  const useBackup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const value = String(new FormData(e.currentTarget).get("backup"))
    if (verifyBackupCode && !(await verifyBackupCode(value))) return
    setMode("done")
    snackbar("Backup code accepted · 7 codes left")
  }

  return (
    <div className={cn("grid min-h-[560px] place-items-center bg-surface-container px-4 py-10", className)}>
      <div className="w-full max-w-[420px] rounded-xl bg-surface p-6 md:p-8">
        {mode === "app" && (
          <div key="app" className="animate-pop">
            <span className="grid size-12 place-items-center rounded-lg bg-primary-container text-on-primary-container">
              <Icon>phonelink_lock</Icon>
            </span>
            <h2 className="mt-5 text-headline-sm font-medium">Two-step verification</h2>
            <p className="mt-1 text-body-md text-on-surface-variant">Enter the code from your authenticator app for {email}.</p>
            <InputOTP
              fullWidth className="mt-6"
              aria-label="6-digit code"
              groups={[6]}
              value={code}
              onChange={(v) => {
                setCode(v)
                if (v.length < 6) setBad(false)
              }}
              onComplete={check}
              isInvalid={bad}
              errorMessage="That code didn't work. Check the time on your phone and try again."
            />
            <Checkbox isSelected={trust} onChange={setTrust} className="mt-3 -ml-3.5 text-body-md">
              Trust this device for 30 days
            </Checkbox>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
              <Button variant="text" className="-ml-3" onPress={() => setMode("backup")}>
                Use a backup code
              </Button>
              <Link href={cancelHref} className="focus-ring rounded-xs text-label-lg text-on-surface-variant">
                Cancel
              </Link>
            </div>
          </div>
        )}
        {mode === "backup" && (
          <div key="backup" className="animate-pop">
            <span className="grid size-12 place-items-center rounded-lg bg-tertiary-container text-on-tertiary-container">
              <Icon>password</Icon>
            </span>
            <h2 className="mt-5 text-headline-sm font-medium">Use a backup code</h2>
            <p className="mt-1 text-body-md text-on-surface-variant">Each code works once. You have 8 left.</p>
            <Form className="mt-6 space-y-3" onSubmit={useBackup}>
              <TextField
                name="backup"
                label="Backup code · xxxx-xxxx"
                autoComplete="off"
                isRequired
                pattern="[a-z0-9]{4}-[a-z0-9]{4}"
                errorMessage="Enter a code like k7m2-9qxp"
                inputClassName="font-mono"
              />
              <Button type="submit" className="h-12 w-full">
                Verify
              </Button>
              <Button variant="text" className="w-full" onPress={() => setMode("app")}>
                Use the authenticator app instead
              </Button>
            </Form>
          </div>
        )}
        {mode === "done" && (
          <div key="done" className="flex animate-pop flex-col items-center py-4 text-center">
            <div className="relative grid size-20 place-items-center">
              <div aria-hidden className="absolute inset-0 animate-[spin_40s_linear_infinite]">
                <Shape cycle={["cookie12", "sunny", "cookie9"]} interval={2600} className="size-full text-primary-container" />
              </div>
              <Icon size={36} className="relative text-on-primary-container">
                check
              </Icon>
            </div>
            <h2 className="mt-4 text-headline-sm font-medium">You're signed in</h2>
            <p className="mt-1 text-body-md text-on-surface-variant">{trust ? "This device stays trusted for 30 days." : "You'll be asked for a code next time."}</p>
            <Button
              variant="text"
              className="mt-5"
              onPress={() => {
                setMode("app")
                setCode("")
              }}
            >
              Replay
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
