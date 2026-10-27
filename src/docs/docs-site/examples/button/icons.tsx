import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"

export default function ButtonIcons() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Button icon={<Icon name="add" />}>New deploy</Button>
      <Button variant="tonal" trailingIcon={<Icon name="arrow_forward" />}>Next step</Button>
      <Button variant="outlined" icon={<Icon name="download" />}>Export</Button>
      <Button color="error" icon={<Icon name="delete" />}>Delete</Button>
      <Button variant="tonal" color="tertiary" icon={<Icon name="bolt" filled />}>Upgrade</Button>
    </div>
  )
}
