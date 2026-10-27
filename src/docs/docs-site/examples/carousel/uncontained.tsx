import { Carousel, CarouselContent, CarouselItem, CarouselLabel } from "@/components/ui/carousel"
import { Icon } from "@/components/ui/icon"

const APPS = [
  { name: "Maps", icon: "map" },
  { name: "Photos", icon: "photo_library" },
  { name: "Music", icon: "music_note" },
  { name: "Notes", icon: "sticky_note_2" },
  { name: "Wallet", icon: "wallet" },
  { name: "Weather", icon: "partly_cloudy_day" },
  { name: "Files", icon: "folder" },
]

export default function UncontainedCarousel() {
  return (
    <Carousel layout="uncontained" itemSize={150} aria-label="Apps" className="w-full max-w-2xl">
      <CarouselContent className="h-44">
        {APPS.map((app) => (
          <CarouselItem key={app.name} className="rounded-xl bg-surface-container-high text-on-surface">
            <div className="grid h-full place-items-center pb-8 text-primary [--icon-size:40px]">
              <Icon name={app.icon} />
            </div>
            <CarouselLabel className="text-title-sm">{app.name}</CarouselLabel>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  )
}
