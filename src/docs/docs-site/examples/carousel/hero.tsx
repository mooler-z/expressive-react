import { Carousel, CarouselContent, CarouselDots, CarouselItem, CarouselLabel } from "@/components/ui/carousel"

const STORIES = [
  { title: "Designing with springs", tone: "bg-primary-container text-on-primary-container" },
  { title: "Dynamic color, explained", tone: "bg-tertiary-container text-on-tertiary-container" },
  { title: "Shape morphing in CSS", tone: "bg-secondary-container text-on-secondary-container" },
  { title: "Accessible by default", tone: "bg-surface-container-highest text-on-surface" },
]

export default function HeroCarousel() {
  return (
    <Carousel layout="hero" aria-label="Featured stories" className="w-full max-w-2xl">
      <CarouselContent className="h-60">
        {STORIES.map((s) => (
          <CarouselItem key={s.title} className={s.tone}>
            <CarouselLabel className="text-headline-sm">{s.title}</CarouselLabel>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselDots className="mt-4" />
    </Carousel>
  )
}
