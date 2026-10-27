import { MediaLabel } from "@/components/ui/aspect-ratio"
import { Button } from "@/components/ui/button"
import { Card, CardActions, CardContent, CardDescription, CardMedia, CardTitle } from "@/components/ui/card"
import { Icon } from "@/components/ui/icon"

export default function CardWithMedia() {
  return (
    <div className="grid w-full max-w-2xl gap-4 sm:grid-cols-2">
      <Card>
        <CardMedia className="bg-tertiary-container text-on-tertiary-container [--icon-size:40px]">
          <Icon name="image" />
          <MediaLabel>16 : 9</MediaLabel>
        </CardMedia>
        <CardContent>
          <CardTitle>Default ratio</CardTitle>
          <CardDescription className="mt-1">CardMedia is 16:9 unless you pass a ratio.</CardDescription>
        </CardContent>
      </Card>
      <Card>
        <CardMedia ratio={1} className="bg-secondary-container text-on-secondary-container [--icon-size:40px]">
          <Icon name="photo_camera" />
          <MediaLabel>1 : 1</MediaLabel>
        </CardMedia>
        <CardContent>
          <CardTitle>Square media</CardTitle>
        </CardContent>
        <CardActions>
          <Button variant="text">Save</Button>
        </CardActions>
      </Card>
    </div>
  )
}
