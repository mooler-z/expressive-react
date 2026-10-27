import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { Icon } from "@/components/ui/icon"

export default function ButtonGroupDemo() {
  return (
    <ButtonGroup size="md">
      <Button size="md" variant="tonal" icon={<Icon name="skip_previous" />}>
        Back
      </Button>
      <Button size="md" icon={<Icon name="play_arrow" />}>
        Play
      </Button>
      <Button size="md" variant="tonal" trailingIcon={<Icon name="skip_next" />}>
        Next
      </Button>
    </ButtonGroup>
  )
}
