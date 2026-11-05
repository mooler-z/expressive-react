import { ImageGallery } from "@/components/ui/image-viewer"

const trip = [
  { id: 177, alt: "Hiker on a ridge above a misty valley" },
  { id: 447, alt: "Person standing on a pier at a mountain lake" },
  { id: 474, alt: "Road winding through bare hills" },
  { id: 634, alt: "Pine forest in fog" },
  { id: 883, alt: "Person in a dark jacket beside a still lake" },
  { id: 1011, alt: "Paddler in a canoe on a forest lake" },
  { id: 1015, alt: "Fjord between steep cliffs" },
  { id: 1016, alt: "Red rock cliffs at sunset" },
  { id: 1018, alt: "Green ridge with a road below it" },
  { id: 1019, alt: "Storm clouds over a dark sea" },
].map(({ id, alt }) => ({
  src: `https://picsum.photos/id/${id}/1600/1200`,
  thumbnailSrc: `https://picsum.photos/id/${id}/400/300`,
  alt,
}))

export default function Gallery() {
  return <ImageGallery images={trip} aria-label="Field trip" className="max-w-2xl" itemClassName="aspect-[4/3]" />
}
