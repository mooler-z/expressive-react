import * as React from "react"

import { Button } from "@/components/ui/button"
import { InputOTP } from "@/components/ui/input-otp"
import { Section, Variant, Variants } from "@/docs/section"

export default function InputOTPSection() {
  const [seconds, setSeconds] = React.useState(42)
  const [done, setDone] = React.useState<string | null>(null)
  React.useEffect(() => {
    if (seconds <= 0) return
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000)
    return () => clearTimeout(t)
  }, [seconds])

  return (
    <Section
      id="input-otp"
      description="Six 56dp cells in two groups, headline-small digits, the active cell outlined in primary. One real input underneath, so paste, SMS autofill and screen readers just work."
    >
      <div className="flex flex-col items-center gap-6">
        <div className="text-center">
          <div className="text-title-lg">Check your email</div>
          <p className="mt-1 text-body-md text-on-surface-variant">We sent a 6-digit code to m•••@kestrel.io</p>
        </div>
        <InputOTP defaultValue="481" onComplete={setDone} />
        <div className="flex items-center gap-2 text-body-md text-on-surface-variant">
          {done ? (
            <span className="text-primary">Code {done} accepted</span>
          ) : (
            <>
              Didn't get it?
              <Button variant="text" isDisabled={seconds > 0} onPress={() => setSeconds(42)}>
                {seconds > 0 ? `Resend in 0:${String(seconds).padStart(2, "0")}` : "Resend code"}
              </Button>
            </>
          )}
        </div>
      </div>

      <Variants cols="md:grid-cols-2">
        <Variant n={1} label="4-digit PIN · masked" className="flex min-h-24 flex-col items-center justify-center gap-4 rounded-lg bg-surface p-4">
          <div className="text-center">
            <div className="text-title-lg">Enter your PIN</div>
            <p className="mt-1 text-body-md text-on-surface-variant">Required to approve production deploys</p>
          </div>
          <InputOTP length={4} variant="tonal" mask aria-label="PIN" defaultValue="42" />
        </Variant>
        <Variant n={2} label="Error · expired" className="flex min-h-24 flex-col items-center justify-center gap-4 rounded-lg bg-surface p-4">
          <InputOTP size="sm" defaultValue="481902" isInvalid errorMessage="This code expired. Request a new one." />
          <Button variant="tonal" size="sm">
            Send a new code
          </Button>
        </Variant>
      </Variants>
    </Section>
  )
}
