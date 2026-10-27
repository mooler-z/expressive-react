import { Carousel, CarouselContent, CarouselDots, CarouselItem, CarouselLabel } from "@/components/ui/carousel"

const CLIPS = [
  { title: "Welcome", tone: "bg-primary-container text-on-primary-container" },
  { title: "Pick a seed color", tone: "bg-tertiary-container text-on-tertiary-container" },
  { title: "Install a component", tone: "bg-secondary-container text-on-secondary-container" },
]

export default function FullScreenCarousel() {
  return (
    <Carousel layout="full-screen" aria-label="Onboarding" className="flex w-full max-w-xs items-center gap-3">
      <CarouselContent className="h-96 flex-1 rounded-xl">
        {CLIPS.map((c) => (
          <CarouselItem key={c.title} className={c.tone}>
            <CarouselLabel className="text-headline-sm">{c.title}</CarouselLabel>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselDots />
    </Carousel>
  )
}
