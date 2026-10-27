import { Icon } from "@/components/ui/icon"
import { IconButton, ToggleIconButton } from "@/components/ui/icon-button"
import { Row, Section } from "@/docs/section"

const SIZES = ["xs", "sm", "md", "lg", "xl"] as const

export default function IconButtonsSection() {
  return (
    <Section
      id="icon-buttons"
      description="Standard, filled, tonal, outlined. Five sizes, three widths (narrow · default · wide), round or square, optional toggle."
      spec="https://m3.material.io/components/icon-buttons/overview"
    >
      <Row label="Styles · toggles">
        {(["standard", "filled", "tonal", "outlined"] as const).map((v) => (
          <IconButton key={v} variant={v} aria-label={v}>
            <Icon>settings</Icon>
          </IconButton>
        ))}
        <span className="mx-2 h-8 w-px bg-outline-variant" />
        {(
          [
            ["filled", "favorite"],
            ["tonal", "bookmark"],
            ["outlined", "star"],
            ["standard", "notifications"],
          ] as const
        ).map(([v, icon], i) => (
          <ToggleIconButton key={v} variant={v} aria-label={icon} defaultSelected={i === 0}>
            <Icon>{icon}</Icon>
          </ToggleIconButton>
        ))}
      </Row>
      <Row label="Toggle · round → square selected · square → round selected">
        <ToggleIconButton variant="filled" size="md" aria-label="Round toggle">
          <Icon>favorite</Icon>
        </ToggleIconButton>
        <ToggleIconButton variant="filled" size="md" shape="square" aria-label="Square toggle">
          <Icon>favorite</Icon>
        </ToggleIconButton>
        <ToggleIconButton variant="tonal" size="lg" aria-label="Large round toggle">
          <Icon>bookmark</Icon>
        </ToggleIconButton>
        <ToggleIconButton variant="tonal" size="lg" shape="square" aria-label="Large square toggle">
          <Icon>bookmark</Icon>
        </ToggleIconButton>
      </Row>
      <Row label="Sizes · XS 32 · S 40 · M 56 · L 96 · XL 136">
        {SIZES.map((s) => (
          <IconButton key={s} size={s} variant="tonal" aria-label="Edit">
            <Icon>edit</Icon>
          </IconButton>
        ))}
      </Row>
      <Row label="Widths · narrow · default · wide (size M) · square">
        {(["narrow", "default", "wide"] as const).map((w) => (
          <IconButton key={w} size="md" width={w} variant="filled" aria-label="Microphone">
            <Icon>mic</Icon>
          </IconButton>
        ))}
        <IconButton size="md" width="wide" shape="square" variant="filled" aria-label="Microphone">
          <Icon>mic</Icon>
        </IconButton>
      </Row>
    </Section>
  )
}
