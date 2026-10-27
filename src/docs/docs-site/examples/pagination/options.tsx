import { Pagination } from "@/components/ui/pagination"

export default function PaginationOptions() {
  return (
    <div className="flex flex-col items-center gap-5">
      <Pagination aria-label="With labels" pageCount={20} defaultPage={10} showLabels />
      <Pagination aria-label="Small with edges" pageCount={50} defaultPage={25} size="sm" showEdges siblings={2} />
      <Pagination aria-label="Two boundary pages" pageCount={40} defaultPage={20} boundaries={2} size="sm" />
    </div>
  )
}
