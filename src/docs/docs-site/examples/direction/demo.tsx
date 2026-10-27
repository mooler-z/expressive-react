import { Button } from "@/components/ui/button"
import { DirectionProvider } from "@/components/ui/direction"
import { Icon } from "@/components/ui/icon"
import { TextField } from "@/components/ui/text-field"

export default function DirectionDemo() {
  return (
    <DirectionProvider dir="rtl" className="w-full max-w-sm space-y-4 rounded-lg bg-surface-container-low p-4">
      <TextField label="البريد الإلكتروني" type="email" defaultValue="maya@kestrel.io" leading="mail" />
      <div className="flex justify-end gap-2">
        <Button variant="text">إلغاء</Button>
        <Button trailingIcon={<Icon name="arrow_forward" className="rtl:-scale-x-100" />}>متابعة</Button>
      </div>
    </DirectionProvider>
  )
}
