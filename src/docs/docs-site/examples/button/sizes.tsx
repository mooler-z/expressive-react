import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"

export default function ButtonSizes() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Button size="xs" icon={<Icon name="add" />}>Extra small</Button>
      <Button size="sm" icon={<Icon name="add" />}>Small</Button>
      <Button size="md" icon={<Icon name="add" />}>Medium</Button>
      <Button size="lg" icon={<Icon name="add" />}>Large</Button>
      <Button size="xl" icon={<Icon name="add" />}>Extra large</Button>
    </div>
  )
}
