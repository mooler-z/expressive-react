import { InputOTP } from "@/components/ui/input-otp"

export default function InputOTPGroups() {
  return (
    <InputOTP
      length={8}
      groups={[4, 4]}
      pattern="alphanumeric"
      size="sm"
      label="Recovery code"
      description="Letters and digits; lowercase is converted."
      defaultValue="K7Q2"
    />
  )
}
