import { useState } from "react"

import { Carousel, CarouselContent, CarouselDots, CarouselItem, CarouselLabel } from "@/components/ui/carousel"

const TIPS = [
  { title: "Press and hold any button", tone: "bg-primary-container text-on-primary-container" },
  { title: "Try a seed color", tone: "bg-tertiary-container text-on-tertiary-container" },
  { title: "Toggle dark mode", tone: "bg-secondary-container text-on-secondary-container" },
  { title: "Open the command palette", tone: "bg-surface-container-highest text-on-surface" },
]

export default function AutoplayCarousel() {
  const [index, setIndex] = useState(0)

  return (
    <div className="w-full max-w-2xl">
      <Carousel layout="hero" autoplay={3000} onIndexChange={setIndex} aria-label="Tips">
        <CarouselContent className="h-48">
          {TIPS.map((t) => (
            <CarouselItem key={t.title} className={t.tone}>
              <CarouselLabel className="text-title-lg">{t.title}</CarouselLabel>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselDots className="mt-4" />
      </Carousel>
      <p className="mt-2 text-center text-body-sm text-on-surface-variant">
        Tip {index + 1} of {TIPS.length} · pauses on hover and focus
      </p>
    </div>
  )
}
