import { Avatar } from "@/components/ui/avatar"
import { StatusBadge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardSubtitle, CardTitle } from "@/components/ui/card"
import { Icon } from "@/components/ui/icon"
import { IconButton } from "@/components/ui/icon-button"

export default function CardHeaderExample() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <Avatar name="Maya Lindqvist" />
        <div className="min-w-0 flex-1">
          <CardTitle className="truncate text-title-md">Maya Lindqvist</CardTitle>
          <CardSubtitle>Platform team</CardSubtitle>
        </div>
        <StatusBadge variant="tertiary">On call</StatusBadge>
        <IconButton aria-label="More options">
          <Icon name="more_vert" />
        </IconButton>
      </CardHeader>
      <CardContent className="pt-0">
        <CardDescription>CardHeader lines up an avatar, a title block and trailing actions with 12dp gaps.</CardDescription>
      </CardContent>
    </Card>
  )
}
