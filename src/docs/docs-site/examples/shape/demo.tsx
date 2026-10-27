import { Shape } from "@/components/ui/shape"

export default function ShapeDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-8">
      <Shape cycle={["cookie9", "clover4", "sunny", "pentagon"]} interval={1600} className="size-32 text-primary" />
      <Shape shape="arch" hoverShape="burst" className="size-32 text-tertiary-container" />
      <Shape shape="squircle" hoverShape="clover8" className="size-32 text-secondary" />
    </div>
  )
}
