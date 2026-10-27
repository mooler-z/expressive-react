import { BreadcrumbBack } from "@/components/ui/breadcrumb"
import { snackbar } from "@/components/ui/snackbar"

export default function BreadcrumbBackExample() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-1 rounded-xl border border-outline-variant p-3">
      <BreadcrumbBack onPress={() => snackbar("Back to Projects")}>Projects</BreadcrumbBack>
      <h3 className="px-1 text-title-lg">Kestrel</h3>
    </div>
  )
}
