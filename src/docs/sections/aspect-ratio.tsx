import { AspectRatio, MediaLabel, MediaPlaceholder } from "@/components/ui/aspect-ratio"
import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardMedia } from "@/components/ui/card"
import { Icon } from "@/components/ui/icon"
import { IconButton } from "@/components/ui/icon-button"
import { LoadingIndicator } from "@/components/ui/loading-indicator"
import { Section, Variant, Variants } from "@/docs/section"

export default function AspectRatioSection() {
  return (
    <Section id="aspect-ratio" description="16:9, 4:3 and 1:1 media frames with the M3 media placeholder.">
      <div className="grid gap-4 sm:grid-cols-3">
        <AspectRatio ratio={16 / 9} className="rounded-lg">
          <MediaPlaceholder color="primary" label="16 : 9" />
        </AspectRatio>
        <AspectRatio ratio={4 / 3} className="rounded-lg">
          <MediaPlaceholder color="tertiary" label="4 : 3" />
        </AspectRatio>
        <AspectRatio ratio={1} className="rounded-lg">
          <MediaPlaceholder color="secondary" label="1 : 1" />
        </AspectRatio>
      </div>

      <Variants cols="md:grid-cols-2 xl:grid-cols-3">
        <Variant n={1} label="21:9 · overlay title" className="relative min-h-24 rounded-lg bg-surface p-4">
          <AspectRatio ratio={21 / 9} className="rounded-lg">
            <MediaPlaceholder color="secondary" icon="landscape">
              <MediaLabel className="top-2 bottom-auto">21 : 9</MediaLabel>
              <div className="absolute inset-x-0 bottom-0 bg-scrim/60 px-4 py-3 text-start">
                <div className="text-title-md text-white">Kestrel Summit 2026</div>
                <div className="text-body-sm text-white/90">Stockholm · Nov 12</div>
              </div>
            </MediaPlaceholder>
          </AspectRatio>
        </Variant>

        <Variant n={2} label="Portrait · 9:16 & 4:5">
          <AspectRatio ratio={9 / 16} className="w-28 rounded-lg">
            <MediaPlaceholder color="tertiary" icon="movie" label="9 : 16" className="[--icon-size:32px]">
              <div className="absolute inset-x-2 top-2 flex gap-1">
                {[100, 45, 0].map((p, i) => (
                  <span key={i} className="relative h-0.5 flex-1 overflow-hidden rounded-full bg-on-tertiary-container/30">
                    <span className="absolute inset-y-0 left-0 rounded-full bg-on-tertiary-container" style={{ width: `${p}%` }} />
                  </span>
                ))}
              </div>
              <div className="absolute top-4 left-2 flex items-center gap-1.5">
                <Avatar size="xs" name="Maya Lindqvist" color="tertiary-solid" className="size-5 text-[9px]" />
                <span className="text-label-sm">maya</span>
              </div>
            </MediaPlaceholder>
          </AspectRatio>
          <AspectRatio ratio={4 / 5} className="w-36 rounded-lg">
            <MediaPlaceholder color="primary" label="4 : 5" className="[--icon-size:32px]" />
          </AspectRatio>
        </Variant>

        <Variant n={3} label="3:2 · in a card">
          <Card className="w-full max-w-[280px]">
            <CardMedia ratio={3 / 2}>
              <MediaPlaceholder icon="cabin" label="3 : 2" />
            </CardMedia>
            <CardContent>
              <div className="text-title-md">Glacier Peak cabin</div>
              <div className="text-body-sm text-on-surface-variant">2 guests · 1 bedroom · lake view</div>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-title-sm">
                  €184 <span className="font-normal text-on-surface-variant">/ night</span>
                </span>
                <Button variant="text">Reserve</Button>
              </div>
            </CardContent>
          </Card>
        </Variant>

        <Variant n={4} label="Video · play & progress" className="relative min-h-24 rounded-lg bg-surface p-4">
          <AspectRatio ratio={16 / 9} className="rounded-lg">
            <div className="grid size-full place-items-center bg-surface-container-highest">
              <IconButton variant="filled" size="md" aria-label="Play" className="shadow-3 [--icon-size:32px]">
                <Icon filled>play_arrow</Icon>
              </IconButton>
              <span className="absolute right-2 bottom-3 rounded-xs bg-scrim/70 px-1.5 py-0.5 font-mono text-label-sm text-white">12:48</span>
              <span className="absolute inset-x-0 bottom-0 h-1 bg-on-surface/10">
                <span className="block h-full w-1/3 bg-primary" />
              </span>
            </div>
          </AspectRatio>
        </Variant>

        <Variant n={5} label="Mixed-ratio gallery" className="relative min-h-24 rounded-lg bg-surface p-4">
          <AspectRatio ratio={3 / 2} className="grid grid-cols-4 grid-rows-2 gap-1 rounded-lg">
            <MediaPlaceholder color="primary" className="col-span-2 row-span-2" />
            <MediaPlaceholder color="secondary" className="[--icon-size:20px]" />
            <MediaPlaceholder color="tertiary" className="[--icon-size:20px]" />
            <MediaPlaceholder color="neutral" className="[--icon-size:20px]" />
            <MediaPlaceholder className="bg-primary-fixed-dim text-on-primary-fixed [--icon-size:20px]">
              <span className="absolute inset-0 grid place-items-center bg-scrim/50 text-title-md text-white">+12</span>
            </MediaPlaceholder>
          </AspectRatio>
        </Variant>

        <Variant n={6} label="Loading · failed" className="relative grid min-h-24 grid-cols-2 gap-3 rounded-lg bg-surface p-4">
          <AspectRatio ratio={4 / 3} className="grid animate-pulse place-items-center rounded-lg bg-surface-container-highest">
            <LoadingIndicator size={40} />
          </AspectRatio>
          <AspectRatio ratio={4 / 3} className="flex flex-col items-center justify-center gap-1 rounded-lg bg-error-container p-2 text-center text-on-error-container">
            <Icon size={28}>broken_image</Icon>
            <span className="text-label-md">Couldn't load</span>
            <Button variant="text" size="xs" className="text-on-error-container">
              Retry
            </Button>
          </AspectRatio>
        </Variant>
      </Variants>
    </Section>
  )
}
