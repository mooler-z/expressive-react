import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { Menu, MenuItem, MenuPopover, MenuSection, MenuTrigger } from "@/components/ui/menu"
import { snackbar } from "@/components/ui/snackbar"

const PEOPLE = [
  { id: "maya", name: "Maya Lindqvist", role: "Platform", open: 3 },
  { id: "jonah", name: "Jonah Park", role: "Payments", open: 12 },
  { id: "ines", name: "Inès Moreau", role: "Design", open: 0 },
]

export default function MenuRichItems() {
  return (
    <MenuTrigger>
      <Button variant="tonal" icon={<Icon name="person_add" />}>Assign</Button>
      <MenuPopover>
        <Menu aria-label="Assign to" onAction={(key) => snackbar(`Assigned to ${PEOPLE.find((p) => p.id === key)?.name}`)} className="w-72">
          <MenuSection title="Assign to">
            {PEOPLE.map((p) => (
              <MenuItem
                key={p.id}
                id={p.id}
                textValue={p.name}
                leading={<Avatar name={p.name} size="sm" />}
                description={p.role}
                trailing={p.open ? <span className="text-label-md tabular-nums">{p.open} open</span> : undefined}
              >
                {p.name}
              </MenuItem>
            ))}
          </MenuSection>
        </Menu>
      </MenuPopover>
    </MenuTrigger>
  )
}
