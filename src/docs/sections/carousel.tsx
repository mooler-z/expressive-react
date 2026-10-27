import { Button } from "@/components/ui/button"
import {
  Carousel,
  CarouselContent,
  CarouselCount,
  CarouselDots,
  CarouselItem,
  CarouselLabel,
  CarouselMedia,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Shape, type ShapeName } from "@/components/ui/shape"
import { snackbar } from "@/components/ui/snackbar"
import { Section, Variant, Variants } from "@/docs/section"
import { cn } from "@/lib/utils"

type Slide = { title: string; body: string; tone: string; art: string; shapes: ShapeName[] }

const SLIDES: Slide[] = [
  { title: "Edge regions", body: "42 points of presence", tone: "bg-primary-container text-on-primary-container", art: "text-primary/30", shapes: ["cookie9", "clover8", "sunny"] },
  { title: "Service mesh", body: "Zero-trust by default", tone: "bg-tertiary-container text-on-tertiary-container", art: "text-tertiary/30", shapes: ["arch", "squircle", "oval"] },
  { title: "Compute", body: "Autoscaling in seconds", tone: "bg-secondary-container text-on-secondary-container", art: "text-secondary/30", shapes: ["clover4", "cookie6", "pentagon"] },
  { title: "Storage", body: "Three copies, two regions", tone: "bg-primary-fixed-dim text-on-primary-fixed", art: "text-on-primary-fixed/20", shapes: ["hexagon", "gem", "cookie4"] },
  { title: "Observability", body: "Traces, logs, metrics", tone: "bg-surface-container-highest text-on-surface", art: "text-primary/25", shapes: ["burst", "softBurst", "puffy"] },
  { title: "Identity", body: "SSO and SCIM", tone: "bg-inverse-surface text-inverse-on-surface", art: "text-inverse-primary/40", shapes: ["diamond", "squircle", "cookie7"] },
  { title: "Billing", body: "Usage-based, per project", tone: "bg-tertiary text-on-tertiary", art: "text-on-tertiary/25", shapes: ["verySunny", "cookie12", "circle"] },
]

function Art({ slide, i, className }: { slide: Slide; i: number; className?: string }) {
  return (
    <CarouselMedia>
      <Shape
        cycle={slide.shapes}
        interval={3000 + i * 350}
        className={cn("absolute -top-10 -right-8 size-48 md:size-56", slide.art, className)}
      />
    </CarouselMedia>
  )
}

export default function CarouselSection() {
  return (
    <Section
      id="carousel"
      description="Large, medium and small items with 28dp corners and labels over the media. Items are masked to the M3 keylines as they scroll, so they grow and shrink; artwork drifts with the scroll and labels fade as an item narrows. Every color comes from the theme roles."
      spec="https://m3.material.io/components/carousel/overview"
    >
      <Carousel layout="multi-browse" itemSize={340} aria-label="Platform highlights">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <span className="text-body-sm text-on-surface-variant">Drag, swipe, use the arrows or ← →.</span>
          <div className="flex items-center gap-2">
            <CarouselCount className="mr-1" />
            <CarouselPrevious />
            <CarouselNext />
          </div>
        </div>
        <CarouselContent className="h-56 md:h-64">
          {SLIDES.map((s, i) => (
            <CarouselItem key={s.title} className={s.tone}>
              <Art slide={s} i={i} />
              <CarouselLabel>
                <div className="text-title-md">{s.title}</div>
                <div className="text-body-sm">{s.body}</div>
              </CarouselLabel>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselDots className="mt-4" />
      </Carousel>

      <Variants cols="lg:grid-cols-2">
        <Variant n={1} label="Multi-browse" className="rounded-lg bg-surface p-3">
          <Carousel layout="multi-browse" itemSize={200} aria-label="Multi-browse" className="w-full">
            <CarouselContent className="h-40">
              {SLIDES.map((s, i) => (
                <CarouselItem key={s.title} className={s.tone}>
                  <Art slide={s} i={i} className="size-36 md:size-40" />
                  <CarouselLabel className="p-3">
                    <div className="truncate text-title-sm">{s.title}</div>
                  </CarouselLabel>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="mt-3 flex items-center justify-between">
              <CarouselCount className="text-label-sm" />
              <CarouselDots />
              <span className="flex gap-1">
                <CarouselPrevious size="xs" />
                <CarouselNext size="xs" />
              </span>
            </div>
          </Carousel>
        </Variant>

        <Variant n={2} label="Uncontained" className="rounded-lg bg-surface py-3 pl-3">
          <Carousel layout="uncontained" itemSize={160} aria-label="Uncontained" className="w-full">
            <CarouselContent className="h-44 pr-3">
              {SLIDES.map((s, i) => (
                <CarouselItem key={s.title}>
                  <div className={cn("relative h-24 overflow-hidden rounded-lg", s.tone)}>
                    <Art slide={s} i={i} className="-top-6 -right-6 size-32 md:size-32" />
                  </div>
                  <CarouselLabel className="static px-1 pt-2 pb-0">
                    <div className="truncate text-title-sm">{s.title}</div>
                    <div className="truncate text-body-sm text-on-surface-variant">{s.body}</div>
                  </CarouselLabel>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="mt-2 flex items-center justify-between pr-3">
              <CarouselDots />
              <CarouselCount className="text-label-sm" />
            </div>
          </Carousel>
        </Variant>

        <Variant n={3} label="Hero" className="rounded-lg bg-surface p-3">
          <Carousel layout="hero" aria-label="Hero" className="w-full">
            <CarouselContent className="h-48">
              {SLIDES.map((s, i) => (
                <CarouselItem key={s.title} className={s.tone}>
                  <Art slide={s} i={i} />
                  <CarouselLabel className="flex items-end justify-between gap-3">
                    <div className="min-w-0">
                      <div className="truncate text-title-md">{s.title}</div>
                      <div className="truncate text-body-sm">{s.body}</div>
                    </div>
                    <Button
                      variant="elevated"
                      size="xs"
                      className="bg-surface"
                      onPress={() => snackbar(`Opening ${s.title}`)}
                    >
                      Open
                    </Button>
                  </CarouselLabel>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-body-sm text-on-surface-variant">The focal item is large; the next one previews</span>
              <span className="flex gap-1">
                <CarouselPrevious size="xs" />
                <CarouselNext size="xs" />
              </span>
            </div>
          </Carousel>
        </Variant>

        <Variant n={4} label="Center-aligned hero" className="rounded-lg bg-surface p-3">
          <Carousel layout="center-hero" aria-label="Center-aligned hero" className="w-full">
            <CarouselContent className="h-48">
              {[...SLIDES.slice(4), ...SLIDES.slice(0, 4)].map((s, i) => (
                <CarouselItem key={s.title} className={s.tone}>
                  <Art slide={s} i={i} />
                  <CarouselLabel>
                    <div className="truncate text-title-md">{s.title}</div>
                    <div className="truncate text-body-sm">{s.body}</div>
                  </CarouselLabel>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="mt-3 flex items-center justify-center gap-4">
              <CarouselPrevious size="xs" />
              <CarouselDots />
              <CarouselNext size="xs" />
            </div>
          </Carousel>
        </Variant>

        <Variant n={5} label="Full-screen · vertical, autoplay" className="relative overflow-hidden rounded-lg bg-surface">
          <Carousel layout="full-screen" autoplay={3800} aria-label="Full-screen" className="w-full">
            <CarouselContent className="h-64">
              {SLIDES.slice(0, 5).map((s, i) => (
                <CarouselItem key={s.title} className={s.tone}>
                  <Art slide={s} i={i} className="size-56" />
                  <CarouselLabel className="p-5 pr-14">
                    <div className="text-headline-sm font-medium">{s.title}</div>
                    <div className="mt-1 text-body-md">{s.body}</div>
                  </CarouselLabel>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselDots className="absolute inset-y-0 right-3" />
            <CarouselCount className="absolute top-3 right-3 text-label-sm" />
          </Carousel>
        </Variant>
      </Variants>
    </Section>
  )
}
