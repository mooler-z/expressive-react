import { Avatar } from "@/components/ui/avatar"

export default function AvatarShapes() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      <Avatar size="xl" name="Maya Lindqvist" />
      <Avatar size="xl" name="Jon Okafor" shape="square" />
      <Avatar size="xl" name="Ana Silva" shape="cookie9" hoverShape="sunny" />
      <Avatar size="xl" name="Lee Park" shape="clover4" hoverShape="cookie12" />
      <Avatar size="xl" name="Sam Rivera" shape="pentagon" hoverShape="burst" />
    </div>
  )
}
