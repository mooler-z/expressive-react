import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { IconButton } from "@/components/ui/icon-button"
import { snackbar } from "@/components/ui/snackbar"
import { useMediaQuery } from "@/hooks/use-media-query"

export default function MediaQueryResponsive() {
  const roomy = useMediaQuery("(min-width: 600px)")

  return roomy ? (
    <Button icon={<Icon name="add" />} onPress={() => snackbar("New deploy")}>
      New deploy
    </Button>
  ) : (
    <IconButton variant="filled" aria-label="New deploy" onPress={() => snackbar("New deploy")}>
      <Icon name="add" />
    </IconButton>
  )
}
