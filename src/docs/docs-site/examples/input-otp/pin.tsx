import { InputOTP } from "@/components/ui/input-otp"

export default function InputOTPPin() {
  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <div className="text-title-md">Enter your PIN</div>
      <InputOTP length={4} variant="tonal" mask aria-label="PIN" defaultValue="42" />
      <p className="text-body-sm text-on-surface-variant">Required to approve production deploys</p>
    </div>
  )
}
