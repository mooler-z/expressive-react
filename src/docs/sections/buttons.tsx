import * as React from "react"

import { Button, ToggleButton } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { Row, Section } from "@/docs/section"

const STYLES = ["elevated", "filled", "tonal", "outlined", "text"] as const
const SIZES = [
  ["xs", "Extra small"],
  ["sm", "Small"],
  ["md", "Medium"],
  ["lg", "Large"],
  ["xl", "Extra large"],
] as const

export default function ButtonsSection() {
  const [pending, setPending] = React.useState(false)
  return (
    <Section
      id="buttons"
      description="Five color styles × five sizes (XS 32 · S 40 · M 56 · L 96 · XL 136), round or square. Press any to see the shape morph."
      spec="https://m3.material.io/components/buttons/overview"
    >
      <Row label="Color styles · size S">
        {STYLES.map((v) => (
          <Button key={v} variant={v} className="capitalize">
            {v}
          </Button>
        ))}
      </Row>
      <Row label="Sizes · round">
        {SIZES.map(([s, label]) => (
          <Button key={s} size={s}>
            <Icon>add</Icon>
            {label}
          </Button>
        ))}
      </Row>
      <Row label="Sizes · square">
        {SIZES.map(([s, label]) => (
          <Button key={s} size={s} shape="square" variant="tonal">
            {label}
          </Button>
        ))}
      </Row>
      <Row label="Toggle · round unselected → square selected">
        {STYLES.map((v, i) => (
          <ToggleButton key={v} variant={v} defaultSelected={i === 1 || i === 2} className="capitalize">
            {v === "text" && <Icon>favorite</Icon>}
            {v}
          </ToggleButton>
        ))}
      </Row>
      <Row label="Toggle · square (keeps its corners when selected, tightens on press)">
        {(["filled", "tonal", "outlined"] as const).map((v, i) => (
          <ToggleButton key={v} variant={v} shape="square" defaultSelected={i === 0} className="capitalize">
            {v}
          </ToggleButton>
        ))}
      </Row>
      <Row label="Disabled · pending">
        <Button isDisabled>Filled</Button>
        <Button isDisabled variant="outlined">
          Outlined
        </Button>
        <Button isDisabled variant="text">
          Text
        </Button>
        <Button
          isPending={pending}
          onPress={() => {
            setPending(true)
            setTimeout(() => setPending(false), 2000)
          }}
        >
          {!pending && <Icon>save</Icon>}
          {pending ? "Saving…" : "Save changes"}
        </Button>
      </Row>
    </Section>
  )
}
