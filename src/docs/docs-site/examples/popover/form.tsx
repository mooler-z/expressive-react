import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { Popover, PopoverTitle, PopoverTrigger } from "@/components/ui/popover"
import { snackbar } from "@/components/ui/snackbar"
import { TextField } from "@/components/ui/text-field"

export default function PopoverForm() {
  return (
    <PopoverTrigger>
      <Button variant="outlined" icon={<Icon name="edit" />}>
        Rename
      </Button>
      <Popover className="w-80">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            snackbar(`Renamed to “${new FormData(e.currentTarget).get("name")}”`)
          }}
        >
          <PopoverTitle>Rename service</PopoverTitle>
          <TextField name="name" label="Name" defaultValue="checkout-api" autoFocus className="mt-4" />
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="text" slot="close">
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </Popover>
    </PopoverTrigger>
  )
}
