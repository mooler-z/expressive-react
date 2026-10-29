import { Icon } from "@/components/ui/icon"
import { LinkButton } from "@/components/ui/link-button"

export default function LinkButtonStyles() {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex flex-wrap items-center justify-center gap-3">
        <LinkButton href="/docs/link-button" variant="elevated">Elevated</LinkButton>
        <LinkButton href="/docs/link-button">Filled</LinkButton>
        <LinkButton href="/docs/link-button" variant="tonal">Tonal</LinkButton>
        <LinkButton href="/docs/link-button" variant="outlined">Outlined</LinkButton>
        <LinkButton href="/docs/link-button" variant="text">Text</LinkButton>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <LinkButton href="/docs/link-button" size="xs" shape="square" icon={<Icon name="bolt" />}>XS square</LinkButton>
        <LinkButton href="/docs/link-button" size="md" variant="tonal" color="tertiary" icon={<Icon name="explore" />}>Medium tertiary</LinkButton>
        <LinkButton href="/docs/link-button" variant="outlined" isDisabled>Disabled</LinkButton>
      </div>
    </div>
  )
}
