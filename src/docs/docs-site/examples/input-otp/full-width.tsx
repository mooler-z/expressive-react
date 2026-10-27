import { InputOTP } from "@/components/ui/input-otp"

export default function InputOTPFullWidth() {
  return (
    <div className="w-full max-w-sm rounded-xl bg-surface-container-low p-6">
      <div className="text-title-lg">Two-step verification</div>
      <p className="mt-1 mb-5 text-body-md text-on-surface-variant">Open your authenticator app and enter the code.</p>
      <InputOTP fullWidth aria-label="Authenticator code" />
    </div>
  )
}
