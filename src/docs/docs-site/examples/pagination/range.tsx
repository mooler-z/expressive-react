import { useState } from "react"

import { PaginationRange } from "@/components/ui/pagination"

export default function PaginationRangeExample() {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)

  return (
    <PaginationRange
      page={page}
      onPageChange={setPage}
      pageSize={pageSize}
      onPageSizeChange={(size) => {
        setPageSize(size)
        setPage(1)
      }}
      pageSizeOptions={[10, 25, 50, 100]}
      total={240}
      showJump
    />
  )
}
