import { AspectRatio, MediaLabel } from "@/components/ui/aspect-ratio"

const image =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><rect width="400" height="300" fill="#e8def8"/><circle cx="300" cy="80" r="40" fill="#ffd8e4"/><path d="M0 300 140 140 230 230 290 170 400 300z" fill="#6750a4"/></svg>',
  )

export default function AspectRatioImage() {
  return (
    <div className="w-full max-w-sm">
      <AspectRatio ratio={16 / 9} className="rounded-lg">
        <img src={image} alt="Mountains at dusk" />
        <MediaLabel>16 : 9 · cover</MediaLabel>
      </AspectRatio>
    </div>
  )
}
