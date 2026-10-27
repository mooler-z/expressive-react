import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { InputOTP } from "@/components/ui/input-otp"

export default function InputOTPDemo() {
  const [seconds, setSeconds] = useState(30)
  const [code, setCode] = useState<string | null>(null)

  useEffect(() => {
    if (seconds <= 0) return
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000)
    return () => clearTimeout(t)
  }, [seconds])

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="text-center">
        <div className="text-title-lg">Check your email</div>
        <p className="mt-1 text-body-md text-on-surface-variant">We sent a 6-digit code to m•••@kestrel.io</p>
      </div>
      <InputOTP label="Verification code" onComplete={setCode} onChange={() => setCode(null)} />
      {code ? (
        <p className="text-body-md text-primary">Code {code} accepted</p>
      ) : (
        <Button variant="text" isDisabled={seconds > 0} onPress={() => setSeconds(30)}>
          {seconds > 0 ? `Resend in 0:${String(seconds).padStart(2, "0")}` : "Resend code"}
        </Button>
      )}
    </div>
  )
}
