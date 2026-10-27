import { Avatar } from "@/components/ui/avatar"

export default function AvatarSizes() {
  return (
    <div className="flex flex-wrap items-end justify-center gap-4">
      <Avatar size="xs" name="Maya Lindqvist" />
      <Avatar size="sm" name="Maya Lindqvist" />
      <Avatar size="md" name="Maya Lindqvist" />
      <Avatar size="lg" name="Maya Lindqvist" />
      <Avatar size="xl" name="Maya Lindqvist" />
    </div>
  )
}
