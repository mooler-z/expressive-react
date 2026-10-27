import { Button } from "@/components/ui/button"
import { ThemeScope, type SchemeVariant } from "@/components/ui/theme-provider"

const variants: SchemeVariant[] = ["tonalSpot", "vibrant", "expressive", "neutral", "monochrome", "fruitSalad"]

export default function ThemeProviderVariants() {
  return (
    <div className="grid w-full grid-cols-2 gap-3 md:grid-cols-3">
      {variants.map((variant) => (
        <ThemeScope key={variant} seed="#0B57D0" variant={variant} className="flex flex-col gap-3 rounded-lg p-4">
          <h3 className="text-title-sm text-on-surface">{variant}</h3>
          <div className="flex gap-1.5">
            <span className="size-6 rounded-full bg-primary" />
            <span className="size-6 rounded-full bg-secondary" />
            <span className="size-6 rounded-full bg-tertiary" />
            <span className="size-6 rounded-full bg-surface-container-highest" />
          </div>
          <Button size="xs" variant="tonal" className="self-start">
            Tonal
          </Button>
        </ThemeScope>
      ))}
    </div>
  )
}
