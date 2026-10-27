import { useRef } from "react"

import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { snackbar } from "@/components/ui/snackbar"
import { useMagnetic } from "@/hooks/use-magnetic"

export default function MagneticDemo() {
  const ref = useRef<HTMLButtonElement>(null)
  useMagnetic(ref)

  return (
    <div className="grid h-56 w-full max-w-md place-items-center rounded-xl bg-surface-container-low">
      <Button ref={ref} size="md" icon={<Icon name="rocket_launch" />} onPress={() => snackbar("Launched")}>
        Get started
      </Button>
    </div>
  )
}
