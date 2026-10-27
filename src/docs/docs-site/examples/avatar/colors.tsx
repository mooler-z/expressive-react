import { Avatar } from "@/components/ui/avatar"

const COLORS = ["primary", "secondary", "tertiary", "primary-solid", "secondary-solid", "tertiary-solid", "neutral"] as const

export default function AvatarColors() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      {COLORS.map((color) => (
        <Avatar key={color} size="lg" color={color} name="Maya Lindqvist" />
      ))}
    </div>
  )
}
