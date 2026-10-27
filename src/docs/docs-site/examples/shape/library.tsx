import { Shape, shapeNames } from "@/components/ui/shape"

export default function ShapeLibrary() {
  return (
    <div className="grid w-full grid-cols-4 gap-4 sm:grid-cols-7">
      {shapeNames.map((name) => (
        <figure key={name} className="flex flex-col items-center gap-2">
          <Shape shape={name} hoverShape="sunny" className="w-full max-w-16 text-primary" />
          <figcaption className="text-label-sm text-on-surface-variant">{name}</figcaption>
        </figure>
      ))}
    </div>
  )
}
