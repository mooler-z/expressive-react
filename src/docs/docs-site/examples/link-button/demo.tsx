import { Icon } from "@/components/ui/icon"
import { LinkButton } from "@/components/ui/link-button"

export default function LinkButtonDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <LinkButton href="/docs/button" variant="text" icon={<Icon name="arrow_back" />}>
        Button
      </LinkButton>
      <LinkButton href="/blocks" variant="tonal" trailingIcon={<Icon name="arrow_forward" />}>
        View all blocks
      </LinkButton>
      <LinkButton href="https://m3.material.io/components/buttons" target="_blank" variant="outlined" trailingIcon={<Icon name="open_in_new" />}>
        Open in M3 guidelines
      </LinkButton>
      <LinkButton href="/themes/presets">Browse presets</LinkButton>
    </div>
  )
}
