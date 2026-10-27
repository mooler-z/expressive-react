import { Pagination } from "@/components/ui/pagination"

export default function PaginationVariants() {
  return (
    <div className="flex flex-col items-center gap-5">
      <Pagination aria-label="Standard" pageCount={9} defaultPage={3} />
      <Pagination aria-label="Tonal" variant="tonal" pageCount={9} defaultPage={3} />
      <Pagination aria-label="Outlined" variant="outlined" pageCount={9} defaultPage={3} />
      <Pagination aria-label="Connected" variant="connected" pageCount={9} defaultPage={3} />
    </div>
  )
}
