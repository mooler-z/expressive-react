"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { InputOTP } from "@/components/ui/input-otp"
import { snackbar } from "@/components/ui/snackbar"
import { cn } from "@/lib/utils"

/*
 * Verify 02 · Enter a code
 * A six-digit code from the email instead of a link. Completing it shows the verified state.
 * Any six digits pass; 000000 shows the error state.
 */


export interface Verify2Props {
  email?: string
  verifyCode?: (code: string) => boolean | Promise<boolean>
  onContinue?: () => void
  className?: string
}

export function Verify2({ email = "maya@cinder.gg", verifyCode, onContinue, className }: Verify2Props) {
  const [code, setCode] = React.useState("")
  const [bad, setBad] = React.useState(false)
  const [ok, setOk] = React.useState(false)

  const check = async (value: string) => {
    const valid = verifyCode ? await verifyCode(value) : value !== "000000"
    setBad(!valid)
    if (valid) setOk(true)
  }

  return (
    <div className={cn("grid min-h-[520px] place-items-center bg-surface-container px-4 py-10", className)}>
      <div className="w-full max-w-[420px] rounded-xl bg-surface p-6 md:p-8">
        {ok ? (
          <div key="ok" className="flex animate-pop flex-col items-center py-4 text-center">
            <span className="grid size-16 place-items-center rounded-full bg-primary text-on-primary">
              <Icon size={32} filled>
                verified
              </Icon>
            </span>
            <h2 className="mt-4 text-headline-sm font-medium">Email verified</h2>
            <p className="mt-1 text-body-md text-on-surface-variant">{email} is confirmed. You can publish live events now.</p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <Button onPress={() => (onContinue ? onContinue() : snackbar("Opening Lumen…"))}>Continue</Button>
              <Button
                variant="text"
                onPress={() => {
                  setOk(false)
                  setCode("")
                }}
              >
                Replay
              </Button>
            </div>
          </div>
        ) : (
          <div key="form" className="animate-pop">
            <div className="flex items-center gap-2">
              <span className="grid size-9 place-items-center rounded-md bg-primary text-on-primary">
                <Icon size={20} filled>
                  stadia_controller
                </Icon>
              </span>
              <span className="text-title-lg font-semibold">Lumen</span>
            </div>
            <h2 className="mt-6 text-headline-sm font-medium">Enter the code we emailed you</h2>
            <p className="mt-1 text-body-md text-on-surface-variant">Sent to {email} · valid for 15 minutes</p>
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
              errorMessage="That code doesn't match. Request a new one below."
            />
            <div className="mt-6 flex flex-wrap items-center justify-between gap-2 text-body-md text-on-surface-variant">
              <span>Didn't get it?</span>
              <Button variant="text" onPress={() => snackbar(`New code sent to ${email}`)}>
                Send a new code
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
