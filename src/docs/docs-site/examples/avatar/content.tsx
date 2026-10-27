import { Avatar } from "@/components/ui/avatar"

const photo =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7d5260"/><stop offset="1" stop-color="#ffd8e4"/></linearGradient></defs><rect width="96" height="96" fill="url(#g)"/><circle cx="48" cy="38" r="16" fill="#fff" fill-opacity=".85"/><path d="M18 96c4-20 16-30 30-30s26 10 30 30" fill="#fff" fill-opacity=".85"/></svg>',
  )

export default function AvatarContent() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      <Avatar size="lg" src={photo} name="Maya Lindqvist" />
      <Avatar size="lg" name="Maya Lindqvist" />
      <Avatar size="lg" fallback="QA" color="secondary" aria-label="QA team" />
      <Avatar size="lg" icon="groups" color="tertiary" aria-label="Platform team" />
      <Avatar size="lg" aria-label="Unknown user" />
    </div>
  )
}
