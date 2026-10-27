import { Button } from "@/components/ui/button"

export default function ButtonDisabled() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Button isDisabled>Filled</Button>
      <Button variant="tonal" isDisabled>Tonal</Button>
      <Button variant="elevated" isDisabled>Elevated</Button>
      <Button variant="outlined" isDisabled>Outlined</Button>
      <Button variant="text" isDisabled>Text</Button>
    </div>
  )
}
