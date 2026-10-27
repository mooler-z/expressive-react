import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardMedia, CardOverline, CardTitle } from "@/components/ui/card"
import { Icon } from "@/components/ui/icon"

export default function HorizontalCard() {
  return (
    <Card variant="outlined" className="w-full max-w-xl flex-row">
      <CardMedia ratio={null} className="w-28 bg-primary-container text-on-primary-container [--icon-size:32px] sm:w-40">
        <Icon name="podcasts" />
      </CardMedia>
      <CardContent className="flex min-w-0 flex-1 flex-col gap-1">
        <CardOverline>Episode 42 · 38 min</CardOverline>
        <CardTitle className="truncate text-title-md">Designing with springs</CardTitle>
        <CardDescription className="line-clamp-2">Why M3 Expressive moved from duration curves to physics.</CardDescription>
        <div className="mt-2">
          <Button size="xs" variant="tonal" icon={<Icon name="play_arrow" />}>
            Play
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
