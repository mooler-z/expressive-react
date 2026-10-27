import { useState } from "react"

import { Pagination } from "@/components/ui/pagination"

export default function PaginationDemo() {
  const [page, setPage] = useState(4)

  return (
    <div className="flex flex-col items-center gap-4">
      <Pagination page={page} onPageChange={setPage} pageCount={12} />
      <p className="text-body-md text-on-surface-variant">Page {page} of 12</p>
    </div>
  )
}
