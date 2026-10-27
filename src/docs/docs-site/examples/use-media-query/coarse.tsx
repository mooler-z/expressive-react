import { Slider } from "@/components/ui/slider"
import { useMediaQuery } from "@/hooks/use-media-query"

export default function MediaQueryCoarse() {
  const coarse = useMediaQuery("(pointer: coarse)")

  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <Slider label="Volume" size={coarse ? "md" : "xs"} defaultValue={40} />
      <p className="text-body-sm text-on-surface-variant">{coarse ? "Touch screen: medium track for easier dragging." : "Fine pointer: extra-small track."}</p>
    </div>
  )
}
