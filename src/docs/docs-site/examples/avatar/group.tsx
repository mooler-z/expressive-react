import { Avatar, AvatarGroup } from "@/components/ui/avatar"

const PEOPLE = ["Maya Lindqvist", "Jon Okafor", "Ana Silva", "Lee Park", "Sam Rivera", "Priya Nair", "Tomás Ruiz"]

export default function AvatarGroupExample() {
  return (
    <div className="flex flex-col items-center gap-6">
      <AvatarGroup max={4}>
        {PEOPLE.map((name) => (
          <Avatar key={name} name={name} />
        ))}
      </AvatarGroup>
      <div className="rounded-lg bg-surface-container-low p-4">
        <AvatarGroup max={3} size="sm" className="[--avatar-ring:var(--md-surface-container-low)]">
          {PEOPLE.map((name) => (
            <Avatar key={name} size="sm" name={name} />
          ))}
        </AvatarGroup>
      </div>
    </div>
  )
}
