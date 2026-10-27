import { Carousel, CarouselContent, CarouselCount, CarouselItem, CarouselLabel, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"

const SLIDES = [
  { title: "Edge regions", tone: "bg-primary-container text-on-primary-container" },
  { title: "Service mesh", tone: "bg-tertiary-container text-on-tertiary-container" },
  { title: "Compute", tone: "bg-secondary-container text-on-secondary-container" },
  { title: "Storage", tone: "bg-primary-fixed-dim text-on-primary-fixed" },
  { title: "Observability", tone: "bg-surface-container-highest text-on-surface" },
  { title: "Identity", tone: "bg-inverse-surface text-inverse-on-surface" },
]

export default function CarouselDemo() {
  return (
    <Carousel aria-label="Platform highlights" className="w-full max-w-3xl">
      <div className="mb-3 flex items-center justify-end gap-2">
        <CarouselCount className="mr-1" />
        <CarouselPrevious />
        <CarouselNext />
      </div>
      <CarouselContent className="h-56">
        {SLIDES.map((s) => (
          <CarouselItem key={s.title} className={s.tone}>
            <CarouselLabel className="text-title-lg">{s.title}</CarouselLabel>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  )
}
