import { shapePolygon } from "@/components/ui/shape"

export default function ShapeClip() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-6">
      <div
        className="grid size-28 place-items-center bg-linear-to-br from-primary to-tertiary text-headline-sm text-on-primary"
        style={{ clipPath: shapePolygon("cookie9") }}
      >
        MK
      </div>
      <div
        className="size-28 bg-linear-to-tr from-secondary-container to-primary-container transition-[clip-path] duration-500 ease-spring [clip-path:var(--rest)] hover:[clip-path:var(--hover)]"
        style={{ ["--rest" as string]: shapePolygon("squircle"), ["--hover" as string]: shapePolygon("clover4") }}
      />
      <div className="size-28 bg-tertiary-container" style={{ clipPath: shapePolygon("arch") }} />
    </div>
  )
}
