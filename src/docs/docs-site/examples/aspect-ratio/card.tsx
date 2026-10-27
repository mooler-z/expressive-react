import { AspectRatio, MediaPlaceholder } from "@/components/ui/aspect-ratio"
import { Button } from "@/components/ui/button"

export default function AspectRatioCard() {
  return (
    <article className="w-full max-w-xs overflow-hidden rounded-md bg-surface-container-low">
      <AspectRatio ratio={3 / 2}>
        <MediaPlaceholder icon="landscape" color="primary" />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-scrim/60 to-transparent p-4 pt-10">
          <h3 className="text-title-lg text-white">Glacier Point</h3>
        </div>
      </AspectRatio>
      <div className="flex items-center justify-between gap-2 p-4">
        <p className="text-body-md text-on-surface-variant">Yosemite · 3:2</p>
        <Button variant="text">Open</Button>
      </div>
    </article>
  )
}
