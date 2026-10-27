import { Carousel, CarouselContent, CarouselItem, CarouselLabel } from "@/components/ui/carousel"

const ALBUMS = [
  { title: "Night drive", tone: "bg-primary text-on-primary" },
  { title: "Glacier", tone: "bg-tertiary text-on-tertiary" },
  { title: "Tide pools", tone: "bg-secondary text-on-secondary" },
  { title: "Northern lights", tone: "bg-primary-container text-on-primary-container" },
  { title: "Static", tone: "bg-inverse-surface text-inverse-on-surface" },
]

export default function CenterHeroCarousel() {
  return (
    <Carousel layout="center-hero" aria-label="Albums" className="w-full max-w-2xl">
      <CarouselContent className="h-56">
        {ALBUMS.map((a) => (
          <CarouselItem key={a.title} className={a.tone}>
            <CarouselLabel className="text-title-md">{a.title}</CarouselLabel>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  )
}
