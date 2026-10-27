import { DirectionProvider } from "@/components/ui/direction"

export default function DirectionBidi() {
  return (
    <DirectionProvider dir="rtl" className="w-full max-w-md space-y-2 rounded-lg bg-surface-container-low p-4 text-body-lg text-on-surface">
      <p>
        نشر <bdi className="font-mono">checkout-api v1.24.0</bdi> إلى الإنتاج
      </p>
      <p>
        بواسطة <bdi>Maya Lindqvist</bdi> · قبل ١٢ دقيقة
      </p>
    </DirectionProvider>
  )
}
