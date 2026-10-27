import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardActions, CardContent, CardDescription, CardHeader, CardMedia, CardSubtitle, CardTitle } from "@/components/ui/card"
import { Icon } from "@/components/ui/icon"
import { IconButton } from "@/components/ui/icon-button"

export default function CardDemo() {
  return (
    <div className="grid w-full max-w-4xl gap-4 md:grid-cols-3">
      <Card variant="elevated">
        <CardMedia className="bg-primary-container text-on-primary-container [--icon-size:40px]">
          <Icon name="landscape" />
        </CardMedia>
        <CardContent>
          <CardTitle>Glacier Peak</CardTitle>
          <CardDescription className="mt-2">An elevated card: a 3,213 m stratovolcano in the North Cascades.</CardDescription>
        </CardContent>
        <CardActions>
          <Button variant="outlined">Share</Button>
          <Button>Open</Button>
        </CardActions>
      </Card>

      <Card variant="filled">
        <CardHeader>
          <Avatar name="Ana Ruiz" color="tertiary" />
          <div className="min-w-0">
            <CardTitle className="text-title-md">Ana Ruiz</CardTitle>
            <CardSubtitle>Shared a route · 2h</CardSubtitle>
          </div>
          <IconButton aria-label="More options" className="ml-auto">
            <Icon name="more_vert" />
          </IconButton>
        </CardHeader>
        <CardContent className="pt-0">
          <CardDescription>Filled cards sit on surface-container-highest for subtle separation from the page.</CardDescription>
        </CardContent>
        <CardActions className="mt-auto justify-start">
          <Button variant="tonal">Reply</Button>
        </CardActions>
      </Card>

      <Card variant="outlined">
        <CardContent>
          <CardTitle>Weekly report</CardTitle>
          <CardDescription className="mt-2">An outlined card: a 1dp outline-variant border on surface, for busy backgrounds.</CardDescription>
        </CardContent>
        <CardActions className="mt-auto">
          <Button variant="text">Dismiss</Button>
          <Button variant="text">Read</Button>
        </CardActions>
      </Card>
    </div>
  )
}
