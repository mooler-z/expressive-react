import { Button } from "@/components/ui/button"

export default function ButtonDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Button variant="elevated" size="md">Elevated</Button>
      <Button size="md">Filled</Button>
      <Button variant="tonal" size="md">Tonal</Button>
      <Button variant="outlined" size="md">Outlined</Button>
      <Button variant="text" size="md">Text</Button>
    </div>
  )
}
