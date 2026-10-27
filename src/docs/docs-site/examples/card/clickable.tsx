import { CardButton, CardContent, CardDescription, CardLink, CardTitle } from "@/components/ui/card"
import { Icon } from "@/components/ui/icon"
import { snackbar } from "@/components/ui/snackbar"

export default function ClickableCards() {
  return (
    <div className="grid w-full max-w-2xl gap-4 sm:grid-cols-2">
      <CardButton variant="filled" onPress={() => snackbar("Opened workspace")}>
        <CardContent className="flex items-start gap-3">
          <Icon name="folder_open" className="text-primary" />
          <div>
            <CardTitle className="text-title-md">CardButton</CardTitle>
            <CardDescription className="mt-1">The whole card is one action: state layer, ripple and a 3dp focus ring.</CardDescription>
          </div>
        </CardContent>
      </CardButton>
      <CardLink variant="outlined" href="https://m3.material.io/components/cards/overview" target="_blank">
        <CardContent className="flex items-start gap-3">
          <Icon name="open_in_new" className="text-primary" />
          <div>
            <CardTitle className="text-title-md">CardLink</CardTitle>
            <CardDescription className="mt-1">Navigates like a link. Hover raises it one elevation level.</CardDescription>
          </div>
        </CardContent>
      </CardLink>
    </div>
  )
}
