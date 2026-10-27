import { useState } from "react"

import { ConnectedButton, ConnectedButtonGroup } from "@/components/ui/button-group"
import { Shape, type ShapeName } from "@/components/ui/shape"

const options: ShapeName[] = ["circle", "cookie7", "clover4", "burst", "gem"]

export default function ShapeMorph() {
  const [shape, setShape] = useState<ShapeName>("cookie7")

  return (
    <div className="flex flex-col items-center gap-6">
      <Shape shape={shape} morphDuration={700} className="size-36 text-tertiary" />
      <ConnectedButtonGroup
        aria-label="Shape"
        size="xs"
        selectedKeys={[shape]}
        onSelectionChange={(keys) => setShape([...keys][0] as ShapeName)}
      >
        {options.map((name) => (
          <ConnectedButton key={name} id={name}>
            {name}
          </ConnectedButton>
        ))}
      </ConnectedButtonGroup>
    </div>
  )
}
