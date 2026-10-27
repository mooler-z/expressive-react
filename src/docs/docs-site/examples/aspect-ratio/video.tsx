import { AspectRatio, MediaPlaceholder } from "@/components/ui/aspect-ratio"
import { Icon } from "@/components/ui/icon"

export default function AspectRatioVideo() {
  return (
    <div className="w-full max-w-md">
      <AspectRatio ratio={16 / 9} className="rounded-lg">
        <MediaPlaceholder icon="movie" color="neutral" label="12:04" />
        <button
          type="button"
          aria-label="Play"
          className="state-layer focus-ring absolute top-1/2 left-1/2 grid size-16 -translate-1/2 cursor-pointer place-items-center rounded-full bg-primary text-on-primary shadow-2"
        >
          <Icon name="play_arrow" size={32} filled />
        </button>
        <div className="absolute inset-x-3 bottom-3 h-1 rounded-full bg-on-surface/20">
          <div className="h-full w-2/5 rounded-full bg-primary" />
        </div>
      </AspectRatio>
    </div>
  )
}
