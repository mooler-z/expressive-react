import { ImageGallery } from "@/components/ui/image-viewer"

const people = [
  { id: 823, alt: "Photographer in a red beanie holding a camera" },
  { id: 836, alt: "Musician laughing while playing a red guitar" },
  { id: 1005, alt: "Person in a scarf looking out to sea" },
  { id: 1011, alt: "Paddler in a red jacket on a forest lake" },
  { id: 1012, alt: "Person and dog lying in tall grass" },
  { id: 883, alt: "Person in a dark jacket beside a still lake" },
].map(({ id, alt }) => ({
  src: `https://picsum.photos/id/${id}/1200/1600`,
  thumbnailSrc: `https://picsum.photos/id/${id}/240/320`,
  alt,
  downloadUrl: `https://picsum.photos/id/${id}/2400/3200`,
}))

export default function ThumbnailsAndDownload() {
  return (
    <ImageGallery
      images={people}
      aria-label="People"
      className="max-w-md grid-cols-3"
      itemClassName="aspect-[3/4]"
      viewerProps={{ showThumbnails: true, loop: false }}
    />
  )
}
