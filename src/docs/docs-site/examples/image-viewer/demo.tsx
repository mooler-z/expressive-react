import { ImageGallery } from "@/components/ui/image-viewer"

const photo = (id: number, w: number, h: number) => `https://picsum.photos/id/${id}/${w}/${h}`

const wildlife = [
  { id: 433, alt: "Brown bear facing the camera", title: "Brown bear", description: "Kamchatka, late summer." },
  { id: 593, alt: "Tiger resting on a dirt path", title: "Tiger", description: "Resting in the shade after the midday heat." },
  { id: 659, alt: "Husky in a harness, looking to the side", title: "Husky", description: "Sled team lead, between runs." },
  { id: 718, alt: "Grey wolf standing on a forest track", title: "Grey wolf", description: "Spotted at dawn on the old logging road." },
  { id: 1074, alt: "Lioness looking straight ahead", title: "Lioness", description: "Golden hour in the reserve." },
  { id: 577, alt: "Deer drinking at a forest stream", title: "Red deer", description: "Crossing the stream below the falls." },
].map(({ id, ...image }) => ({ ...image, src: photo(id, 1600, 1067), thumbnailSrc: photo(id, 320, 320) }))

export default function ImageViewerDemo() {
  return (
    <ImageGallery
      images={wildlife}
      aria-label="Wildlife"
      className="max-w-lg grid-cols-3"
      viewerProps={{ showThumbnails: true }}
    />
  )
}
