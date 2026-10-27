import { Button } from "@/components/ui/button"

export default function ButtonSquare() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Button variant="tonal" shape="square" size="xs">Extra small</Button>
      <Button variant="tonal" shape="square" size="sm">Small</Button>
      <Button variant="tonal" shape="square" size="md">Medium</Button>
      <Button variant="tonal" shape="square" size="lg">Large</Button>
      <Button variant="tonal" shape="square" size="xl">Extra large</Button>
    </div>
  )
}
