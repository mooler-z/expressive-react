import { useRef } from "react"

import { Icon } from "@/components/ui/icon"
import { IconButton } from "@/components/ui/icon-button"
import { snackbar } from "@/components/ui/snackbar"
import { useMagnetic } from "@/hooks/use-magnetic"
import { usePressScale } from "@/hooks/use-press-scale"

export default function PressScaleCompose() {
  const ref = useRef<HTMLButtonElement>(null)
  usePressScale(ref, { scale: 0.88 })
  useMagnetic(ref, { strength: 0.3 })

  return (
    <IconButton ref={ref} variant="filled" size="lg" aria-label="Start recording" onPress={() => snackbar("Recording")}>
      <Icon name="mic" />
    </IconButton>
  )
}
