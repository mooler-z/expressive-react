import { AspectRatio, MediaPlaceholder } from "@/components/ui/aspect-ratio"

export default function AspectRatioDemo() {
  return (
    <div className="grid w-full max-w-2xl grid-cols-1 items-start gap-4 sm:grid-cols-3">
      <AspectRatio ratio={1} className="rounded-lg">
        <MediaPlaceholder color="primary" label="1 : 1" />
      </AspectRatio>
      <AspectRatio ratio={4 / 3} className="rounded-lg">
        <MediaPlaceholder color="secondary" label="4 : 3" />
      </AspectRatio>
      <AspectRatio ratio={16 / 9} className="rounded-lg">
        <MediaPlaceholder color="tertiary" label="16 : 9" />
      </AspectRatio>
    </div>
  )
}
