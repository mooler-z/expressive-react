import { AspectRatio, MediaPlaceholder } from "@/components/ui/aspect-ratio"

export default function AspectRatioRatios() {
  return (
    <div className="grid w-full max-w-2xl grid-cols-2 items-end gap-4 sm:grid-cols-4">
      <AspectRatio ratio={21 / 9} className="col-span-2 rounded-lg">
        <MediaPlaceholder icon="panorama" color="neutral" label="21 : 9" />
      </AspectRatio>
      <AspectRatio ratio={4 / 5} className="rounded-lg">
        <MediaPlaceholder icon="portrait" color="secondary" label="4 : 5" />
      </AspectRatio>
      <AspectRatio ratio={9 / 16} className="rounded-lg">
        <MediaPlaceholder icon="smartphone" color="tertiary" label="9 : 16" />
      </AspectRatio>
    </div>
  )
}
