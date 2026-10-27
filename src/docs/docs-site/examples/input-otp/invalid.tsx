import { Button } from "@/components/ui/button"
import { InputOTP } from "@/components/ui/input-otp"

export default function InputOTPInvalid() {
  return (
    <div className="flex flex-col items-center gap-4">
      <InputOTP size="sm" aria-label="Verification code" defaultValue="481902" isInvalid errorMessage="This code expired. Request a new one." />
      <Button variant="tonal" size="sm">
        Send a new code
      </Button>
    </div>
  )
}
