import { ViewableImage } from "@/components/ui/image-viewer"

const places = [
  {
    id: 1015,
    title: "Lysefjord, Norway",
    description: "The fjord from Preikestolen, 604 m above the water. The trail takes about two hours each way from the car park.",
  },
  {
    id: 1018,
    title: "The Quiraing, Isle of Skye",
    description: "A landslip on the east face of Meall na Suiramach. The single-track road climbs straight through it.",
  },
  {
    id: 1050,
    title: "Sea stacks",
    description: "Columns cut off from the cliffs by the waves, photographed at low tide.",
  },
]

export default function Captions() {
  return (
    <div className="flex flex-wrap justify-center gap-4">
      {places.map((place) => (
        <figure key={place.id} className="flex w-40 flex-col gap-2">
          <ViewableImage
            src={`https://picsum.photos/id/${place.id}/320/240`}
            fullSrc={`https://picsum.photos/id/${place.id}/1600/1200`}
            alt={place.title}
            title={place.title}
            description={place.description}
            className="aspect-[4/3] w-full rounded-md"
          />
          <figcaption className="text-label-lg text-on-surface">{place.title}</figcaption>
        </figure>
      ))}
    </div>
  )
}
